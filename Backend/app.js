import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import 'express-async-errors';

// Import configurations
import connectDB from './config/database.js';

// Import routes
import { 
  authRoutes, 
  userRoutes, 
  internshipRoutes, 
  dashboardRoutes 
} from './Routes/index.js';

// Import middleware
import { globalErrorHandler, handleUnhandledRoutes } from './middlewares/errorHandler.js';
import { generalLimiter } from './middlewares/rateLimiter.js';
import { setCorsHeaders } from './middlewares/auth.js';
import { sanitizeInput } from './middlewares/validation.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Trust proxy (for deployment behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5000',
      'http://127.0.0.1:5173',
      'http://localhost:8080'
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count']
};

app.use(cors(corsOptions));
app.use(setCorsHeaders);

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Input sanitization
app.use(sanitizeInput);

// Rate limiting
app.use('/api/', generalLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Note: Using Cloudinary for file storage, no need for local static files

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'C2C Platform API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      internships: '/api/internships',
      dashboard: '/api/dashboard'
    },
    documentation: 'https://api-docs.c2cplatform.com',
    support: 'support@c2cplatform.com'
  });
});

// Handle unhandled routes
app.all('*', handleUnhandledRoutes);

// Global error handling middleware
app.use(globalErrorHandler);

// Connect to database and start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📱 Environment: ${process.env.NODE_ENV}`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
      console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
    });

    // Handle server shutdown gracefully
    const gracefulShutdown = (signal) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
