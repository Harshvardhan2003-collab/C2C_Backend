import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Basic Information
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['student', 'faculty', 'industry'],
    lowercase: true
  },
  profilePicture: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  
  // Authentication
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values, unique only for non-null
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  
  // Profile Completion
  profileCompletion: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, {
  timestamps: true,
  discriminatorKey: 'role',
  collection: 'users'
});

// Indexes
// Note: email already has unique index from schema definition
userSchema.index({ role: 1 });
// Note: googleId already has sparse index from schema definition

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to calculate profile completion
userSchema.methods.calculateProfileCompletion = function() {
  const fields = ['name', 'email', 'phone', 'profilePicture'];
  let completed = 0;
  
  fields.forEach(field => {
    if (this[field]) completed++;
  });
  
  this.profileCompletion = Math.round((completed / fields.length) * 100);
  return this.profileCompletion;
};

// Virtual for full profile data
userSchema.virtual('profile').get(function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    profilePicture: this.profilePicture,
    phone: this.phone,
    profileCompletion: this.profileCompletion,
    isActive: this.isActive,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt
  };
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', userSchema);

export default User;

