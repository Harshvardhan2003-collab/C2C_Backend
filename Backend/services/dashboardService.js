import { User, Student, Faculty, Industry, Internship, Application, Report } from '../models/index.js';
import { AppError } from '../utils/appError.js';
import { generatePaginationMeta } from '../utils/helpers.js';

class DashboardService {
  // Get student dashboard data
  async getStudentDashboard(studentId) {
    const student = await Student.findById(studentId)
      .populate('facultyMentor', 'name email designation department');

    if (!student) {
      throw new AppError('Student not found', 404);
    }

    // Get student's applications
    const applications = await Application.find({ student: studentId })
      .populate('internship', 'title company type location startDate endDate')
      .populate({
        path: 'internship',
        populate: {
          path: 'company',
          select: 'name company.name company.logo'
        }
      })
      .sort({ createdAt: -1 })
      .limit(10);

    // Get application statistics
    const applicationStats = await Application.aggregate([
      { $match: { student: studentId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get available internships (matching student preferences)
    const availableInternships = await Internship.find({
      status: 'active',
      'approval.status': 'approved',
      applicationDeadline: { $gte: new Date() },
      $or: [
        { 'requirements.education.preferredCourses': { $in: [student.course] } },
        { domain: { $in: student.internshipPreferences.domains || [] } },
        { 'location.city': { $in: student.internshipPreferences.locations || [] } }
      ]
    })
      .populate('company', 'name company.name company.logo')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recent reports
    const recentReports = await Report.find({ student: studentId })
      .populate('internship', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    // Calculate statistics
    const stats = {
      totalApplications: applications.length,
      ongoingInternships: applications.filter(app => 
        app.status === 'selected' && app.selection?.startDate <= new Date() && app.selection?.endDate >= new Date()
      ).length,
      completedInternships: applications.filter(app => 
        app.status === 'selected' && app.selection?.endDate < new Date()
      ).length,
      creditsEarned: student.stats.creditsEarned || 0
    };

    const applicationsByStatus = applicationStats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    return {
      student: {
        ...student.toObject(),
        profileCompletion: student.calculateProfileCompletion()
      },
      stats,
      applicationsByStatus,
      recentApplications: applications,
      availableInternships,
      recentReports
    };
  }

  // Get faculty dashboard data
  async getFacultyDashboard(facultyId) {
    const faculty = await Faculty.findById(facultyId)
      .populate('currentMentees', 'name email studentId department semester');

    if (!faculty) {
      throw new AppError('Faculty not found', 404);
    }

    // Get pending approvals
    const pendingApprovals = await Application.find({
      'facultyApproval.status': 'pending',
      student: { $in: faculty.currentMentees.map(m => m._id) }
    })
      .populate('student', 'name email studentId')
      .populate('internship', 'title company')
      .populate({
        path: 'internship',
        populate: {
          path: 'company',
          select: 'name company.name'
        }
      })
      .sort({ createdAt: -1 })
      .limit(10);

    // Get pending reports
    const pendingReports = await Report.find({
      'facultyReview.status': 'pending',
      student: { $in: faculty.currentMentees.map(m => m._id) }
    })
      .populate('student', 'name email')
      .populate('internship', 'title')
      .sort({ 'submission.submittedAt': -1 })
      .limit(10);

    // Get internships pending approval
    const pendingInternships = await Internship.find({
      'approval.status': 'pending'
    })
      .populate('company', 'name company.name')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get student progress data
    const studentProgress = await Promise.all(
      faculty.currentMentees.slice(0, 10).map(async (student) => {
        const applications = await Application.find({ student: student._id });
        const reports = await Report.find({ student: student._id });
        
        const ongoingInternships = applications.filter(app => 
          app.status === 'selected' && 
          app.selection?.startDate <= new Date() && 
          app.selection?.endDate >= new Date()
        );

        let progress = 0;
        if (ongoingInternships.length > 0) {
          const internship = ongoingInternships[0];
          const totalDuration = internship.selection.endDate - internship.selection.startDate;
          const elapsed = new Date() - internship.selection.startDate;
          progress = Math.min(Math.round((elapsed / totalDuration) * 100), 100);
        }

        return {
          student,
          progress,
          status: ongoingInternships.length > 0 ? 'Active' : 'Inactive',
          reportsSubmitted: reports.length,
          currentInternship: ongoingInternships[0]?.internship || null
        };
      })
    );

    // Calculate statistics
    const stats = {
      totalStudents: faculty.currentMentees.length,
      activeInternships: await Application.countDocuments({
        student: { $in: faculty.currentMentees.map(m => m._id) },
        status: 'selected',
        'selection.startDate': { $lte: new Date() },
        'selection.endDate': { $gte: new Date() }
      }),
      pendingApprovals: pendingApprovals.length,
      completedInternships: await Application.countDocuments({
        student: { $in: faculty.currentMentees.map(m => m._id) },
        status: 'selected',
        'selection.endDate': { $lt: new Date() }
      })
    };

    return {
      faculty,
      stats,
      pendingApprovals,
      pendingReports,
      pendingInternships,
      studentProgress,
      availableMentorshipSlots: faculty.availableMentorshipSlots
    };
  }

  // Get industry dashboard data
  async getIndustryDashboard(industryId) {
    const industry = await Industry.findById(industryId);

    if (!industry) {
      throw new AppError('Industry user not found', 404);
    }

    // Get company's internships
    const internships = await Internship.find({ company: industryId })
      .sort({ createdAt: -1 })
      .limit(10);

    // Get recent applications
    const recentApplications = await Application.find({
      internship: { $in: internships.map(i => i._id) }
    })
      .populate('student', 'name email studentId college department skills cgpa')
      .populate('internship', 'title')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get application statistics
    const applicationStats = await Application.aggregate([
      {
        $match: {
          internship: { $in: internships.map(i => i._id) }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get internship statistics
    const internshipStats = await Internship.aggregate([
      { $match: { company: industryId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalApplications: { $sum: '$stats.applications' },
          totalViews: { $sum: '$stats.views' }
        }
      }
    ]);

    // Get top skills from applicants
    const topSkills = await Application.aggregate([
      {
        $match: {
          internship: { $in: internships.map(i => i._id) }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'student',
          foreignField: '_id',
          as: 'studentData'
        }
      },
      { $unwind: '$studentData' },
      { $unwind: '$studentData.skills' },
      {
        $group: {
          _id: '$studentData.skills.name',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Calculate statistics
    const stats = {
      activeListings: internships.filter(i => i.status === 'active').length,
      totalApplications: recentApplications.length,
      shortlisted: recentApplications.filter(app => app.status === 'shortlisted').length,
      totalViews: internships.reduce((sum, i) => sum + i.stats.views, 0)
    };

    const applicationsByStatus = applicationStats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    const internshipsByStatus = internshipStats.reduce((acc, stat) => {
      acc[stat._id] = {
        count: stat.count,
        totalApplications: stat.totalApplications,
        totalViews: stat.totalViews
      };
      return acc;
    }, {});

    return {
      industry,
      stats,
      applicationsByStatus,
      internshipsByStatus,
      recentInternships: internships,
      recentApplications,
      topSkills,
      analytics: {
        averageApplicationsPerPost: stats.activeListings > 0 ? 
          Math.round(stats.totalApplications / stats.activeListings) : 0,
        conversionRate: stats.totalApplications > 0 ? 
          Math.round((stats.shortlisted / stats.totalApplications) * 100) : 0
      }
    };
  }

  // Get general platform statistics (admin view)
  async getPlatformStatistics() {
    const userStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          total: { $sum: 1 },
          active: { $sum: { $cond: ['$isActive', 1, 0] } },
          verified: { $sum: { $cond: ['$isEmailVerified', 1, 0] } }
        }
      }
    ]);

    const internshipStats = await Internship.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalApplications: { $sum: '$stats.applications' }
        }
      }
    ]);

    const applicationStats = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const monthlyGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    return {
      users: {
        total: await User.countDocuments(),
        byRole: userStats.reduce((acc, stat) => {
          acc[stat._id] = stat;
          return acc;
        }, {}),
        monthlyGrowth
      },
      internships: {
        total: await Internship.countDocuments(),
        byStatus: internshipStats.reduce((acc, stat) => {
          acc[stat._id] = stat;
          return acc;
        }, {})
      },
      applications: {
        total: await Application.countDocuments(),
        byStatus: applicationStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {})
      }
    };
  }

  // Get user activity feed
  async getActivityFeed(userId, userRole, limit = 20) {
    const activities = [];

    if (userRole === 'student') {
      // Get student's recent activities
      const applications = await Application.find({ student: userId })
        .populate('internship', 'title company')
        .sort({ updatedAt: -1 })
        .limit(limit);

      applications.forEach(app => {
        activities.push({
          type: 'application',
          action: app.status,
          data: app,
          timestamp: app.updatedAt
        });
      });
    } else if (userRole === 'faculty') {
      // Get faculty's recent activities
      const approvals = await Application.find({
        'facultyApproval.approvedBy': userId
      })
        .populate('student', 'name')
        .populate('internship', 'title')
        .sort({ 'facultyApproval.approvedAt': -1 })
        .limit(limit);

      approvals.forEach(approval => {
        activities.push({
          type: 'approval',
          action: approval.facultyApproval.status,
          data: approval,
          timestamp: approval.facultyApproval.approvedAt
        });
      });
    } else if (userRole === 'industry') {
      // Get industry's recent activities
      const internships = await Internship.find({ createdBy: userId })
        .sort({ updatedAt: -1 })
        .limit(limit);

      internships.forEach(internship => {
        activities.push({
          type: 'internship',
          action: internship.status,
          data: internship,
          timestamp: internship.updatedAt
        });
      });
    }

    // Sort activities by timestamp
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return activities.slice(0, limit);
  }
}

export default new DashboardService();

