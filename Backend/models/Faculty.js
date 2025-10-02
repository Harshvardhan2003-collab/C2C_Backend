import mongoose from 'mongoose';
import User from './User.js';

const facultySchema = new mongoose.Schema({
  // Professional Information
  employeeId: {
    type: String,
    required: [true, 'Employee ID is required'],
    unique: true,
    trim: true
  },
  designation: {
    type: String,
    required: [true, 'Designation is required'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
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
  
  // Academic Qualifications
  qualifications: [{
    degree: {
      type: String,
      required: true,
      trim: true
    },
    field: {
      type: String,
      required: true,
      trim: true
    },
    institution: {
      type: String,
      required: true,
      trim: true
    },
    year: {
      type: Number,
      required: true
    }
  }],
  
  // Experience
  experience: {
    teaching: {
      type: Number,
      default: 0 // years
    },
    industry: {
      type: Number,
      default: 0 // years
    },
    research: {
      type: Number,
      default: 0 // years
    }
  },
  
  // Specializations
  specializations: [{
    type: String,
    trim: true
  }],
  
  // Research Interests
  researchInterests: [{
    type: String,
    trim: true
  }],
  
  // Publications
  publications: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    journal: {
      type: String,
      trim: true
    },
    year: {
      type: Number,
      required: true
    },
    url: {
      type: String,
      trim: true
    }
  }],
  
  // Students Under Mentorship
  mentorshipCapacity: {
    type: Number,
    default: 20
  },
  currentMentees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  
  // Permissions and Roles
  permissions: {
    canApproveInternships: {
      type: Boolean,
      default: true
    },
    canViewAllStudents: {
      type: Boolean,
      default: false
    },
    canGenerateReports: {
      type: Boolean,
      default: true
    },
    canManageDepartment: {
      type: Boolean,
      default: false
    }
  },
  
  // Office Information
  officeLocation: {
    building: String,
    room: String,
    floor: String
  },
  officeHours: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    startTime: String,
    endTime: String
  }],
  
  // Statistics
  stats: {
    studentsSupervised: {
      type: Number,
      default: 0
    },
    internshipsApproved: {
      type: Number,
      default: 0
    },
    reportsReviewed: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Indexes
// Note: employeeId already has unique index from schema definition
facultySchema.index({ department: 1 });
facultySchema.index({ 'college.name': 1 });
facultySchema.index({ designation: 1 });

// Virtual for available mentorship slots
facultySchema.virtual('availableMentorshipSlots').get(function() {
  return this.mentorshipCapacity - this.currentMentees.length;
});

// Method to check if faculty can take more mentees
facultySchema.methods.canTakeMoreMentees = function() {
  return this.currentMentees.length < this.mentorshipCapacity;
};

// Method to add mentee
facultySchema.methods.addMentee = function(studentId) {
  if (this.canTakeMoreMentees() && !this.currentMentees.includes(studentId)) {
    this.currentMentees.push(studentId);
    return true;
  }
  return false;
};

// Method to remove mentee
facultySchema.methods.removeMentee = function(studentId) {
  const index = this.currentMentees.indexOf(studentId);
  if (index > -1) {
    this.currentMentees.splice(index, 1);
    return true;
  }
  return false;
};

// Override profile completion calculation for faculty
facultySchema.methods.calculateProfileCompletion = function() {
  const requiredFields = [
    'name', 'email', 'phone', 'employeeId', 'designation', 
    'department', 'college.name'
  ];
  
  const optionalFields = [
    'profilePicture', 'qualifications', 'specializations', 
    'researchInterests', 'officeLocation.building'
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
    } else if ((field === 'qualifications' || field === 'specializations' || field === 'researchInterests') 
               && this[field] && this[field].length > 0) {
      completed++;
    } else if (this[field]) {
      completed++;
    }
  });
  
  this.profileCompletion = Math.round((completed / total) * 100);
  return this.profileCompletion;
};

// Ensure virtual fields are serialized
facultySchema.set('toJSON', { virtuals: true });
facultySchema.set('toObject', { virtuals: true });

const Faculty = User.discriminator('faculty', facultySchema);

export default Faculty;

