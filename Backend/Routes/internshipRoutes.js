import express from 'express';
import internshipController from '../controllers/internshipController.js';
import { protect, authorize, requireIndustryVerification, checkFacultyPermission } from '../middlewares/auth.js';
import { validatePagination, validateSort, validateObjectId } from '../middlewares/validation.js';
import { generalLimiter, applicationLimiter, searchLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// Public routes (with optional auth for personalization)
router.get('/featured', 
  generalLimiter,
  internshipController.getFeaturedInternships
);

router.get('/recent', 
  generalLimiter,
  internshipController.getRecentInternships
);

// Protected routes
router.use(protect);

// Search internships
router.get('/search', 
  searchLimiter,
  validatePagination,
  internshipController.searchInternships
);

// Get all internships
router.get('/', 
  generalLimiter,
  validatePagination,
  validateSort(['createdAt', 'applicationDeadline', 'startDate', 'title']),
  internshipController.getAllInternships
);

// Get internship statistics
router.get('/statistics', 
  internshipController.getInternshipStatistics
);

// Industry-specific routes
router.get('/my-internships', 
  authorize('industry'),
  validatePagination,
  internshipController.getMyInternships
);

// Faculty-specific routes
router.get('/pending-approval', 
  authorize('faculty'),
  checkFacultyPermission('canApproveInternships'),
  validatePagination,
  validateSort(['createdAt', 'title']),
  internshipController.getPendingInternships
);

// Create new internship (industry only)
router.post('/', 
  authorize('industry'),
  requireIndustryVerification,
  internshipController.createInternshipValidation,
  internshipController.createInternship
);

// Individual internship routes
router.get('/:internshipId', 
  validateObjectId('internshipId'),
  internshipController.getInternshipById
);

router.put('/:internshipId', 
  validateObjectId('internshipId'),
  authorize('industry'),
  internshipController.updateInternship
);

router.delete('/:internshipId', 
  validateObjectId('internshipId'),
  authorize('industry'),
  internshipController.deleteInternship
);

// Application routes
router.post('/:internshipId/apply', 
  validateObjectId('internshipId'),
  authorize('student'),
  applicationLimiter,
  internshipController.applicationValidation,
  internshipController.applyForInternship
);

router.get('/:internshipId/applications', 
  validateObjectId('internshipId'),
  authorize('industry'),
  validatePagination,
  internshipController.getInternshipApplications
);

// Faculty approval routes
router.put('/:internshipId/review', 
  validateObjectId('internshipId'),
  authorize('faculty'),
  checkFacultyPermission('canApproveInternships'),
  internshipController.reviewInternship
);

// Application management routes
router.put('/applications/:applicationId/status', 
  validateObjectId('applicationId'),
  authorize('industry'),
  internshipController.updateApplicationStatus
);

export default router;

