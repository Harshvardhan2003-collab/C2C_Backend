import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  // Basic Information
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student is required']
  },
  internship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',
    required: [true, 'Internship is required']
  },
  
  // Application Status
  status: {
    type: String,
    enum: ['submitted', 'under_review', 'shortlisted', 'interview_scheduled', 'interviewed', 'selected', 'rejected', 'withdrawn'],
    default: 'submitted'
  },
  
  // Application Documents
  documents: {
    resume: {
      filename: String,
      url: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    },
    coverLetter: {
      content: {
        type: String,
        maxlength: [1000, 'Cover letter cannot exceed 1000 characters']
      },
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    },
    portfolio: {
      url: String,
      description: String
    },
    transcript: {
      filename: String,
      url: String,
      uploadedAt: Date
    },
    certificates: [{
      name: String,
      filename: String,
      url: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }],
    additional: [{
      name: String,
      filename: String,
      url: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  
  // Application Responses
  responses: {
    whyInterested: {
      type: String,
      maxlength: [500, 'Response cannot exceed 500 characters']
    },
    relevantExperience: {
      type: String,
      maxlength: [500, 'Response cannot exceed 500 characters']
    },
    availability: {
      startDate: Date,
      endDate: Date,
      hoursPerWeek: Number
    },
    expectedLearning: {
      type: String,
      maxlength: [300, 'Response cannot exceed 300 characters']
    },
    additionalInfo: {
      type: String,
      maxlength: [300, 'Response cannot exceed 300 characters']
    }
  },
  
  // Interview Information
  interview: {
    isScheduled: {
      type: Boolean,
      default: false
    },
    scheduledDate: Date,
    scheduledTime: String,
    mode: {
      type: String,
      enum: ['online', 'offline', 'phone'],
      default: 'online'
    },
    location: String,
    meetingLink: String,
    interviewers: [{
      name: String,
      designation: String,
      email: String
    }],
    duration: {
      type: Number, // in minutes
      default: 60
    },
    notes: String,
    feedback: {
      technical: {
        rating: {
          type: Number,
          min: 1,
          max: 10
        },
        comments: String
      },
      communication: {
        rating: {
          type: Number,
          min: 1,
          max: 10
        },
        comments: String
      },
      overall: {
        rating: {
          type: Number,
          min: 1,
          max: 10
        },
        comments: String
      },
      recommendation: {
        type: String,
        enum: ['strongly_recommend', 'recommend', 'neutral', 'not_recommend', 'strongly_not_recommend']
      }
    }
  },
  
  // Assessment/Assignment
  assessment: {
    isRequired: {
      type: Boolean,
      default: false
    },
    title: String,
    description: String,
    dueDate: Date,
    submissionUrl: String,
    submittedAt: Date,
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    feedback: String
  },
  
  // Timeline Tracking
  timeline: [{
    status: {
      type: String,
      enum: ['submitted', 'under_review', 'shortlisted', 'interview_scheduled', 'interviewed', 'selected', 'rejected', 'withdrawn']
    },
    date: {
      type: Date,
      default: Date.now
    },
    notes: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Faculty Approval (if required)
  facultyApproval: {
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
      ref: 'Faculty'
    },
    approvedAt: Date,
    rejectionReason: String,
    comments: String
  },
  
  // Communication Log
  communications: [{
    type: {
      type: String,
      enum: ['email', 'phone', 'message', 'interview', 'meeting']
    },
    subject: String,
    content: String,
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    }
  }],
  
  // Selection Details (if selected)
  selection: {
    selectedAt: Date,
    startDate: Date,
    endDate: Date,
    stipend: {
      amount: Number,
      currency: {
        type: String,
        default: 'INR'
      },
      frequency: {
        type: String,
        enum: ['monthly', 'weekly', 'daily', 'total'],
        default: 'monthly'
      }
    },
    mentor: {
      name: String,
      email: String,
      designation: String
    },
    workLocation: String,
    additionalTerms: String
  },
  
  // Rejection Details (if rejected)
  rejection: {
    rejectedAt: Date,
    reason: {
      type: String,
      enum: ['qualifications', 'experience', 'skills', 'interview', 'assessment', 'other']
    },
    feedback: String,
    canReapply: {
      type: Boolean,
      default: false
    }
  },
  
  // Metadata
  source: {
    type: String,
    enum: ['web', 'mobile', 'api'],
    default: 'web'
  },
  ipAddress: String,
  userAgent: String,
  
  // Flags
  isStarred: {
    type: Boolean,
    default: false
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Compound indexes
applicationSchema.index({ student: 1, internship: 1 }, { unique: true });
applicationSchema.index({ student: 1, status: 1 });
applicationSchema.index({ internship: 1, status: 1 });
applicationSchema.index({ createdAt: -1 });
applicationSchema.index({ 'facultyApproval.status': 1 });
applicationSchema.index({ 'interview.scheduledDate': 1 });

// Virtual for application age in days
applicationSchema.virtual('ageInDays').get(function() {
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffTime = now - created;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
});

// Method to update status with timeline
applicationSchema.methods.updateStatus = function(newStatus, notes = '', updatedBy = null) {
  this.status = newStatus;
  this.timeline.push({
    status: newStatus,
    date: new Date(),
    notes,
    updatedBy
  });
  
  // Update specific fields based on status
  switch (newStatus) {
    case 'selected':
      this.selection.selectedAt = new Date();
      break;
    case 'rejected':
      this.rejection.rejectedAt = new Date();
      break;
    case 'interview_scheduled':
      this.interview.isScheduled = true;
      break;
  }
  
  return this.save();
};

// Method to add communication
applicationSchema.methods.addCommunication = function(communicationData) {
  this.communications.push(communicationData);
  return this.save();
};

// Method to check if application can be withdrawn
applicationSchema.methods.canBeWithdrawn = function() {
  const nonWithdrawableStatuses = ['selected', 'rejected', 'withdrawn'];
  return !nonWithdrawableStatuses.includes(this.status);
};

// Method to calculate overall interview score
applicationSchema.methods.getOverallInterviewScore = function() {
  const feedback = this.interview.feedback;
  if (!feedback || !feedback.technical || !feedback.communication || !feedback.overall) {
    return null;
  }
  
  return Math.round((feedback.technical.rating + feedback.communication.rating + feedback.overall.rating) / 3);
};

// Pre-save middleware to add initial timeline entry
applicationSchema.pre('save', function(next) {
  if (this.isNew) {
    this.timeline.push({
      status: 'submitted',
      date: new Date(),
      notes: 'Application submitted'
    });
  }
  next();
});

// Ensure virtual fields are serialized
applicationSchema.set('toJSON', { virtuals: true });
applicationSchema.set('toObject', { virtuals: true });

const Application = mongoose.model('Application', applicationSchema);

export default Application;

