import mongoose from 'mongoose';
import User from './User.js';

const industrySchema = new mongoose.Schema({
  // Company Information
  company: {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    website: {
      type: String,
      trim: true
    },
    logo: {
      type: String,
      default: null
    },
    industry: {
      type: String,
      required: [true, 'Industry type is required'],
      trim: true
    },
    size: {
      type: String,
      enum: ['startup', 'small', 'medium', 'large', 'enterprise'],
      required: [true, 'Company size is required']
    },
    founded: {
      type: Number,
      min: 1800,
      max: new Date().getFullYear()
    }
  },
  
  // Contact Person Information
  designation: {
    type: String,
    required: [true, 'Designation is required'],
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  
  // Company Address
  headquarters: {
    street: String,
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true
    },
    pincode: String
  },
  
  // Additional Locations
  locations: [{
    name: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      pincode: String
    },
    isHeadquarters: {
      type: Boolean,
      default: false
    }
  }],
  
  // Verification Status
  verification: {
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    documents: [{
      type: {
        type: String,
        enum: ['registration', 'tax', 'incorporation', 'other']
      },
      filename: String,
      url: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  
  // Internship Preferences
  internshipProgram: {
    isActive: {
      type: Boolean,
      default: true
    },
    domains: [{
      type: String,
      trim: true
    }],
    maxInterns: {
      type: Number,
      default: 10
    },
    preferredDuration: {
      min: {
        type: Number,
        default: 2 // months
      },
      max: {
        type: Number,
        default: 6 // months
      }
    },
    stipendRange: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'INR'
      }
    }
  },
  
  // Partnership Information
  partnerships: [{
    college: {
      type: String,
      required: true,
      trim: true
    },
    mouSigned: {
      type: Boolean,
      default: false
    },
    mouDocument: String,
    partnershipDate: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  
  // Social Media and Links
  socialMedia: {
    linkedin: String,
    twitter: String,
    facebook: String,
    instagram: String
  },
  
  // Statistics
  stats: {
    internshipsPosted: {
      type: Number,
      default: 0
    },
    applicationsReceived: {
      type: Number,
      default: 0
    },
    internsHired: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    }
  },
  
  // Subscription/Plan Information
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: Date,
    isActive: {
      type: Boolean,
      default: true
    },
    features: [{
      type: String
    }]
  }
}, {
  timestamps: true
});

// Indexes
industrySchema.index({ 'company.name': 1 });
industrySchema.index({ 'company.industry': 1 });
industrySchema.index({ 'headquarters.city': 1 });
industrySchema.index({ 'verification.isVerified': 1 });
industrySchema.index({ 'internshipProgram.isActive': 1 });

// Virtual for company display name
industrySchema.virtual('companyDisplayName').get(function() {
  return this.company.name;
});

// Method to check if company can post more internships
industrySchema.methods.canPostMoreInternships = function() {
  const planLimits = {
    free: 2,
    basic: 10,
    premium: 50,
    enterprise: -1 // unlimited
  };
  
  const limit = planLimits[this.subscription.plan];
  if (limit === -1) return true; // unlimited
  
  return this.stats.internshipsPosted < limit;
};

// Method to update company rating
industrySchema.methods.updateRating = function(newRating) {
  const totalRatings = this.stats.totalReviews * this.stats.averageRating;
  this.stats.totalReviews += 1;
  this.stats.averageRating = (totalRatings + newRating) / this.stats.totalReviews;
  this.stats.averageRating = Math.round(this.stats.averageRating * 10) / 10; // Round to 1 decimal
};

// Override profile completion calculation for industry
industrySchema.methods.calculateProfileCompletion = function() {
  const requiredFields = [
    'name', 'email', 'phone', 'company.name', 'company.industry', 
    'designation', 'headquarters.city', 'headquarters.state', 'headquarters.country'
  ];
  
  const optionalFields = [
    'profilePicture', 'company.description', 'company.website', 'company.logo',
    'company.founded', 'department', 'socialMedia.linkedin'
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
    } else if (this[field]) {
      completed++;
    }
  });
  
  this.profileCompletion = Math.round((completed / total) * 100);
  return this.profileCompletion;
};

// Ensure virtual fields are serialized
industrySchema.set('toJSON', { virtuals: true });
industrySchema.set('toObject', { virtuals: true });

const Industry = User.discriminator('industry', industrySchema);

export default Industry;

