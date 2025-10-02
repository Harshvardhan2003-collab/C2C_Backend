import express from 'express';
import dashboardController from '../controllers/dashboardController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { generalLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Universal dashboard endpoint (role-based)
router.get('/', 
  generalLimiter,
  dashboardController.getDashboard
);

// Role-specific dashboard endpoints
router.get('/student', 
  authorize('student'),
  generalLimiter,
  dashboardController.getStudentDashboard
);

router.get('/faculty', 
  authorize('faculty'),
  generalLimiter,
  dashboardController.getFacultyDashboard
);

router.get('/industry', 
  authorize('industry'),
  generalLimiter,
  dashboardController.getIndustryDashboard
);

// Platform statistics (faculty only)
router.get('/statistics', 
  authorize('faculty'),
  dashboardController.getPlatformStatistics
);

// Activity feed
router.get('/activity', 
  generalLimiter,
  dashboardController.getActivityFeed
);

export default router;

