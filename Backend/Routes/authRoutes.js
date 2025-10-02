import express from 'express';
import authController from '../controllers/authController.js';
import { protect, optionalAuth } from '../middlewares/auth.js';
import { authLimiter, passwordResetLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// Public routes
router.post('/register', 
  authLimiter,
  authController.registerValidation,
  authController.register
);

router.post('/login', 
  authLimiter,
  authController.loginValidation,
  authController.login
);

router.post('/google-login', 
  authLimiter,
  authController.googleLogin
);

router.get('/verify-email/:token', 
  authController.verifyEmail
);

router.post('/forgot-password', 
  passwordResetLimiter,
  authController.forgotPassword
);

router.post('/reset-password/:token', 
  passwordResetLimiter,
  authController.resetPassword
);

router.post('/refresh-token', 
  authController.refreshToken
);

router.get('/check-auth', 
  optionalAuth,
  authController.checkAuth
);

// Protected routes
router.use(protect); // All routes below require authentication

router.post('/change-password', 
  authController.changePassword
);

router.post('/logout', 
  authController.logout
);

router.get('/me', 
  authController.getCurrentUser
);

export default router;
