import { dashboardService } from '../services/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

// Get student dashboard data
export const getStudentDashboard = asyncHandler(async (req, res) => {
    if (req.user.role !== 'student') {
      return sendError(res, 'Access denied. Student role required.', 403);
    }

    const dashboardData = await dashboardService.getStudentDashboard(req.user._id);
    
    sendSuccess(res, dashboardData, 'Student dashboard data retrieved successfully');
});

// Get faculty dashboard data
export const getFacultyDashboard = asyncHandler(async (req, res) => {
    if (req.user.role !== 'faculty') {
      return sendError(res, 'Access denied. Faculty role required.', 403);
    }

    const dashboardData = await dashboardService.getFacultyDashboard(req.user._id);
    
    sendSuccess(res, dashboardData, 'Faculty dashboard data retrieved successfully');
});

// Get industry dashboard data
export const getIndustryDashboard = asyncHandler(async (req, res) => {
    if (req.user.role !== 'industry') {
      return sendError(res, 'Access denied. Industry role required.', 403);
    }

    const dashboardData = await dashboardService.getIndustryDashboard(req.user._id);
    
    sendSuccess(res, dashboardData, 'Industry dashboard data retrieved successfully');
});

// Get platform statistics (admin/faculty only)
export const getPlatformStatistics = asyncHandler(async (req, res) => {
    const stats = await dashboardService.getPlatformStatistics();
    
    sendSuccess(res, stats, 'Platform statistics retrieved successfully');
});

// Get user activity feed
export const getActivityFeed = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 20;
    
    const activities = await dashboardService.getActivityFeed(
      req.user._id, 
      req.user.role, 
      limit
    );
    
    sendSuccess(res, activities, 'Activity feed retrieved successfully');
});

// Get role-specific dashboard (universal endpoint)
export const getDashboard = asyncHandler(async (req, res) => {
    let dashboardData;

    switch (req.user.role) {
      case 'student':
        dashboardData = await dashboardService.getStudentDashboard(req.user._id);
        break;
      case 'faculty':
        dashboardData = await dashboardService.getFacultyDashboard(req.user._id);
        break;
      case 'industry':
        dashboardData = await dashboardService.getIndustryDashboard(req.user._id);
        break;
      default:
        return sendError(res, 'Invalid user role', 400);
    }
    
    sendSuccess(res, dashboardData, `${req.user.role} dashboard data retrieved successfully`);
});

// Default export for backward compatibility
export default {
  getStudentDashboard,
  getFacultyDashboard,
  getIndustryDashboard,
  getPlatformStatistics,
  getActivityFeed,
  getDashboard
};
