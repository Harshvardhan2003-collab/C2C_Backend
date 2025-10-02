import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
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
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: [true, 'Application is required']
  },
  
  // Report Type and Period
  type: {
    type: String,
    enum: ['weekly', 'monthly', 'final', 'mid_term'],
    required: [true, 'Report type is required']
  },
  weekNumber: {
    type: Number,
    min: 1,
    required: function() {
      return this.type === 'weekly';
    }
  },
  monthNumber: {
    type: Number,
    min: 1,
    required: function() {
      return this.type === 'monthly';
    }
  },
  reportingPeriod: {
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    }
  },
  
  // Report Content
  content: {
    summary: {
      type: String,
      required: [true, 'Summary is required'],
      maxlength: [1000, 'Summary cannot exceed 1000 characters']
    },
    tasksCompleted: [{
      task: {
        type: String,
        required: true,
        maxlength: [200, 'Task description cannot exceed 200 characters']
      },
      description: {
        type: String,
        maxlength: [500, 'Task description cannot exceed 500 characters']
      },
      completionDate: Date,
      hoursSpent: {
        type: Number,
        min: 0
      }
    }],
    learningOutcomes: [{
      skill: {
        type: String,
        required: true,
        trim: true
      },
      description: {
        type: String,
        maxlength: [300, 'Learning outcome description cannot exceed 300 characters']
      },
      proficiencyLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        default: 'beginner'
      }
    }],
    challenges: [{
      challenge: {
        type: String,
        required: true,
        maxlength: [200, 'Challenge description cannot exceed 200 characters']
      },
      solution: {
        type: String,
        maxlength: [300, 'Solution description cannot exceed 300 characters']
      },
      status: {
        type: String,
        enum: ['resolved', 'ongoing', 'escalated'],
        default: 'ongoing'
      }
    }],
    achievements: [{
      title: {
        type: String,
        required: true,
        maxlength: [100, 'Achievement title cannot exceed 100 characters']
      },
      description: {
        type: String,
        maxlength: [300, 'Achievement description cannot exceed 300 characters']
      },
      impact: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
      }
    }],
    upcomingTasks: [{
      task: {
        type: String,
        required: true,
        maxlength: [200, 'Task description cannot exceed 200 characters']
      },
      expectedCompletionDate: Date,
      priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
      }
    }]
  },
  
  // Time Tracking
  timeTracking: {
    totalHours: {
      type: Number,
      required: [true, 'Total hours is required'],
      min: 0
    },
    dailyHours: [{
      date: {
        type: Date,
        required: true
      },
      hours: {
        type: Number,
        required: true,
        min: 0,
        max: 24
      },
      activities: [{
        activity: String,
        duration: Number // in hours
      }]
    }],
    overtimeHours: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  
  // Ratings and Feedback
  selfAssessment: {
    overallSatisfaction: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Overall satisfaction rating is required']
    },
    learningRating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Learning rating is required']
    },
    mentorshipRating: {
      type: Number,
      min: 1,
      max: 5
    },
    workEnvironmentRating: {
      type: Number,
      min: 1,
      max: 5
    },
    skillDevelopmentRating: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  
  // Mentor Feedback
  mentorFeedback: {
    performanceRating: {
      type: Number,
      min: 1,
      max: 5
    },
    technicalSkills: {
      type: Number,
      min: 1,
      max: 5
    },
    communicationSkills: {
      type: Number,
      min: 1,
      max: 5
    },
    teamwork: {
      type: Number,
      min: 1,
      max: 5
    },
    initiative: {
      type: Number,
      min: 1,
      max: 5
    },
    punctuality: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: {
      type: String,
      maxlength: [500, 'Comments cannot exceed 500 characters']
    },
    suggestions: {
      type: String,
      maxlength: [500, 'Suggestions cannot exceed 500 characters']
    },
    providedBy: {
      name: String,
      designation: String,
      email: String
    },
    providedAt: Date
  },
  
  // Attachments
  attachments: [{
    filename: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['document', 'image', 'video', 'other'],
      default: 'document'
    },
    size: Number, // in bytes
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Submission Status
  submission: {
    status: {
      type: String,
      enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'revision_required'],
      default: 'draft'
    },
    submittedAt: Date,
    dueDate: {
      type: Date,
      required: [true, 'Due date is required']
    },
    isLate: {
      type: Boolean,
      default: false
    },
    submissionAttempts: {
      type: Number,
      default: 0
    }
  },
  
  // Faculty Review
  facultyReview: {
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty'
    },
    reviewedAt: Date,
    grade: {
      type: String,
      enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F']
    },
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    feedback: {
      type: String,
      maxlength: [1000, 'Feedback cannot exceed 1000 characters']
    },
    suggestions: {
      type: String,
      maxlength: [500, 'Suggestions cannot exceed 500 characters']
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'revision_required'],
      default: 'pending'
    }
  },
  
  // Metadata
  version: {
    type: Number,
    default: 1
  },
  isAutoSaved: {
    type: Boolean,
    default: false
  },
  lastAutoSaveAt: Date
}, {
  timestamps: true
});

// Indexes
reportSchema.index({ student: 1, type: 1, weekNumber: 1, monthNumber: 1 });
reportSchema.index({ internship: 1, type: 1 });
reportSchema.index({ 'submission.status': 1 });
reportSchema.index({ 'submission.dueDate': 1 });
reportSchema.index({ 'facultyReview.reviewedBy': 1 });
reportSchema.index({ createdAt: -1 });

// Virtual for days until due
reportSchema.virtual('daysUntilDue').get(function() {
  const now = new Date();
  const dueDate = new Date(this.submission.dueDate);
  const diffTime = dueDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for overall mentor rating
reportSchema.virtual('overallMentorRating').get(function() {
  const feedback = this.mentorFeedback;
  if (!feedback.performanceRating) return null;
  
  const ratings = [
    feedback.performanceRating,
    feedback.technicalSkills,
    feedback.communicationSkills,
    feedback.teamwork,
    feedback.initiative,
    feedback.punctuality
  ].filter(rating => rating !== undefined && rating !== null);
  
  if (ratings.length === 0) return null;
  
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return Math.round((sum / ratings.length) * 10) / 10; // Round to 1 decimal
});

// Method to submit report
reportSchema.methods.submit = function() {
  this.submission.status = 'submitted';
  this.submission.submittedAt = new Date();
  this.submission.submissionAttempts += 1;
  this.submission.isLate = new Date() > this.submission.dueDate;
  return this.save();
};

// Method to calculate completion percentage
reportSchema.methods.getCompletionPercentage = function() {
  const requiredFields = [
    'content.summary',
    'timeTracking.totalHours',
    'selfAssessment.overallSatisfaction',
    'selfAssessment.learningRating'
  ];
  
  let completed = 0;
  requiredFields.forEach(field => {
    const fieldParts = field.split('.');
    let value = this;
    for (const part of fieldParts) {
      value = value[part];
      if (!value) break;
    }
    if (value) completed++;
  });
  
  return Math.round((completed / requiredFields.length) * 100);
};

// Pre-save middleware to check if submission is late
reportSchema.pre('save', function(next) {
  if (this.submission.submittedAt && this.submission.dueDate) {
    this.submission.isLate = this.submission.submittedAt > this.submission.dueDate;
  }
  next();
});

// Ensure virtual fields are serialized
reportSchema.set('toJSON', { virtuals: true });
reportSchema.set('toObject', { virtuals: true });

const Report = mongoose.model('Report', reportSchema);

export default Report;

