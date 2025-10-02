import { Internship, Application, Industry, Student, Faculty } from '../models/index.js';
import { AppError } from '../utils/appError.js';
import { generatePaginationMeta, cleanObject, isDateInPast } from '../utils/helpers.js';
import { sendEmail, emailTemplates } from '../config/email.js';

class InternshipService {
  // Create new internship
  async createInternship(internshipData, createdBy) {
    // Verify that the creator is an industry user
    const industry = await Industry.findById(createdBy);
    if (!industry) {
      throw new AppError('Only industry users can create internships', 403);
    }

    // Check if industry can post more internships
    if (!industry.canPostMoreInternships()) {
      throw new AppError('You have reached your internship posting limit', 403);
    }

    // Create internship
    const internship = await Internship.create({
      ...internshipData,
      company: createdBy,
      createdBy
    });

    // Update industry stats
    industry.stats.internshipsPosted += 1;
    await industry.save();

    return await this.getInternshipById(internship._id);
  }

  // Get internship by ID
  async getInternshipById(internshipId, populateCompany = true) {
    let query = Internship.findById(internshipId);
    
    if (populateCompany) {
      query = query.populate('company', 'name company.name company.logo company.industry headquarters verification');
    }

    const internship = await query;
    
    if (!internship) {
      throw new AppError('Internship not found', 404);
    }

    return internship;
  }

  // Get all internships with filters
  async getAllInternships(filters = {}, pagination = {}, sort = {}) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    // Build query
    const query = { status: 'active' }; // Only show active internships by default
    
    if (filters.domain) {
      query.domain = { $regex: filters.domain, $options: 'i' };
    }
    
    if (filters.type) {
      query.type = filters.type;
    }
    
    if (filters.location) {
      query['location.city'] = { $regex: filters.location, $options: 'i' };
    }
    
    if (filters.isPaid !== undefined) {
      query['stipend.isPaid'] = filters.isPaid;
    }
    
    if (filters.company) {
      query.company = filters.company;
    }
    
    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }
    
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { domain: { $regex: filters.search, $options: 'i' } }
      ];
    }

    // Date filters
    if (filters.applicationDeadlineAfter) {
      query.applicationDeadline = { $gte: new Date(filters.applicationDeadlineAfter) };
    }
    
    if (filters.startDateAfter) {
      query.startDate = { $gte: new Date(filters.startDateAfter) };
    }

    // Only show approved internships for public view
    if (!filters.includeUnapproved) {
      query['approval.status'] = 'approved';
    }

    // Execute query
    const internships = await Internship.find(query)
      .populate('company', 'name company.name company.logo company.industry headquarters')
      .sort(sort.createdAt ? { createdAt: sort.createdAt } : { createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalInternships = await Internship.countDocuments(query);
    const paginationMeta = generatePaginationMeta(totalInternships, page, limit);

    return {
      internships,
      pagination: paginationMeta
    };
  }

  // Update internship
  async updateInternship(internshipId, updateData, userId) {
    const internship = await Internship.findById(internshipId);
    
    if (!internship) {
      throw new AppError('Internship not found', 404);
    }

    // Check if user can update this internship
    if (internship.createdBy.toString() !== userId.toString()) {
      throw new AppError('You can only update your own internships', 403);
    }

    // Clean update data
    const cleanedData = cleanObject(updateData);

    const updatedInternship = await Internship.findByIdAndUpdate(
      internshipId,
      cleanedData,
      { new: true, runValidators: true }
    ).populate('company', 'name company.name company.logo');

    return updatedInternship;
  }

  // Delete internship
  async deleteInternship(internshipId, userId) {
    const internship = await Internship.findById(internshipId);
    
    if (!internship) {
      throw new AppError('Internship not found', 404);
    }

    // Check if user can delete this internship
    if (internship.createdBy.toString() !== userId.toString()) {
      throw new AppError('You can only delete your own internships', 403);
    }

    // Check if there are any applications
    const applicationCount = await Application.countDocuments({ internship: internshipId });
    if (applicationCount > 0) {
      throw new AppError('Cannot delete internship with existing applications', 400);
    }

    await Internship.findByIdAndDelete(internshipId);

    return { message: 'Internship deleted successfully' };
  }

  // Apply for internship
  async applyForInternship(internshipId, studentId, applicationData) {
    const internship = await Internship.findById(internshipId);
    
    if (!internship) {
      throw new AppError('Internship not found', 404);
    }

    // Check if internship is open for applications
    if (!internship.isApplicationOpen) {
      throw new AppError('Applications are closed for this internship', 400);
    }

    // Check if student already applied
    const existingApplication = await Application.findOne({
      student: studentId,
      internship: internshipId
    });

    if (existingApplication) {
      throw new AppError('You have already applied for this internship', 400);
    }

    // Create application
    const application = await Application.create({
      student: studentId,
      internship: internshipId,
      ...applicationData
    });

    // Update internship stats
    internship.stats.applications += 1;
    await internship.save();

    // Get student and company details for email
    const student = await Student.findById(studentId);
    const company = await Industry.findById(internship.company);

    // Send confirmation email to student
    try {
      await sendEmail({
        to: student.email,
        ...emailTemplates.applicationSubmitted(student.name, internship.title, company.company.name)
      });
    } catch (error) {
      console.error('Failed to send application confirmation email:', error);
    }

    return await Application.findById(application._id)
      .populate('student', 'name email studentId')
      .populate('internship', 'title company');
  }

  // Get internship applications
  async getInternshipApplications(internshipId, userId, filters = {}, pagination = {}) {
    const internship = await Internship.findById(internshipId);
    
    if (!internship) {
      throw new AppError('Internship not found', 404);
    }

    // Check if user can view applications
    if (internship.createdBy.toString() !== userId.toString()) {
      throw new AppError('You can only view applications for your own internships', 403);
    }

    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    // Build query
    const query = { internship: internshipId };
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    if (filters.facultyApprovalStatus) {
      query['facultyApproval.status'] = filters.facultyApprovalStatus;
    }

    // Execute query
    const applications = await Application.find(query)
      .populate('student', 'name email studentId college department semester cgpa skills')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalApplications = await Application.countDocuments(query);
    const paginationMeta = generatePaginationMeta(totalApplications, page, limit);

    return {
      applications,
      pagination: paginationMeta
    };
  }

  // Update application status
  async updateApplicationStatus(applicationId, newStatus, userId, notes = '') {
    const application = await Application.findById(applicationId)
      .populate('internship')
      .populate('student', 'name email');
    
    if (!application) {
      throw new AppError('Application not found', 404);
    }

    // Check if user can update this application
    if (application.internship.createdBy.toString() !== userId.toString()) {
      throw new AppError('You can only update applications for your own internships', 403);
    }

    // Update application status
    await application.updateStatus(newStatus, notes, userId);

    // Update internship stats
    if (newStatus === 'shortlisted') {
      application.internship.stats.shortlisted += 1;
    } else if (newStatus === 'selected') {
      application.internship.stats.selected += 1;
    }
    await application.internship.save();

    // Send status update email to student
    try {
      await sendEmail({
        to: application.student.email,
        ...emailTemplates.applicationStatusUpdate(
          application.student.name,
          application.internship.title,
          newStatus
        )
      });
    } catch (error) {
      console.error('Failed to send status update email:', error);
    }

    return application;
  }

  // Get internships by company
  async getInternshipsByCompany(companyId, filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const query = { company: companyId, ...filters };

    const internships = await Internship.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalInternships = await Internship.countDocuments(query);
    const paginationMeta = generatePaginationMeta(totalInternships, page, limit);

    return {
      internships,
      pagination: paginationMeta
    };
  }

  // Approve/Reject internship (Faculty only)
  async reviewInternship(internshipId, action, facultyId, reason = '') {
    const internship = await Internship.findById(internshipId);
    
    if (!internship) {
      throw new AppError('Internship not found', 404);
    }

    if (internship.approval.status !== 'pending') {
      throw new AppError('Internship has already been reviewed', 400);
    }

    // Update approval status
    internship.approval.status = action; // 'approved' or 'rejected'
    internship.approval.approvedBy = facultyId;
    internship.approval.approvedAt = new Date();
    
    if (action === 'rejected') {
      internship.approval.rejectionReason = reason;
      internship.status = 'cancelled';
    } else {
      internship.status = 'active';
    }

    await internship.save();

    return internship;
  }

  // Get internship statistics
  async getInternshipStatistics(companyId = null) {
    const matchStage = companyId ? { company: companyId } : {};

    const stats = await Internship.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalApplications: { $sum: '$stats.applications' },
          totalViews: { $sum: '$stats.views' }
        }
      }
    ]);

    const domainStats = await Internship.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$domain',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const typeStats = await Internship.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    return {
      byStatus: stats.reduce((acc, stat) => {
        acc[stat._id] = {
          count: stat.count,
          totalApplications: stat.totalApplications,
          totalViews: stat.totalViews
        };
        return acc;
      }, {}),
      topDomains: domainStats,
      byType: typeStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {})
    };
  }

  // Search internships
  async searchInternships(searchQuery, filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const query = {
      $and: [
        {
          $or: [
            { title: { $regex: searchQuery, $options: 'i' } },
            { description: { $regex: searchQuery, $options: 'i' } },
            { domain: { $regex: searchQuery, $options: 'i' } },
            { tags: { $in: [new RegExp(searchQuery, 'i')] } }
          ]
        },
        { status: 'active' },
        { 'approval.status': 'approved' },
        ...Object.entries(filters).map(([key, value]) => ({ [key]: value }))
      ]
    };

    const internships = await Internship.find(query)
      .populate('company', 'name company.name company.logo company.industry')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalInternships = await Internship.countDocuments(query);
    const paginationMeta = generatePaginationMeta(totalInternships, page, limit);

    return {
      internships,
      pagination: paginationMeta
    };
  }

  // Increment internship views
  async incrementViews(internshipId) {
    await Internship.findByIdAndUpdate(
      internshipId,
      { $inc: { 'stats.views': 1 } }
    );
  }

  // Get featured internships
  async getFeaturedInternships(limit = 6) {
    return await Internship.find({
      status: 'active',
      'approval.status': 'approved',
      isFeatured: true
    })
      .populate('company', 'name company.name company.logo')
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  // Get recent internships
  async getRecentInternships(limit = 10) {
    return await Internship.find({
      status: 'active',
      'approval.status': 'approved'
    })
      .populate('company', 'name company.name company.logo')
      .sort({ createdAt: -1 })
      .limit(limit);
  }
}

export default new InternshipService();

