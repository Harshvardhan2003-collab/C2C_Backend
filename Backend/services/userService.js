import { User, Student, Faculty, Industry } from '../models/index.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { AppError } from '../utils/appError.js';
import { generatePaginationMeta, cleanObject, extractCloudinaryPublicId, getUploadConfig } from '../utils/helpers.js';

class UserService {
  // Get user profile
  async getUserProfile(userId) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Get role-specific data
    let roleSpecificUser;
    switch (user.role) {
      case 'student':
        roleSpecificUser = await Student.findById(userId)
          .populate('facultyMentor', 'name email designation department');
        break;
      case 'faculty':
        roleSpecificUser = await Faculty.findById(userId)
          .populate('currentMentees', 'name email studentId department semester');
        break;
      case 'industry':
        roleSpecificUser = await Industry.findById(userId);
        break;
      default:
        roleSpecificUser = user;
    }

    return roleSpecificUser;
  }

  // Update user profile
  async updateUserProfile(userId, updateData, files = {}) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Handle file uploads
    if (files.profilePicture) {
      try {
        // Delete old profile picture if exists
        if (user.profilePicture) {
          const publicId = extractCloudinaryPublicId(user.profilePicture);
          if (publicId) {
            await deleteFromCloudinary(publicId);
          }
        }

        // Upload new profile picture using buffer
        const uploadConfig = getUploadConfig('profilePicture', user._id);
        const result = await uploadToCloudinary(
          files.profilePicture.buffer, 
          uploadConfig.folder,
          uploadConfig
        );
        updateData.profilePicture = result.secure_url;
      } catch (error) {
        console.error('Profile picture upload error:', error);
        throw new AppError('Failed to upload profile picture', 500);
      }
    }

    // Clean update data
    const cleanedData = cleanObject(updateData);

    // Update based on role
    let updatedUser;
    switch (user.role) {
      case 'student':
        updatedUser = await Student.findByIdAndUpdate(
          userId, 
          cleanedData, 
          { new: true, runValidators: true }
        );
        break;
      case 'faculty':
        updatedUser = await Faculty.findByIdAndUpdate(
          userId, 
          cleanedData, 
          { new: true, runValidators: true }
        );
        break;
      case 'industry':
        updatedUser = await Industry.findByIdAndUpdate(
          userId, 
          cleanedData, 
          { new: true, runValidators: true }
        );
        break;
      default:
        updatedUser = await User.findByIdAndUpdate(
          userId, 
          cleanedData, 
          { new: true, runValidators: true }
        );
    }

    // Recalculate profile completion
    updatedUser.calculateProfileCompletion();
    await updatedUser.save();

    return updatedUser;
  }

  // Get all users (admin/faculty only)
  async getAllUsers(filters = {}, pagination = {}, sort = {}) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    
    if (filters.role) {
      query.role = filters.role;
    }
    
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }
    
    if (filters.isEmailVerified !== undefined) {
      query.isEmailVerified = filters.isEmailVerified;
    }
    
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } }
      ];
    }

    // Execute query
    const users = await User.find(query)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments(query);
    const paginationMeta = generatePaginationMeta(totalUsers, page, limit);

    return {
      users,
      pagination: paginationMeta
    };
  }

  // Get users by role
  async getUsersByRole(role, filters = {}, pagination = {}, sort = {}) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    let Model;
    switch (role) {
      case 'student':
        Model = Student;
        break;
      case 'faculty':
        Model = Faculty;
        break;
      case 'industry':
        Model = Industry;
        break;
      default:
        throw new AppError('Invalid role specified', 400);
    }

    // Build query
    const query = { ...filters };
    
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } }
      ];
      delete query.search;
    }

    // Execute query with role-specific population
    let queryBuilder = Model.find(query)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Add role-specific population
    if (role === 'student') {
      queryBuilder = queryBuilder.populate('facultyMentor', 'name email designation');
    } else if (role === 'faculty') {
      queryBuilder = queryBuilder.populate('currentMentees', 'name email studentId');
    }

    const users = await queryBuilder;
    const totalUsers = await Model.countDocuments(query);
    const paginationMeta = generatePaginationMeta(totalUsers, page, limit);

    return {
      users,
      pagination: paginationMeta
    };
  }

  // Deactivate user account
  async deactivateUser(userId) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.isActive = false;
    await user.save();

    return { message: 'User account deactivated successfully' };
  }

  // Activate user account
  async activateUser(userId) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.isActive = true;
    await user.save();

    return { message: 'User account activated successfully' };
  }

  // Delete user account
  async deleteUser(userId) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Delete profile picture from cloudinary if exists
    if (user.profilePicture) {
      try {
        const publicId = extractCloudinaryPublicId(user.profilePicture);
        if (publicId) {
          await deleteFromCloudinary(publicId);
        }
      } catch (error) {
        console.error('Failed to delete profile picture:', error);
      }
    }

    await User.findByIdAndDelete(userId);

    return { message: 'User account deleted successfully' };
  }

  // Get user statistics
  async getUserStatistics() {
    const stats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
          active: { $sum: { $cond: ['$isActive', 1, 0] } },
          verified: { $sum: { $cond: ['$isEmailVerified', 1, 0] } }
        }
      }
    ]);

    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const verifiedUsers = await User.countDocuments({ isEmailVerified: true });

    return {
      total: totalUsers,
      active: activeUsers,
      verified: verifiedUsers,
      byRole: stats.reduce((acc, stat) => {
        acc[stat._id] = {
          total: stat.count,
          active: stat.active,
          verified: stat.verified
        };
        return acc;
      }, {})
    };
  }

  // Search users
  async searchUsers(searchQuery, filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const query = {
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } }
      ],
      ...filters
    };

    const users = await User.find(query)
      .select('-password')
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments(query);
    const paginationMeta = generatePaginationMeta(totalUsers, page, limit);

    return {
      users,
      pagination: paginationMeta
    };
  }

  // Update user role (admin only)
  async updateUserRole(userId, newRole) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.role === newRole) {
      throw new AppError('User already has this role', 400);
    }

    // This is a complex operation that would require data migration
    // For now, we'll just update the role field
    user.role = newRole;
    await user.save();

    return { message: 'User role updated successfully' };
  }

  // Bulk operations
  async bulkUpdateUsers(userIds, updateData) {
    const result = await User.updateMany(
      { _id: { $in: userIds } },
      updateData,
      { runValidators: true }
    );

    return {
      message: 'Bulk update completed',
      modifiedCount: result.modifiedCount
    };
  }

  async bulkDeleteUsers(userIds) {
    const result = await User.deleteMany({ _id: { $in: userIds } });

    return {
      message: 'Bulk delete completed',
      deletedCount: result.deletedCount
    };
  }
}

export default new UserService();
