import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

// Generate random string
export const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Generate UUID
export const generateUUID = () => {
  return uuidv4();
};

// Generate random token for email verification, password reset, etc.
export const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Hash token for storage in database
export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// Generate student ID
export const generateStudentId = (college, year, sequence) => {
  const collegeCode = college.substring(0, 3).toUpperCase();
  const yearCode = year.toString().slice(-2);
  const seqCode = sequence.toString().padStart(4, '0');
  return `${collegeCode}${yearCode}${seqCode}`;
};

// Generate employee ID for faculty
export const generateEmployeeId = (department, sequence) => {
  const deptCode = department.substring(0, 3).toUpperCase();
  const seqCode = sequence.toString().padStart(4, '0');
  return `FAC${deptCode}${seqCode}`;
};

// Calculate age from date of birth
export const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Format date to readable string
export const formatDate = (date, format = 'DD/MM/YYYY') => {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  
  switch (format) {
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    default:
      return d.toLocaleDateString();
  }
};

// Calculate duration between two dates
export const calculateDuration = (startDate, endDate, unit = 'days') => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  
  switch (unit) {
    case 'days':
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    case 'weeks':
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    case 'months':
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    case 'years':
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
    default:
      return diffTime;
  }
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone);
};

// Sanitize string (remove HTML tags, special characters)
export const sanitizeString = (str) => {
  if (!str) return '';
  return str.replace(/<[^>]*>?/gm, '').trim();
};

// Capitalize first letter of each word
export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

// Generate slug from string
export const generateSlug = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Remove undefined/null values from object
export const cleanObject = (obj) => {
  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'object' && !Array.isArray(value)) {
        const cleanedNested = cleanObject(value);
        if (Object.keys(cleanedNested).length > 0) {
          cleaned[key] = cleanedNested;
        }
      } else {
        cleaned[key] = value;
      }
    }
  }
  return cleaned;
};

// Paginate array
export const paginateArray = (array, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  return {
    data: array.slice(startIndex, endIndex),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(array.length / limit),
      totalItems: array.length,
      itemsPerPage: limit,
      hasNextPage: endIndex < array.length,
      hasPrevPage: startIndex > 0
    }
  };
};

// Generate pagination metadata
export const generatePaginationMeta = (totalItems, page, limit) => {
  const totalPages = Math.ceil(totalItems / limit);
  
  return {
    currentPage: page,
    totalPages,
    totalItems,
    itemsPerPage: limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null
  };
};

// Calculate percentage
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Generate random color
export const generateRandomColor = () => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get file extension
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

// Check if date is in past
export const isDateInPast = (date) => {
  return new Date(date) < new Date();
};

// Check if date is in future
export const isDateInFuture = (date) => {
  return new Date(date) > new Date();
};

// Generate academic year string
export const generateAcademicYear = (startYear) => {
  return `${startYear}-${startYear + 1}`;
};

// Get current academic year
export const getCurrentAcademicYear = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12
  
  // Academic year typically starts in July/August
  if (currentMonth >= 7) {
    return generateAcademicYear(currentYear);
  } else {
    return generateAcademicYear(currentYear - 1);
  }
};

// Extract Cloudinary public ID from URL
export const extractCloudinaryPublicId = (cloudinaryUrl) => {
  if (!cloudinaryUrl) return null;
  
  try {
    // Extract the public ID from Cloudinary URL
    // Format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/public_id.extension
    const urlParts = cloudinaryUrl.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1) return null;
    
    // Get everything after 'upload' and version (if present)
    let pathParts = urlParts.slice(uploadIndex + 1);
    
    // Remove version if present (starts with 'v' followed by numbers)
    if (pathParts[0] && pathParts[0].match(/^v\d+$/)) {
      pathParts = pathParts.slice(1);
    }
    
    // Join the remaining parts and remove file extension
    const fullPath = pathParts.join('/');
    const publicId = fullPath.replace(/\.[^/.]+$/, ''); // Remove extension
    
    return publicId;
  } catch (error) {
    console.error('Error extracting Cloudinary public ID:', error);
    return null;
  }
};

// Get file upload configuration based on file type
export const getUploadConfig = (fileType, userId) => {
  const timestamp = Date.now();
  
  const configs = {
    profilePicture: {
      folder: 'c2c-platform/profiles',
      public_id: `profile_${userId}_${timestamp}`,
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    },
    resume: {
      folder: 'c2c-platform/resumes',
      public_id: `resume_${userId}_${timestamp}`,
      resource_type: 'raw' // For PDF files
    },
    companyLogo: {
      folder: 'c2c-platform/logos',
      public_id: `logo_${userId}_${timestamp}`,
      transformation: [
        { width: 300, height: 300, crop: 'fit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    },
    documents: {
      folder: 'c2c-platform/documents',
      public_id: `doc_${userId}_${timestamp}`,
      resource_type: 'auto'
    },
    certificates: {
      folder: 'c2c-platform/certificates',
      public_id: `cert_${userId}_${timestamp}`,
      resource_type: 'auto'
    }
  };
  
  return configs[fileType] || configs.documents;
};

export default {
  generateRandomString,
  generateUUID,
  generateToken,
  hashToken,
  generateStudentId,
  generateEmployeeId,
  calculateAge,
  formatDate,
  calculateDuration,
  isValidEmail,
  isValidPhone,
  sanitizeString,
  capitalizeWords,
  generateSlug,
  deepClone,
  cleanObject,
  paginateArray,
  generatePaginationMeta,
  calculatePercentage,
  generateRandomColor,
  formatFileSize,
  getFileExtension,
  isDateInPast,
  isDateInFuture,
  generateAcademicYear,
  getCurrentAcademicYear,
  extractCloudinaryPublicId,
  getUploadConfig
};
