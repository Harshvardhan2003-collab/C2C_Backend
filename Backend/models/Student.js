import mongoose from 'mongoose';
import User from './User.js';

const studentSchema = new mongoose.Schema({
  // Academic Information
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    unique: true,
    trim: true
  },
  college: {
    name: {
      type: String,
      required: [true, 'College name is required'],
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    }
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  course: {
    type: String,
    required: [true, 'Course is required'],
    trim: true
  },
  semester: {
    type: Number,
    required: [true, 'Semester is required'],
    min: 1,
    max: 12
  },
  academicYear: {
    type: String,
    required: [true, 'Academic year is required'],
    match: [/^\d{4}-\d{4}$/, 'Academic year format should be YYYY-YYYY']
  },
  cgpa: {
    type: Number,
    min: 0,
    max: 10,
    default: null
  },
  
  // Personal Information
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
    required: [true, 'Gender is required']
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    pincode: String
  },
  
  // Skills and Experience
  skills: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'beginner'
    },
    verified: {
      type: Boolean,
      default: false
    }
  }],
  
  // Documents
  resume: {
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  portfolio: {
    type: String,
    trim: true
  },
  linkedinProfile: {
    type: String,
    trim: true
  },
  githubProfile: {
    type: String,
    trim: true
  },
  
  // Preferences
  internshipPreferences: {
    domains: [{
      type: String,
      trim: true
    }],
    locations: [{
      type: String,
      trim: true
    }],
    workType: {
      type: String,
      enum: ['remote', 'onsite', 'hybrid', 'any'],
      default: 'any'
    },
    duration: {
      min: {
        type: Number,
        default: 1 // months
      },
      max: {
        type: Number,
        default: 6 // months
      }
    },
    expectedStipend: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'INR'
      }
    }
  },
  
  // Faculty Assignment
  facultyMentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    default: null
  },
  
  // Statistics
  stats: {
    applicationsSubmitted: {
      type: Number,
      default: 0
    },
    interviewsAttended: {
      type: Number,
      default: 0
    },
    internshipsCompleted: {
      type: Number,
      default: 0
    },
    creditsEarned: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Indexes
// Note: studentId already has unique index from schema definition
studentSchema.index({ 'college.name': 1 });
studentSchema.index({ department: 1 });
studentSchema.index({ semester: 1 });
studentSchema.index({ facultyMentor: 1 });

// Override profile completion calculation for students
studentSchema.methods.calculateProfileCompletion = function() {
  const requiredFields = [
    'name', 'email', 'phone', 'studentId', 'college.name', 
    'department', 'course', 'semester', 'academicYear', 
    'dateOfBirth', 'gender'
  ];
  
  const optionalFields = [
    'profilePicture', 'cgpa', 'resume.url', 'skills', 
    'portfolio', 'linkedinProfile'
  ];
  
  let completed = 0;
  let total = requiredFields.length + optionalFields.length;
  
  // Check required fields
  requiredFields.forEach(field => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (this[parent] && this[parent][child]) completed++;
    } else if (this[field]) {
      completed++;
    }
  });
  
  // Check optional fields
  optionalFields.forEach(field => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (this[parent] && this[parent][child]) completed++;
    } else if (field === 'skills' && this[field] && this[field].length > 0) {
      completed++;
    } else if (this[field]) {
      completed++;
    }
  });
  
  this.profileCompletion = Math.round((completed / total) * 100);
  return this.profileCompletion;
};

const Student = User.discriminator('student', studentSchema);

export default Student;

