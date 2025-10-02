# C2C Platform Backend

A comprehensive backend API for the Campus-to-Corporate (C2C) internship platform, built with Node.js, Express, and MongoDB.

## Features

- **Multi-role Authentication**: Support for Students, Faculty, and Industry users
- **Google OAuth Integration**: Seamless login with Google accounts
- **Role-based Authorization**: Different permissions for different user types
- **Internship Management**: Complete CRUD operations for internships
- **Application System**: Students can apply, companies can manage applications
- **Dashboard APIs**: Role-specific dashboard data
- **File Upload Support**: Profile pictures, resumes, documents
- **Email Notifications**: Automated emails for various events
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Comprehensive data validation
- **Error Handling**: Centralized error management
- **Database Seeding**: Sample data for development

## Tech Stack

- **Runtime**: Node.js (ES6+ with modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Google OAuth
- **File Storage**: Cloudinary
- **Email**: Nodemailer
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Development**: Nodemon, Morgan logging

## Project Structure

```
Backend/
├── app.js                 # Main application file
├── package.json          # Dependencies and scripts
├── .env.example          # Environment variables template
├── config/               # Configuration files
│   ├── database.js       # MongoDB connection
│   ├── cloudinary.js     # File upload config
│   └── email.js          # Email configuration
├── models/               # Database models
│   ├── User.js           # Base user model
│   ├── Student.js        # Student model
│   ├── Faculty.js        # Faculty model
│   ├── Industry.js       # Industry model
│   ├── Internship.js     # Internship model
│   ├── Application.js    # Application model
│   ├── Report.js         # Report model
│   └── index.js          # Model exports
├── controllers/          # Route controllers
│   ├── authController.js # Authentication logic
│   ├── userController.js # User management
│   ├── internshipController.js # Internship management
│   └── dashboardController.js # Dashboard data
├── services/             # Business logic layer
│   ├── authService.js    # Authentication services
│   ├── userService.js    # User services
│   ├── internshipService.js # Internship services
│   ├── dashboardService.js # Dashboard services
│   └── index.js          # Service exports
├── Routes/               # API routes
│   ├── authRoutes.js     # Authentication routes
│   ├── userRoutes.js     # User routes
│   ├── internshipRoutes.js # Internship routes
│   ├── dashboardRoutes.js # Dashboard routes
│   └── index.js          # Route exports
├── middlewares/          # Custom middleware
│   ├── auth.js           # Authentication middleware
│   ├── validation.js     # Input validation
│   ├── upload.js         # File upload handling
│   ├── rateLimiter.js    # Rate limiting
│   ├── errorHandler.js   # Error handling
│   └── index.js          # Middleware exports
└── utils/                # Utility functions
    ├── appError.js       # Custom error class
    ├── asyncHandler.js   # Async error wrapper
    ├── apiResponse.js    # Standardized responses
    ├── helpers.js        # Helper functions
    ├── seedDatabase.js   # Database seeding
    └── index.js          # Utility exports
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/c2c_platform
   
   # Server
   PORT=5000
   NODE_ENV=development
   
   # JWT
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   
   # Email
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password_here
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
   # Frontend
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google-login` - Google OAuth login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile
- `GET /api/users` - Get all users (faculty only)
- `GET /api/users/role/:role` - Get users by role
- `GET /api/users/search` - Search users
- `GET /api/users/statistics` - Get user statistics
- `GET /api/users/:userId` - Get user by ID
- `PUT /api/users/:userId` - Update user
- `DELETE /api/users/:userId` - Delete user

### Internships
- `GET /api/internships` - Get all internships
- `POST /api/internships` - Create internship (industry only)
- `GET /api/internships/featured` - Get featured internships
- `GET /api/internships/recent` - Get recent internships
- `GET /api/internships/search` - Search internships
- `GET /api/internships/my-internships` - Get company's internships
- `GET /api/internships/:id` - Get internship by ID
- `PUT /api/internships/:id` - Update internship
- `DELETE /api/internships/:id` - Delete internship
- `POST /api/internships/:id/apply` - Apply for internship
- `GET /api/internships/:id/applications` - Get applications

### Dashboard
- `GET /api/dashboard` - Get role-specific dashboard
- `GET /api/dashboard/student` - Get student dashboard
- `GET /api/dashboard/faculty` - Get faculty dashboard
- `GET /api/dashboard/industry` - Get industry dashboard
- `GET /api/dashboard/statistics` - Get platform statistics
- `GET /api/dashboard/activity` - Get activity feed

## User Roles

### Student
- Create and manage profile
- Browse and search internships
- Apply for internships
- Track application status
- Submit reports
- View personalized dashboard

### Faculty
- Manage student profiles
- Approve internship applications
- Review student reports
- Monitor student progress
- Access analytics and reports
- Approve internship postings

### Industry
- Create company profile
- Post internship opportunities
- Manage applications
- Review and select candidates
- Track hiring metrics
- Communicate with students

## Database Models

### User (Base Model)
- Basic user information
- Authentication data
- Profile completion tracking

### Student (extends User)
- Academic information
- Skills and preferences
- Faculty mentor assignment
- Application statistics

### Faculty (extends User)
- Professional information
- Mentorship capacity
- Permissions and roles
- Department management

### Industry (extends User)
- Company information
- Verification status
- Subscription details
- Partnership information

### Internship
- Job details and requirements
- Application settings
- Approval workflow
- Statistics tracking

### Application
- Student application data
- Status tracking
- Interview information
- Selection details

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Comprehensive data validation
- **CORS Configuration**: Controlled cross-origin requests
- **Helmet Security**: Security headers
- **Input Sanitization**: Protection against injection attacks

## Development

### Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Seed database with sample data
npm test           # Run tests (when implemented)
```

### Code Style
- ES6+ with modules
- Async/await for asynchronous operations
- Consistent error handling
- Comprehensive input validation
- Clean code principles

## Deployment

1. **Environment Setup**
   - Set production environment variables
   - Configure MongoDB Atlas or production database
   - Set up Cloudinary for file storage
   - Configure email service

2. **Build and Deploy**
   ```bash
   npm install --production
   npm start
   ```

3. **Health Check**
   - Visit `/health` endpoint to verify deployment
   - Check database connectivity
   - Verify external service integrations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For support and questions:
- Email: support@c2cplatform.com
- Documentation: https://api-docs.c2cplatform.com
- Issues: Create an issue in the repository

## License

This project is licensed under the MIT License.

