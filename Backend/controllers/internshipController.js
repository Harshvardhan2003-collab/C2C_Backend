import { body } from 'express-validator';
import { internshipService } from '../services/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, sendError, sendCreated, sendNotFound } from '../utils/apiResponse.js';
import { handleValidationErrors, validatePagination, validateSort } from '../middlewares/validation.js';

// Internship creation validation rules
export const createInternshipValidation = [
    body('title')
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage('Title must be between 5 and 200 characters'),
    body('description')
      .trim()
      .isLength({ min: 50, max: 2000 })
      .withMessage('Description must be between 50 and 2000 characters'),
    body('department')
      .trim()
      .notEmpty()
      .withMessage('Department is required'),
    body('domain')
      .trim()
      .notEmpty()
      .withMessage('Domain is required'),
    body('type')
      .isIn(['remote', 'onsite', 'hybrid'])
      .withMessage('Type must be remote, onsite, or hybrid'),
    body('duration.months')
      .isInt({ min: 1, max: 12 })
      .withMessage('Duration must be between 1 and 12 months'),
    body('startDate')
      .isISO8601()
      .toDate()
      .withMessage('Valid start date is required'),
    body('endDate')
      .isISO8601()
      .toDate()
      .withMessage('Valid end date is required'),
    body('applicationDeadline')
      .isISO8601()
      .toDate()
      .withMessage('Valid application deadline is required'),
    handleValidationErrors
];

// Application submission validation rules
export const applicationValidation = [
    body('responses.whyInterested')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Why interested response cannot exceed 500 characters'),
    body('responses.relevantExperience')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Relevant experience response cannot exceed 500 characters'),
    handleValidationErrors
];

// Create new internship
export const createInternship = asyncHandler(async (req, res) => {
    const internship = await internshipService.createInternship(req.body, req.user._id);
    
    sendCreated(res, internship, 'Internship created successfully');
});

// Convert all remaining methods to named exports
export const getAllInternships = asyncHandler(async (req, res) => {
  const filters = {
    domain: req.query.domain,
    type: req.query.type,
    location: req.query.location,
    isPaid: req.query.isPaid === 'true',
    company: req.query.company,
    tags: req.query.tags ? req.query.tags.split(',') : undefined,
    search: req.query.search,
    applicationDeadlineAfter: req.query.applicationDeadlineAfter,
    startDateAfter: req.query.startDateAfter,
    includeUnapproved: req.user?.role === 'faculty'
  };

  const result = await internshipService.getAllInternships(
    filters,
    req.pagination,
    req.sort
  );
  
  sendSuccess(res, result.internships, 'Internships retrieved successfully', 200, result.pagination);
});

export const getInternshipById = asyncHandler(async (req, res) => {
  const { internshipId } = req.params;
  const internship = await internshipService.getInternshipById(internshipId);
  
  if (internship.createdBy.toString() !== req.user._id.toString()) {
    await internshipService.incrementViews(internshipId);
  }
  
  sendSuccess(res, internship, 'Internship retrieved successfully');
});

export const updateInternship = asyncHandler(async (req, res) => {
  const { internshipId } = req.params;
  const updatedInternship = await internshipService.updateInternship(
    internshipId, 
    req.body, 
    req.user._id
  );
  
  sendSuccess(res, updatedInternship, 'Internship updated successfully');
});

export const deleteInternship = asyncHandler(async (req, res) => {
  const { internshipId } = req.params;
  const result = await internshipService.deleteInternship(internshipId, req.user._id);
  
  sendSuccess(res, null, result.message);
});

export const applyForInternship = asyncHandler(async (req, res) => {
  const { internshipId } = req.params;
  
  if (req.user.role !== 'student') {
    return sendError(res, 'Only students can apply for internships', 403);
  }

  const application = await internshipService.applyForInternship(
    internshipId, 
    req.user._id, 
    req.body
  );
  
  sendCreated(res, application, 'Application submitted successfully');
});

export const getInternshipApplications = asyncHandler(async (req, res) => {
  const { internshipId } = req.params;
  
  const filters = {
    status: req.query.status,
    facultyApprovalStatus: req.query.facultyApprovalStatus
  };

  const result = await internshipService.getInternshipApplications(
    internshipId,
    req.user._id,
    filters,
    req.pagination
  );
  
  sendSuccess(res, result.applications, 'Applications retrieved successfully', 200, result.pagination);
});

export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const { status, notes } = req.body;
  
  if (!status) {
    return sendError(res, 'Status is required', 400);
  }

  const validStatuses = ['submitted', 'under_review', 'shortlisted', 'interview_scheduled', 'interviewed', 'selected', 'rejected'];
  if (!validStatuses.includes(status)) {
    return sendError(res, 'Invalid status', 400);
  }

  const application = await internshipService.updateApplicationStatus(
    applicationId,
    status,
    req.user._id,
    notes
  );
  
  sendSuccess(res, application, 'Application status updated successfully');
});

export const getMyInternships = asyncHandler(async (req, res) => {
  if (req.user.role !== 'industry') {
    return sendError(res, 'Only industry users can access this endpoint', 403);
  }

  const filters = {
    status: req.query.status
  };

  const result = await internshipService.getInternshipsByCompany(
    req.user._id,
    filters,
    req.pagination
  );
  
  sendSuccess(res, result.internships, 'Your internships retrieved successfully', 200, result.pagination);
});

export const searchInternships = asyncHandler(async (req, res) => {
  const { q: searchQuery } = req.query;
  
  if (!searchQuery) {
    return sendError(res, 'Search query is required', 400);
  }

  const filters = {
    domain: req.query.domain,
    type: req.query.type,
    location: req.query.location,
    isPaid: req.query.isPaid === 'true'
  };

  const result = await internshipService.searchInternships(
    searchQuery,
    filters,
    req.pagination
  );
  
  sendSuccess(res, result.internships, 'Search completed successfully', 200, result.pagination);
});

export const getFeaturedInternships = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 6;
  const internships = await internshipService.getFeaturedInternships(limit);
  
  sendSuccess(res, internships, 'Featured internships retrieved successfully');
});

export const getRecentInternships = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const internships = await internshipService.getRecentInternships(limit);
  
  sendSuccess(res, internships, 'Recent internships retrieved successfully');
});

export const getInternshipStatistics = asyncHandler(async (req, res) => {
  const companyId = req.user.role === 'industry' ? req.user._id : req.query.companyId;
  const stats = await internshipService.getInternshipStatistics(companyId);
  
  sendSuccess(res, stats, 'Internship statistics retrieved successfully');
});

export const reviewInternship = asyncHandler(async (req, res) => {
  const { internshipId } = req.params;
  const { action, reason } = req.body;
  
  if (!action || !['approved', 'rejected'].includes(action)) {
    return sendError(res, 'Valid action (approved/rejected) is required', 400);
  }

  if (action === 'rejected' && !reason) {
    return sendError(res, 'Rejection reason is required', 400);
  }

  const internship = await internshipService.reviewInternship(
    internshipId,
    action,
    req.user._id,
    reason
  );
  
  sendSuccess(res, internship, `Internship ${action} successfully`);
});

export const getPendingInternships = asyncHandler(async (req, res) => {
  const filters = {
    'approval.status': 'pending',
    includeUnapproved: true
  };

  const result = await internshipService.getAllInternships(
    filters,
    req.pagination,
    req.sort
  );
  
  sendSuccess(res, result.internships, 'Pending internships retrieved successfully', 200, result.pagination);
});

// Default export for backward compatibility
export default {
  createInternshipValidation,
  applicationValidation,
  createInternship,
  getAllInternships,
  getInternshipById,
  updateInternship,
  deleteInternship,
  applyForInternship,
  getInternshipApplications,
  updateApplicationStatus,
  getMyInternships,
  searchInternships,
  getFeaturedInternships,
  getRecentInternships,
  getInternshipStatistics,
  reviewInternship,
  getPendingInternships
};
