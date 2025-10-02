import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../utils/appError.js';

// Configure multer for memory storage (for Cloudinary upload)
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  // Get allowed file types from environment or use defaults
  const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(`File type ${file.mimetype} is not allowed`, 400), false);
  }
};

// Create multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
    files: 10 // Maximum 10 files per request
  }
});

// Middleware for single file upload
export const uploadSingle = (fieldName) => {
  return (req, res, next) => {
    const uploadMiddleware = upload.single(fieldName);
    
    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new AppError('File too large', 400));
        } else if (err.code === 'LIMIT_FILE_COUNT') {
          return next(new AppError('Too many files', 400));
        } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return next(new AppError('Unexpected field', 400));
        }
        return next(new AppError(err.message, 400));
      } else if (err) {
        return next(err);
      }
      next();
    });
  };
};

// Middleware for multiple file upload
export const uploadMultiple = (fieldName, maxCount = 5) => {
  return (req, res, next) => {
    const uploadMiddleware = upload.array(fieldName, maxCount);
    
    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new AppError('File too large', 400));
        } else if (err.code === 'LIMIT_FILE_COUNT') {
          return next(new AppError('Too many files', 400));
        } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return next(new AppError('Unexpected field', 400));
        }
        return next(new AppError(err.message, 400));
      } else if (err) {
        return next(err);
      }
      next();
    });
  };
};

// Middleware for multiple fields with files
export const uploadFields = (fields) => {
  return (req, res, next) => {
    const uploadMiddleware = upload.fields(fields);
    
    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new AppError('File too large', 400));
        } else if (err.code === 'LIMIT_FILE_COUNT') {
          return next(new AppError('Too many files', 400));
        } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return next(new AppError('Unexpected field', 400));
        }
        return next(new AppError(err.message, 400));
      } else if (err) {
        return next(err);
      }
      next();
    });
  };
};

// Middleware for any file upload
export const uploadAny = () => {
  return (req, res, next) => {
    const uploadMiddleware = upload.any();
    
    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new AppError('File too large', 400));
        } else if (err.code === 'LIMIT_FILE_COUNT') {
          return next(new AppError('Too many files', 400));
        }
        return next(new AppError(err.message, 400));
      } else if (err) {
        return next(err);
      }
      next();
    });
  };
};

// Middleware to validate uploaded files
export const validateUploadedFiles = (requiredFields = []) => {
  return (req, res, next) => {
    const missingFiles = [];
    
    requiredFields.forEach(field => {
      if (!req.file && !req.files?.[field] && !req.files?.find(f => f.fieldname === field)) {
        missingFiles.push(field);
      }
    });
    
    if (missingFiles.length > 0) {
      return next(new AppError(`Missing required files: ${missingFiles.join(', ')}`, 400));
    }
    
    next();
  };
};

// Common upload configurations
export const uploadConfigs = {
  // Profile picture upload
  profilePicture: uploadSingle('profilePicture'),
  
  // Resume upload
  resume: uploadSingle('resume'),
  
  // Company logo upload
  companyLogo: uploadSingle('companyLogo'),
  
  // Multiple documents upload
  documents: uploadMultiple('documents', 5),
  
  // Student profile files (resume + certificates)
  studentProfile: uploadFields([
    { name: 'resume', maxCount: 1 },
    { name: 'certificates', maxCount: 5 }
  ]),
  
  // Industry profile files (logo + documents)
  industryProfile: uploadFields([
    { name: 'companyLogo', maxCount: 1 },
    { name: 'verificationDocuments', maxCount: 3 }
  ]),
  
  // Report attachments
  reportAttachments: uploadMultiple('attachments', 3)
};

export default {
  uploadSingle,
  uploadMultiple,
  uploadFields,
  uploadAny,
  validateUploadedFiles,
  uploadConfigs
};
