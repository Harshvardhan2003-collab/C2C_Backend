import { validationResult } from 'express-validator';
import { AppError } from '../utils/appError.js';

// Middleware to handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value
    }));
    
    return next(new AppError('Validation failed', 400, errorMessages));
  }
  
  next();
};

// Custom validation middleware for file uploads
export const validateFileUpload = (options = {}) => {
  const {
    required = false,
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    fieldName = 'file'
  } = options;

  return (req, res, next) => {
    const file = req.file || req.files?.[fieldName];

    // Check if file is required
    if (required && !file) {
      return next(new AppError(`${fieldName} is required`, 400));
    }

    // If no file and not required, continue
    if (!file) {
      return next();
    }

    // Check file size
    if (file.size > maxSize) {
      return next(new AppError(`File size too large. Maximum size is ${maxSize / (1024 * 1024)}MB`, 400));
    }

    // Check file type
    if (!allowedTypes.includes(file.mimetype)) {
      return next(new AppError(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`, 400));
    }

    next();
  };
};

// Middleware to validate pagination parameters
export const validatePagination = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Validate page and limit
  if (page < 1) {
    return next(new AppError('Page must be greater than 0', 400));
  }

  if (limit < 1 || limit > 100) {
    return next(new AppError('Limit must be between 1 and 100', 400));
  }

  // Add pagination to request
  req.pagination = {
    page,
    limit,
    skip
  };

  next();
};

// Middleware to validate sort parameters
export const validateSort = (allowedFields = []) => {
  return (req, res, next) => {
    const sortBy = req.query.sortBy;
    const sortOrder = req.query.sortOrder || 'desc';

    if (sortBy && !allowedFields.includes(sortBy)) {
      return next(new AppError(`Invalid sort field. Allowed fields: ${allowedFields.join(', ')}`, 400));
    }

    if (!['asc', 'desc'].includes(sortOrder)) {
      return next(new AppError('Sort order must be either "asc" or "desc"', 400));
    }

    req.sort = {};
    if (sortBy) {
      req.sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      req.sort.createdAt = -1; // Default sort by creation date
    }

    next();
  };
};

// Middleware to validate search parameters
export const validateSearch = (searchableFields = []) => {
  return (req, res, next) => {
    const searchQuery = req.query.search;
    const searchField = req.query.searchField;

    if (searchQuery && searchField && !searchableFields.includes(searchField)) {
      return next(new AppError(`Invalid search field. Allowed fields: ${searchableFields.join(', ')}`, 400));
    }

    if (searchQuery) {
      req.search = {
        query: searchQuery,
        field: searchField || null
      };
    }

    next();
  };
};

// Middleware to validate date range parameters
export const validateDateRange = (req, res, next) => {
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  if (startDate && !Date.parse(startDate)) {
    return next(new AppError('Invalid start date format', 400));
  }

  if (endDate && !Date.parse(endDate)) {
    return next(new AppError('Invalid end date format', 400));
  }

  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    return next(new AppError('Start date must be before end date', 400));
  }

  if (startDate || endDate) {
    req.dateRange = {
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null
    };
  }

  next();
};

// Middleware to validate ObjectId parameters
export const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new AppError(`Invalid ${paramName} format`, 400));
    }

    next();
  };
};

// Middleware to validate required fields in request body
export const validateRequiredFields = (requiredFields = []) => {
  return (req, res, next) => {
    const missingFields = [];

    requiredFields.forEach(field => {
      if (field.includes('.')) {
        // Handle nested fields
        const fieldParts = field.split('.');
        let value = req.body;
        
        for (const part of fieldParts) {
          value = value?.[part];
          if (value === undefined || value === null || value === '') {
            missingFields.push(field);
            break;
          }
        }
      } else {
        // Handle simple fields
        if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
          missingFields.push(field);
        }
      }
    });

    if (missingFields.length > 0) {
      return next(new AppError(`Missing required fields: ${missingFields.join(', ')}`, 400));
    }

    next();
  };
};

// Middleware to sanitize input data
export const sanitizeInput = (req, res, next) => {
  // Remove any fields that start with $ or contain dots (MongoDB injection prevention)
  const sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    const sanitized = {};
    
    for (const [key, value] of Object.entries(obj)) {
      // Skip keys that start with $ or contain dots
      if (key.startsWith('$') || key.includes('.')) {
        continue;
      }
      
      if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  next();
};

export default {
  handleValidationErrors,
  validateFileUpload,
  validatePagination,
  validateSort,
  validateSearch,
  validateDateRange,
  validateObjectId,
  validateRequiredFields,
  sanitizeInput
};

