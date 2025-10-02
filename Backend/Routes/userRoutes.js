import express from 'express';
import userController from '../controllers/userController.js';
import { protect, authorize, authorizeOwnerOrAdmin } from '../middlewares/auth.js';
import { validatePagination, validateSort, validateObjectId } from '../middlewares/validation.js';
import { uploadConfigs } from '../middlewares/upload.js';
import { generalLimiter, uploadLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Current user routes (shortcuts)
router.get('/me', 
  userController.getMyProfile
);

router.put('/me', 
  uploadLimiter,
  uploadConfigs.profilePicture,
  userController.profileUpdateValidation,
  userController.updateMyProfile
);

// Search users
router.get('/search', 
  validatePagination,
  userController.searchUsers
);

// Get user statistics (faculty only)
router.get('/statistics', 
  authorize('faculty'),
  userController.getUserStatistics
);

// Get users by role
router.get('/role/:role', 
  authorize('faculty'),
  validatePagination,
  validateSort(['name', 'email', 'createdAt', 'lastLogin']),
  userController.getUsersByRole
);

// Get all users (faculty only)
router.get('/', 
  authorize('faculty'),
  validatePagination,
  validateSort(['name', 'email', 'role', 'createdAt', 'lastLogin']),
  userController.getAllUsers
);

// Bulk operations (faculty only)
router.put('/bulk-update', 
  authorize('faculty'),
  userController.bulkUpdateUsers
);

router.delete('/bulk-delete', 
  authorize('faculty'),
  userController.bulkDeleteUsers
);

// Individual user routes
router.get('/:userId', 
  validateObjectId('userId'),
  authorizeOwnerOrAdmin(),
  userController.getProfile
);

router.put('/:userId', 
  validateObjectId('userId'),
  uploadLimiter,
  uploadConfigs.profilePicture,
  userController.profileUpdateValidation,
  authorizeOwnerOrAdmin(),
  userController.updateProfile
);

// Admin/Faculty only operations
router.put('/:userId/role', 
  validateObjectId('userId'),
  authorize('faculty'),
  userController.updateUserRole
);

router.put('/:userId/deactivate', 
  validateObjectId('userId'),
  authorize('faculty'),
  userController.deactivateUser
);

router.put('/:userId/activate', 
  validateObjectId('userId'),
  authorize('faculty'),
  userController.activateUser
);

router.delete('/:userId', 
  validateObjectId('userId'),
  authorize('faculty'),
  userController.deleteUser
);

export default router;

