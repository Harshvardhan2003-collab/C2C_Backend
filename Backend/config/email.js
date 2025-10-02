import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send email function
export const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

// Email templates
export const emailTemplates = {
  welcome: (name, role) => ({
    subject: 'Welcome to C2C Platform!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to C2C Platform!</h2>
        <p>Hi ${name},</p>
        <p>Welcome to the Campus-to-Corporate platform! Your ${role} account has been successfully created.</p>
        <p>You can now:</p>
        <ul>
          ${role === 'student' ? `
            <li>Browse and apply for internships</li>
            <li>Track your application status</li>
            <li>Complete skill assessments</li>
          ` : role === 'faculty' ? `
            <li>Monitor student progress</li>
            <li>Approve internship applications</li>
            <li>Generate reports</li>
          ` : `
            <li>Post internship opportunities</li>
            <li>Review candidate applications</li>
            <li>Manage your company profile</li>
          `}
        </ul>
        <p>Get started by logging into your dashboard.</p>
        <p>Best regards,<br>The C2C Team</p>
      </div>
    `
  }),

  applicationSubmitted: (studentName, internshipTitle, companyName) => ({
    subject: 'Application Submitted Successfully',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Application Submitted!</h2>
        <p>Hi ${studentName},</p>
        <p>Your application for <strong>${internshipTitle}</strong> at <strong>${companyName}</strong> has been submitted successfully.</p>
        <p>You will receive updates on your application status via email.</p>
        <p>Best regards,<br>The C2C Team</p>
      </div>
    `
  }),

  applicationStatusUpdate: (studentName, internshipTitle, status) => ({
    subject: `Application Status Update: ${status}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Application Status Update</h2>
        <p>Hi ${studentName},</p>
        <p>Your application for <strong>${internshipTitle}</strong> has been updated to: <strong style="color: ${status === 'Selected' ? '#10b981' : status === 'Rejected' ? '#ef4444' : '#f59e0b'}">${status}</strong></p>
        ${status === 'Selected' ? '<p>Congratulations! Please check your dashboard for next steps.</p>' : ''}
        <p>Best regards,<br>The C2C Team</p>
      </div>
    `
  })
};

export default { sendEmail, emailTemplates };

