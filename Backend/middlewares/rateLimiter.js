import rateLimit from 'express-rate-limit';
import { AppError } from '../utils/appError.js';

// General rate limiter
export const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 'Please try again in 15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, next) => {
    next(new AppError('Too many requests from this IP, please try again later.', 429));
  }
});

// Strict limiter for authentication routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: 'Please try again in 15 minutes'
  },
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req, res, next) => {
    next(new AppError('Too many authentication attempts, please try again later.', 429));
  }
});

// Limiter for password reset requests
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 password reset requests per hour
  message: {
    error: 'Too many password reset attempts, please try again later.',
    retryAfter: 'Please try again in 1 hour'
  },
  handler: (req, res, next) => {
    next(new AppError('Too many password reset attempts, please try again later.', 429));
  }
});

// Limiter for file uploads
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 upload requests per windowMs
  message: {
    error: 'Too many file upload requests, please try again later.',
    retryAfter: 'Please try again in 15 minutes'
  },
  handler: (req, res, next) => {
    next(new AppError('Too many file upload requests, please try again later.', 429));
  }
});

// Limiter for application submissions
export const applicationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 application submissions per hour
  message: {
    error: 'Too many application submissions, please try again later.',
    retryAfter: 'Please try again in 1 hour'
  },
  handler: (req, res, next) => {
    next(new AppError('Too many application submissions, please try again later.', 429));
  }
});

// Limiter for search requests
export const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 search requests per minute
  message: {
    error: 'Too many search requests, please try again later.',
    retryAfter: 'Please try again in 1 minute'
  },
  handler: (req, res, next) => {
    next(new AppError('Too many search requests, please try again later.', 429));
  }
});

// Limiter for email sending
export const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 email requests per hour
  message: {
    error: 'Too many email requests, please try again later.',
    retryAfter: 'Please try again in 1 hour'
  },
  handler: (req, res, next) => {
    next(new AppError('Too many email requests, please try again later.', 429));
  }
});

// Limiter for report submissions
export const reportLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 50, // limit each IP to 50 report submissions per day
  message: {
    error: 'Too many report submissions, please try again later.',
    retryAfter: 'Please try again tomorrow'
  },
  handler: (req, res, next) => {
    next(new AppError('Too many report submissions, please try again later.', 429));
  }
});

// Create custom rate limiter
export const createRateLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000,
    max = 100,
    message = 'Too many requests, please try again later.',
    skipSuccessfulRequests = false
  } = options;

  return rateLimit({
    windowMs,
    max,
    message: {
      error: message,
      retryAfter: `Please try again in ${Math.ceil(windowMs / 60000)} minutes`
    },
    skipSuccessfulRequests,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
      next(new AppError(message, 429));
    }
  });
};

export default {
  generalLimiter,
  authLimiter,
  passwordResetLimiter,
  uploadLimiter,
  applicationLimiter,
  searchLimiter,
  emailLimiter,
  reportLimiter,
  createRateLimiter
};

