import mongoose from 'mongoose';

const internshipSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Internship title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  
  // Company Information
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Industry',
    required: [true, 'Company is required']
  },
  
  // Position Details
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  domain: {
    type: String,
    required: [true, 'Domain is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['remote', 'onsite', 'hybrid'],
    required: [true, 'Work type is required']
  },
  
  // Duration and Timeline
  duration: {
    months: {
      type: Number,
      required: [true, 'Duration in months is required'],
      min: 1,
      max: 12
    },
    isFlexible: {
      type: Boolean,
      default: false
    }
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  applicationDeadline: {
    type: Date,
    required: [true, 'Application deadline is required']
  },
  
  // Location
  location: {
    city: {
      type: String,
      required: function() {
        return this.type !== 'remote';
      },
      trim: true
    },
    state: {
      type: String,
      required: function() {
        return this.type !== 'remote';
      },
      trim: true
    },
    country: {
      type: String,
      default: 'India',
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    isRemoteAllowed: {
      type: Boolean,
      default: false
    }
  },
  
  // Requirements
  requirements: {
    education: {
      minimumQualification: {
        type: String,
        required: [true, 'Minimum qualification is required'],
        trim: true
      },
      preferredCourses: [{
        type: String,
        trim: true
      }],
      minimumCGPA: {
        type: Number,
        min: 0,
        max: 10,
        default: null
      }
    },
    skills: {
      required: [{
        name: {
          type: String,
          required: true,
          trim: true
        },
        level: {
          type: String,
          enum: ['beginner', 'intermediate', 'advanced', 'expert'],
          default: 'beginner'
        }
      }],
      preferred: [{
        name: {
          type: String,
          required: true,
          trim: true
        },
        level: {
          type: String,
          enum: ['beginner', 'intermediate', 'advanced', 'expert'],
          default: 'beginner'
        }
      }]
    },
    experience: {
      required: {
        type: Boolean,
        default: false
      },
      minimumMonths: {
        type: Number,
        default: 0
      },
      description: {
        type: String,
        trim: true
      }
    }
  },
  
  // Compensation
  stipend: {
    amount: {
      type: Number,
      min: 0,
      default: null
    },
    currency: {
      type: String,
      default: 'INR'
    },
    frequency: {
      type: String,
      enum: ['monthly', 'weekly', 'daily', 'total'],
      default: 'monthly'
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    additionalBenefits: [{
      type: String,
      trim: true
    }]
  },
  
  // Application Settings
  maxApplications: {
    type: Number,
    default: 100,
    min: 1
  },
  applicationProcess: {
    steps: [{
      step: {
        type: String,
        enum: ['application', 'screening', 'interview', 'assignment', 'final'],
        required: true
      },
      description: {
        type: String,
        trim: true
      },
      isRequired: {
        type: Boolean,
        default: true
      }
    }],
    documentsRequired: [{
      type: String,
      enum: ['resume', 'cover_letter', 'portfolio', 'transcript', 'certificates', 'other'],
      required: true
    }]
  },
  
  // Status and Visibility
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'closed', 'cancelled'],
    default: 'draft'
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Approval Workflow
  approval: {
    isRequired: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
      default: null
    },
    approvedAt: {
      type: Date,
      default: null
    },
    rejectionReason: {
      type: String,
      trim: true
    }
  },
  
  // Statistics
  stats: {
    views: {
      type: Number,
      default: 0
    },
    applications: {
      type: Number,
      default: 0
    },
    shortlisted: {
      type: Number,
      default: 0
    },
    selected: {
      type: Number,
      default: 0
    }
  },
  
  // Tags and Categories
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Contact Information
  contactPerson: {
    name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    designation: {
      type: String,
      trim: true
    }
  },
  
  // Additional Information
  learningOutcomes: [{
    type: String,
    trim: true
  }],
  mentorshipProvided: {
    type: Boolean,
    default: true
  },
  certificateProvided: {
    type: Boolean,
    default: false
  },
  
  // Created by
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Industry',
    required: true
  }
}, {
  timestamps: true
});

// Indexes
internshipSchema.index({ title: 'text', description: 'text' });
internshipSchema.index({ company: 1 });
internshipSchema.index({ domain: 1 });
internshipSchema.index({ type: 1 });
internshipSchema.index({ status: 1 });
internshipSchema.index({ 'location.city': 1 });
internshipSchema.index({ applicationDeadline: 1 });
internshipSchema.index({ startDate: 1 });
internshipSchema.index({ createdAt: -1 });
internshipSchema.index({ 'approval.status': 1 });
internshipSchema.index({ tags: 1 });

// Virtual for application status
internshipSchema.virtual('isApplicationOpen').get(function() {
  const now = new Date();
  return this.status === 'active' && 
         this.applicationDeadline > now && 
         this.stats.applications < this.maxApplications &&
         this.approval.status === 'approved';
});

// Virtual for days remaining to apply
internshipSchema.virtual('daysToApply').get(function() {
  const now = new Date();
  const deadline = new Date(this.applicationDeadline);
  const diffTime = deadline - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

// Method to increment view count
internshipSchema.methods.incrementViews = function() {
  this.stats.views += 1;
  return this.save();
};

// Method to check if user can apply
internshipSchema.methods.canUserApply = function(userId) {
  return this.isApplicationOpen && 
         this.stats.applications < this.maxApplications;
};

// Pre-save middleware to validate dates
internshipSchema.pre('save', function(next) {
  if (this.startDate >= this.endDate) {
    next(new Error('End date must be after start date'));
  }
  if (this.applicationDeadline >= this.startDate) {
    next(new Error('Application deadline must be before start date'));
  }
  next();
});

// Ensure virtual fields are serialized
internshipSchema.set('toJSON', { virtuals: true });
internshipSchema.set('toObject', { virtuals: true });

const Internship = mongoose.model('Internship', internshipSchema);

export default Internship;

