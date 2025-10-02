// Export all middleware from a single file for easy importing
import auth from './auth.js';
import validation from './validation.js';
import upload from './upload.js';
import rateLimiter from './rateLimiter.js';
import errorHandler from './errorHandler.js';

export {
  auth,
  validation,
  upload,
  rateLimiter,
  errorHandler
};

export default {
  auth,
  validation,
  upload,
  rateLimiter,
  errorHandler
};

