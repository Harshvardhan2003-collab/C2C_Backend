import { body } from 'express-validator';
import { authService } from '../services/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, sendError, sendCreated } from '../utils/apiResponse.js';
import { handleValidationErrors } from '../middlewares/validation.js';

// Register validation rules
export const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('role')
    .isIn(['student', 'faculty', 'industry'])
    .withMessage('Role must be student, faculty, or industry'),
  handleValidationErrors
];

// Login validation rules
export const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Register new user
export const register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    
    // Set HTTP-only cookie for refresh token
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    sendCreated(res, {
      user: result.user,
      accessToken: result.accessToken
    }, 'User registered successfully');
});

// Login user
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    
    // Set HTTP-only cookie for refresh token
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    sendSuccess(res, {
      user: result.user,
      accessToken: result.accessToken
    }, 'Login successful');
});

// Google OAuth login
export const googleLogin = asyncHandler(async (req, res) => {
    const { googleToken } = req.body;
    
    if (!googleToken) {
      return sendError(res, 'Google token is required', 400);
    }

    const result = await authService.googleLogin(googleToken);
    
    // Set HTTP-only cookie for refresh token
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    sendSuccess(res, {
      user: result.user,
      accessToken: result.accessToken
    }, 'Google login successful');
});

// Verify email
export const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const result = await authService.verifyEmail(token);
    
    sendSuccess(res, null, result.message);
});

// Forgot password
export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
      return sendError(res, 'Email is required', 400);
    }

    const result = await authService.forgotPassword(email);
    sendSuccess(res, null, result.message);
});

// Reset password
export const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    
    if (!password) {
      return sendError(res, 'New password is required', 400);
    }

    if (password.length < 6) {
      return sendError(res, 'Password must be at least 6 characters long', 400);
    }

    const result = await authService.resetPassword(token, password);
    sendSuccess(res, null, result.message);
});

// Change password
export const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return sendError(res, 'Current password and new password are required', 400);
    }

    if (newPassword.length < 6) {
      return sendError(res, 'New password must be at least 6 characters long', 400);
    }

    const result = await authService.changePassword(
      req.user._id, 
      currentPassword, 
      newPassword
    );
    
    sendSuccess(res, null, result.message);
});

// Refresh access token
export const refreshToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    
    if (!refreshToken) {
      return sendError(res, 'Refresh token is required', 401);
    }

    const result = await authService.refreshToken(refreshToken);
    
    // Set new refresh token cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    sendSuccess(res, {
      accessToken: result.accessToken
    }, 'Token refreshed successfully');
});

// Logout user
export const logout = asyncHandler(async (req, res) => {
    // Clear refresh token cookie
    res.clearCookie('refreshToken');
    
    const result = await authService.logout(req.user._id);
    sendSuccess(res, null, result.message);
});

// Get current user
export const getCurrentUser = asyncHandler(async (req, res) => {
    sendSuccess(res, req.user, 'Current user retrieved successfully');
});

// Check authentication status
export const checkAuth = asyncHandler(async (req, res) => {
    sendSuccess(res, {
      isAuthenticated: !!req.user,
      user: req.user || null
    }, 'Authentication status checked');
});

// Default export for backward compatibility
export default {
  registerValidation,
  loginValidation,
  register,
  login,
  googleLogin,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  refreshToken,
  logout,
  getCurrentUser,
  checkAuth
};
