import { AppError } from '../utils/appError.js';

// Handle CastError (Invalid ObjectId)
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// Handle Duplicate Field Error
const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `${field} '${value}' already exists. Please use another value.`;
  return new AppError(message, 400);
};

// Handle Validation Error
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Handle JWT Error
const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again!', 401);
};

// Handle JWT Expired Error
const handleJWTExpiredError = () => {
  return new AppError('Your token has expired! Please log in again.', 401);
};

// Send error response in development
const sendErrorDev = (err, req, res) => {
  // API Error
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
      ...(err.validationErrors && { validationErrors: err.validationErrors })
    });
  }

  // Rendered website error
  console.error('ERROR 💥', err);
  return res.status(err.statusCode).json({
    title: 'Something went wrong!',
    message: err.message
  });
};

// Send error response in production
const sendErrorProd = (err, req, res) => {
  // API Error
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        ...(err.validationErrors && { validationErrors: err.validationErrors })
      });
    }

    // Programming or other unknown error: don't leak error details
    console.error('ERROR 💥', err);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }

  // Rendered website error
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      title: 'Something went wrong!',
      message: err.message
    });
  }

  // Programming or other unknown error: don't leak error details
  console.error('ERROR 💥', err);
  return res.status(err.statusCode).json({
    title: 'Something went wrong!',
    message: 'Please try again later.'
  });
};

// Global error handling middleware
export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Handle specific MongoDB errors
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};

// Handle unhandled routes
export const handleUnhandledRoutes = (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
  next(err);
};

// Async error handler wrapper
export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Handle uncaught exceptions
export const handleUncaughtException = () => {
  process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
  });
};

// Handle unhandled promise rejections
export const handleUnhandledRejection = (server) => {
  process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
};

// Handle SIGTERM
export const handleSIGTERM = (server) => {
  process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
      console.log('💥 Process terminated!');
    });
  });
};

export default {
  globalErrorHandler,
  handleUnhandledRoutes,
  catchAsync,
  handleUncaughtException,
  handleUnhandledRejection,
  handleSIGTERM
};

