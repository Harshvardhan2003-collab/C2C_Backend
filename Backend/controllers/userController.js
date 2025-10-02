import { body } from 'express-validator';
import { userService } from '../services/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, sendError, sendNotFound } from '../utils/apiResponse.js';
import { handleValidationErrors, validatePagination, validateSort } from '../middlewares/validation.js';

// Profile update validation rules
export const profileUpdateValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  handleValidationErrors
];

// Get user profile
export const getProfile = asyncHandler(async (req, res) => {
    const userId = req.params.userId || req.user._id;
    const user = await userService.getUserProfile(userId);
    
    sendSuccess(res, user, 'Profile retrieved successfully');
});

// Update user profile
export const updateProfile = asyncHandler(async (req, res) => {
    const userId = req.params.userId || req.user._id;
    
    // Check if user can update this profile
    if (userId !== req.user._id.toString() && req.user.role !== 'faculty') {
      return sendError(res, 'You can only update your own profile', 403);
    }

    const updatedUser = await userService.updateUserProfile(
      userId, 
      req.body, 
      req.files
    );
    
    sendSuccess(res, updatedUser, 'Profile updated successfully');
});

// Get all users (admin/faculty only)
export const getAllUsers = asyncHandler(async (req, res) => {
    const filters = {
      role: req.query.role,
      isActive: req.query.isActive,
      isEmailVerified: req.query.isEmailVerified,
      search: req.query.search
    };

    const result = await userService.getAllUsers(
      filters,
      req.pagination,
      req.sort
    );
    
    sendSuccess(res, result.users, 'Users retrieved successfully', 200, result.pagination);
});

// Get users by role
export const getUsersByRole = asyncHandler(async (req, res) => {
    const { role } = req.params;
    
    if (!['student', 'faculty', 'industry'].includes(role)) {
      return sendError(res, 'Invalid role specified', 400);
    }

    const filters = {
      isActive: req.query.isActive,
      search: req.query.search
    };

    // Add role-specific filters
    if (role === 'student') {
      if (req.query.department) filters.department = req.query.department;
      if (req.query.semester) filters.semester = parseInt(req.query.semester);
      if (req.query.college) filters['college.name'] = new RegExp(req.query.college, 'i');
    } else if (role === 'faculty') {
      if (req.query.department) filters.department = req.query.department;
      if (req.query.designation) filters.designation = req.query.designation;
    } else if (role === 'industry') {
      if (req.query.industry) filters['company.industry'] = req.query.industry;
      if (req.query.verified) filters['verification.isVerified'] = req.query.verified === 'true';
    }

    const result = await userService.getUsersByRole(
      role,
      filters,
      req.pagination,
      req.sort
    );
    
    sendSuccess(res, result.users, `${role} users retrieved successfully`, 200, result.pagination);
});

// Search users
export const searchUsers = asyncHandler(async (req, res) => {
    const { q: searchQuery } = req.query;
    
    if (!searchQuery) {
      return sendError(res, 'Search query is required', 400);
    }

    const filters = {
      role: req.query.role,
      isActive: req.query.isActive
    };

    const result = await userService.searchUsers(
      searchQuery,
      filters,
      req.pagination
    );
    
    sendSuccess(res, result.users, 'Search completed successfully', 200, result.pagination);
});

// Deactivate user account
export const deactivateUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const result = await userService.deactivateUser(userId);
    
    sendSuccess(res, null, result.message);
});

// Activate user account
export const activateUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const result = await userService.activateUser(userId);
    
    sendSuccess(res, null, result.message);
});

// Delete user account
export const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const result = await userService.deleteUser(userId);
    
    sendSuccess(res, null, result.message);
});

// Get user statistics
export const getUserStatistics = asyncHandler(async (req, res) => {
    const stats = await userService.getUserStatistics();
    
    sendSuccess(res, stats, 'User statistics retrieved successfully');
});

// Update user role (admin only)
export const updateUserRole = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;
    
    if (!role || !['student', 'faculty', 'industry'].includes(role)) {
      return sendError(res, 'Valid role is required', 400);
    }

    const result = await userService.updateUserRole(userId, role);
    
    sendSuccess(res, null, result.message);
});

// Bulk operations
export const bulkUpdateUsers = asyncHandler(async (req, res) => {
    const { userIds, updateData } = req.body;
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return sendError(res, 'User IDs array is required', 400);
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      return sendError(res, 'Update data is required', 400);
    }

    const result = await userService.bulkUpdateUsers(userIds, updateData);
    
    sendSuccess(res, null, result.message);
});

export const bulkDeleteUsers = asyncHandler(async (req, res) => {
    const { userIds } = req.body;
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return sendError(res, 'User IDs array is required', 400);
    }

    const result = await userService.bulkDeleteUsers(userIds);
    
    sendSuccess(res, null, result.message);
});

// Get current user's profile (shortcut)
export const getMyProfile = asyncHandler(async (req, res) => {
    const user = await userService.getUserProfile(req.user._id);
    
    sendSuccess(res, user, 'Your profile retrieved successfully');
});

// Update current user's profile (shortcut)
export const updateMyProfile = asyncHandler(async (req, res) => {
    const updatedUser = await userService.updateUserProfile(
      req.user._id, 
      req.body, 
      req.files
    );
    
    sendSuccess(res, updatedUser, 'Your profile updated successfully');
});

// Default export for backward compatibility
export default {
  profileUpdateValidation,
  getProfile,
  updateProfile,
  getAllUsers,
  getUsersByRole,
  searchUsers,
  deactivateUser,
  activateUser,
  deleteUser,
  getUserStatistics,
  updateUserRole,
  bulkUpdateUsers,
  bulkDeleteUsers,
  getMyProfile,
  updateMyProfile
};
