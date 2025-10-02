import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/appError.js';

// Generate JWT Token
export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Generate Refresh Token
export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d'
  });
};

// Verify JWT Token
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Verify Refresh Token
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

// Middleware to protect routes (authentication required)
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check for token in cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new AppError('Access denied. No token provided.', 401));
  }

  try {
    // Verify token
    const decoded = verifyToken(token);
    
    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return next(new AppError('Token is invalid. User not found.', 401));
    }

    if (!user.isActive) {
      return next(new AppError('User account is deactivated.', 401));
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token.', 401));
    } else if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token has expired.', 401));
    }
    return next(new AppError('Token verification failed.', 401));
  }
});

// Middleware to authorize specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError(`Access denied. Role '${req.user.role}' is not authorized.`, 403));
    }

    next();
  };
};

// Middleware to check if user owns the resource or has admin privileges
export const authorizeOwnerOrAdmin = (resourceUserField = 'user') => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }

    // Admin or faculty can access any resource
    if (req.user.role === 'faculty') {
      return next();
    }

    // Check if user owns the resource
    const resourceUserId = req.resource ? req.resource[resourceUserField] : req.params.userId;
    
    if (req.user._id.toString() !== resourceUserId.toString()) {
      return next(new AppError('Access denied. You can only access your own resources.', 403));
    }

    next();
  });
};

// Middleware to check if user is verified
export const requireVerification = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required.', 401));
  }

  if (!req.user.isEmailVerified) {
    return next(new AppError('Email verification required.', 403));
  }

  next();
};

// Middleware for optional authentication (doesn't fail if no token)
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check for token in cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      // Verify token
      const decoded = verifyToken(token);
      
      // Get user from database
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
      }
    } catch (error) {
      // Silently fail for optional auth
      console.log('Optional auth failed:', error.message);
    }
  }

  next();
});

// Middleware to check faculty permissions
export const checkFacultyPermission = (permission) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user || req.user.role !== 'faculty') {
      return next(new AppError('Faculty access required.', 403));
    }

    // Get faculty details
    const Faculty = User.discriminator('faculty');
    const faculty = await Faculty.findById(req.user._id);

    if (!faculty) {
      return next(new AppError('Faculty profile not found.', 404));
    }

    if (!faculty.permissions[permission]) {
      return next(new AppError(`Permission '${permission}' is required.`, 403));
    }

    req.faculty = faculty;
    next();
  });
};

// Middleware to check if industry is verified
export const requireIndustryVerification = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== 'industry') {
    return next(new AppError('Industry access required.', 403));
  }

  // Get industry details
  const Industry = User.discriminator('industry');
  const industry = await Industry.findById(req.user._id);

  if (!industry) {
    return next(new AppError('Industry profile not found.', 404));
  }

  if (!industry.verification.isVerified) {
    return next(new AppError('Company verification required to perform this action.', 403));
  }

  req.industry = industry;
  next();
});

// Middleware to set CORS headers for authentication
export const setCorsHeaders = (req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  // Reflect the request origin to align with cors() validation
  const origin = req.headers.origin || process.env.FRONTEND_URL || 'http://localhost:5173';
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization,Cache-Control,Pragma');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
};

export default {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
  protect,
  authorize,
  authorizeOwnerOrAdmin,
  requireVerification,
  optionalAuth,
  checkFacultyPermission,
  requireIndustryVerification,
  setCorsHeaders
};

