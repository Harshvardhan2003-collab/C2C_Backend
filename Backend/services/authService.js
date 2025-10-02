import { OAuth2Client } from 'google-auth-library';
import { User, Student, Faculty, Industry } from '../models/index.js';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../middlewares/auth.js';
import { sendEmail, emailTemplates } from '../config/email.js';
import { AppError } from '../utils/appError.js';
import { generateToken as generateRandomToken, hashToken } from '../utils/helpers.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class AuthService {
  // Register new user
  async register(userData) {
    const { email, password, name, role } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    // Create user based on role
    let user;
    const baseUserData = {
      email,
      password,
      name,
      role,
      isEmailVerified: false
    };

    switch (role) {
      case 'student':
        user = await Student.create({
          ...baseUserData,
          ...userData.studentData
        });
        break;
      case 'faculty':
        user = await Faculty.create({
          ...baseUserData,
          ...userData.facultyData
        });
        break;
      case 'industry':
        user = await Industry.create({
          ...baseUserData,
          ...userData.industryData
        });
        break;
      default:
        throw new AppError('Invalid user role', 400);
    }

    // Generate email verification token
    const verificationToken = generateRandomToken();
    user.emailVerificationToken = hashToken(verificationToken);
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await user.save();

    // Send welcome email with verification link
    try {
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
      await sendEmail({
        to: user.email,
        ...emailTemplates.welcome(user.name, user.role),
        html: emailTemplates.welcome(user.name, user.role).html + 
              `<p><a href="${verificationUrl}">Click here to verify your email</a></p>`
      });
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }

    // Generate tokens
    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    return {
      user: user.profile,
      accessToken,
      refreshToken
    };
  }

  // Login user
  async login(email, password) {
    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account is deactivated', 401);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    return {
      user: user.profile,
      accessToken,
      refreshToken
    };
  }

  // Google OAuth login
  async googleLogin(googleToken) {
    try {
      // Verify Google token
      const ticket = await googleClient.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      const { email, name, picture, sub: googleId } = payload;

      // Check if user exists
      let user = await User.findOne({ 
        $or: [{ email }, { googleId }] 
      });

      if (user) {
        // Update Google ID if not set
        if (!user.googleId) {
          user.googleId = googleId;
          user.isEmailVerified = true;
          await user.save();
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();
      } else {
        // Infer role from email domain
        const role = this.inferRoleFromEmail(email);
        
        // Create new user
        const baseUserData = {
          email,
          name,
          role,
          googleId,
          profilePicture: picture,
          isEmailVerified: true
        };

        switch (role) {
          case 'student':
            user = await Student.create(baseUserData);
            break;
          case 'faculty':
            user = await Faculty.create(baseUserData);
            break;
          case 'industry':
            user = await Industry.create(baseUserData);
            break;
          default:
            user = await Student.create(baseUserData); // Default to student
        }

        // Send welcome email
        try {
          await sendEmail({
            to: user.email,
            ...emailTemplates.welcome(user.name, user.role)
          });
        } catch (error) {
          console.error('Failed to send welcome email:', error);
        }
      }

      // Generate tokens
      const accessToken = generateToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      return {
        user: user.profile,
        accessToken,
        refreshToken
      };
    } catch (error) {
      throw new AppError('Google authentication failed', 401);
    }
  }

  // Infer user role from email domain
  inferRoleFromEmail(email) {
    const domain = email.split('@')[1]?.toLowerCase() || '';
    
    if (domain.includes('edu') || domain.includes('ac.')) {
      return 'student';
    }
    if (domain.includes('university') || domain.includes('college') || domain.includes('faculty')) {
      return 'faculty';
    }
    if (domain.includes('inc') || domain.includes('llc') || domain.includes('corp') || 
        domain.includes('company') || domain.includes('tech')) {
      return 'industry';
    }
    
    return 'student'; // Default
  }

  // Verify email
  async verifyEmail(token) {
    const hashedToken = hashToken(token);
    
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new AppError('Invalid or expired verification token', 400);
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return { message: 'Email verified successfully' };
  }

  // Forgot password
  async forgotPassword(email) {
    const user = await User.findOne({ email });
    
    if (!user) {
      throw new AppError('No user found with that email address', 404);
    }

    // Generate reset token
    const resetToken = generateRandomToken();
    user.passwordResetToken = hashToken(resetToken);
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Password Reset Request</h2>
            <p>Hi ${user.name},</p>
            <p>You requested a password reset. Click the link below to reset your password:</p>
            <p><a href="${resetUrl}" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
            <p>This link will expire in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <p>Best regards,<br>The C2C Team</p>
          </div>
        `
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      throw new AppError('Failed to send reset email', 500);
    }

    return { message: 'Password reset email sent' };
  }

  // Reset password
  async resetPassword(token, newPassword) {
    const hashedToken = hashToken(token);
    
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return { message: 'Password reset successfully' };
  }

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password');
    
    if (!user || !(await user.comparePassword(currentPassword))) {
      throw new AppError('Current password is incorrect', 400);
    }

    user.password = newPassword;
    await user.save();

    return { message: 'Password changed successfully' };
  }

  // Refresh token
  async refreshToken(refreshToken) {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await User.findById(decoded.userId);
      
      if (!user || !user.isActive) {
        throw new AppError('Invalid refresh token', 401);
      }

      const newAccessToken = generateToken(user._id);
      const newRefreshToken = generateRefreshToken(user._id);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  // Logout (invalidate tokens - in a real app, you'd maintain a blacklist)
  async logout(userId) {
    // In a production app, you might want to maintain a token blacklist
    // For now, we'll just return success
    return { message: 'Logged out successfully' };
  }
}

export default new AuthService();
