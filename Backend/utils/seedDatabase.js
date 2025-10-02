import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import { Student, Faculty, Industry, Internship } from '../models/index.js';
import { generateStudentId, generateEmployeeId, getCurrentAcademicYear } from './helpers.js';

dotenv.config();

// Sample data for seeding
const sampleStudents = [
  {
    name: 'John Doe',
    email: 'john.doe@student.edu',
    role: 'student',
    studentId: 'MIT2301001',
    college: {
      name: 'MIT College of Engineering',
      address: 'Pune, Maharashtra',
      website: 'https://mitcoe.edu.in'
    },
    department: 'Computer Science',
    course: 'B.Tech Computer Science',
    semester: 6,
    academicYear: getCurrentAcademicYear(),
    cgpa: 8.5,
    dateOfBirth: new Date('2002-05-15'),
    gender: 'male',
    phone: '+919876543210',
    skills: [
      { name: 'JavaScript', level: 'intermediate' },
      { name: 'React', level: 'intermediate' },
      { name: 'Node.js', level: 'beginner' }
    ],
    internshipPreferences: {
      domains: ['Web Development', 'Software Development'],
      locations: ['Pune', 'Mumbai', 'Bangalore'],
      workType: 'hybrid',
      duration: { min: 3, max: 6 }
    }
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@student.edu',
    role: 'student',
    studentId: 'MIT2301002',
    college: {
      name: 'MIT College of Engineering',
      address: 'Pune, Maharashtra',
      website: 'https://mitcoe.edu.in'
    },
    department: 'Information Technology',
    course: 'B.Tech Information Technology',
    semester: 6,
    academicYear: getCurrentAcademicYear(),
    cgpa: 9.2,
    dateOfBirth: new Date('2002-08-22'),
    gender: 'female',
    phone: '+919876543211',
    skills: [
      { name: 'Python', level: 'advanced' },
      { name: 'Machine Learning', level: 'intermediate' },
      { name: 'Data Analysis', level: 'intermediate' }
    ],
    internshipPreferences: {
      domains: ['Data Science', 'Machine Learning', 'AI'],
      locations: ['Pune', 'Hyderabad', 'Chennai'],
      workType: 'remote',
      duration: { min: 4, max: 6 }
    }
  }
];

const sampleFaculty = [
  {
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@faculty.edu',
    role: 'faculty',
    employeeId: 'FACCS0001',
    designation: 'Professor',
    department: 'Computer Science',
    college: {
      name: 'MIT College of Engineering',
      address: 'Pune, Maharashtra',
      website: 'https://mitcoe.edu.in'
    },
    phone: '+919876543220',
    qualifications: [
      {
        degree: 'Ph.D',
        field: 'Computer Science',
        institution: 'IIT Bombay',
        year: 2010
      },
      {
        degree: 'M.Tech',
        field: 'Computer Science',
        institution: 'IIT Delhi',
        year: 2005
      }
    ],
    experience: {
      teaching: 15,
      industry: 5,
      research: 12
    },
    specializations: ['Machine Learning', 'Data Structures', 'Algorithms'],
    mentorshipCapacity: 25,
    permissions: {
      canApproveInternships: true,
      canViewAllStudents: true,
      canGenerateReports: true,
      canManageDepartment: false
    }
  },
  {
    name: 'Prof. Priya Sharma',
    email: 'priya.sharma@faculty.edu',
    role: 'faculty',
    employeeId: 'FACIT0001',
    designation: 'Associate Professor',
    department: 'Information Technology',
    college: {
      name: 'MIT College of Engineering',
      address: 'Pune, Maharashtra',
      website: 'https://mitcoe.edu.in'
    },
    phone: '+919876543221',
    qualifications: [
      {
        degree: 'Ph.D',
        field: 'Information Technology',
        institution: 'Pune University',
        year: 2015
      }
    ],
    experience: {
      teaching: 10,
      industry: 3,
      research: 8
    },
    specializations: ['Database Systems', 'Web Technologies', 'Software Engineering'],
    mentorshipCapacity: 20,
    permissions: {
      canApproveInternships: true,
      canViewAllStudents: false,
      canGenerateReports: true,
      canManageDepartment: false
    }
  }
];

const sampleIndustry = [
  {
    name: 'Amit Patel',
    email: 'amit.patel@techcorp.com',
    role: 'industry',
    designation: 'HR Manager',
    department: 'Human Resources',
    phone: '+919876543230',
    company: {
      name: 'TechCorp Solutions',
      description: 'Leading software development company specializing in web and mobile applications.',
      website: 'https://techcorp.com',
      industry: 'Information Technology',
      size: 'medium',
      founded: 2015
    },
    headquarters: {
      street: '123 Tech Park',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      pincode: '411001'
    },
    verification: {
      isVerified: true,
      verifiedAt: new Date()
    },
    internshipProgram: {
      isActive: true,
      domains: ['Web Development', 'Mobile Development', 'Software Testing'],
      maxInterns: 15,
      preferredDuration: { min: 3, max: 6 },
      stipendRange: { min: 15000, max: 25000, currency: 'INR' }
    },
    subscription: {
      plan: 'premium',
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      isActive: true
    }
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@dataanalytics.com',
    role: 'industry',
    designation: 'Talent Acquisition Lead',
    department: 'Talent Acquisition',
    phone: '+919876543231',
    company: {
      name: 'Analytics Pro',
      description: 'Data analytics and business intelligence solutions provider.',
      website: 'https://analyticspro.com',
      industry: 'Data Analytics',
      size: 'large',
      founded: 2012
    },
    headquarters: {
      street: '456 Business District',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      pincode: '400001'
    },
    verification: {
      isVerified: true,
      verifiedAt: new Date()
    },
    internshipProgram: {
      isActive: true,
      domains: ['Data Science', 'Business Analytics', 'Machine Learning'],
      maxInterns: 20,
      preferredDuration: { min: 4, max: 6 },
      stipendRange: { min: 20000, max: 35000, currency: 'INR' }
    },
    subscription: {
      plan: 'enterprise',
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      isActive: true
    }
  }
];

const sampleInternships = [
  {
    title: 'Frontend Developer Intern',
    description: 'Work on exciting web applications using React, TypeScript, and modern web technologies. You will be part of our development team and contribute to real-world projects.',
    department: 'Engineering',
    domain: 'Web Development',
    type: 'hybrid',
    duration: { months: 3, isFlexible: true },
    startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 120 days from now
    applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    location: {
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      address: '123 Tech Park, Pune'
    },
    requirements: {
      education: {
        minimumQualification: 'B.Tech/B.E. in Computer Science or related field',
        preferredCourses: ['Computer Science', 'Information Technology'],
        minimumCGPA: 7.0
      },
      skills: {
        required: [
          { name: 'JavaScript', level: 'intermediate' },
          { name: 'React', level: 'beginner' },
          { name: 'HTML/CSS', level: 'intermediate' }
        ],
        preferred: [
          { name: 'TypeScript', level: 'beginner' },
          { name: 'Node.js', level: 'beginner' }
        ]
      }
    },
    stipend: {
      amount: 20000,
      currency: 'INR',
      frequency: 'monthly',
      isPaid: true,
      additionalBenefits: ['Learning opportunities', 'Mentorship', 'Certificate']
    },
    status: 'active',
    approval: {
      status: 'approved',
      approvedAt: new Date()
    },
    tags: ['frontend', 'react', 'javascript', 'web-development']
  },
  {
    title: 'Data Science Intern',
    description: 'Join our data science team to work on machine learning projects, data analysis, and business intelligence solutions. Great opportunity to work with real datasets.',
    department: 'Data Science',
    domain: 'Data Science',
    type: 'remote',
    duration: { months: 6, isFlexible: false },
    startDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 225 * 24 * 60 * 60 * 1000),
    applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    location: {
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      isRemoteAllowed: true
    },
    requirements: {
      education: {
        minimumQualification: 'B.Tech/B.E. in Computer Science, IT, or related field',
        preferredCourses: ['Computer Science', 'Information Technology', 'Mathematics'],
        minimumCGPA: 8.0
      },
      skills: {
        required: [
          { name: 'Python', level: 'intermediate' },
          { name: 'Statistics', level: 'intermediate' },
          { name: 'SQL', level: 'beginner' }
        ],
        preferred: [
          { name: 'Machine Learning', level: 'beginner' },
          { name: 'Pandas', level: 'beginner' },
          { name: 'Numpy', level: 'beginner' }
        ]
      }
    },
    stipend: {
      amount: 30000,
      currency: 'INR',
      frequency: 'monthly',
      isPaid: true,
      additionalBenefits: ['Remote work', 'Flexible hours', 'Learning resources']
    },
    status: 'active',
    approval: {
      status: 'approved',
      approvedAt: new Date()
    },
    tags: ['data-science', 'python', 'machine-learning', 'analytics']
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to database
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Student.deleteMany({});
    await Faculty.deleteMany({});
    await Industry.deleteMany({});
    await Internship.deleteMany({});

    // Create students
    console.log('👨‍🎓 Creating sample students...');
    const createdStudents = await Student.create(sampleStudents);
    console.log(`✅ Created ${createdStudents.length} students`);

    // Create faculty
    console.log('👨‍🏫 Creating sample faculty...');
    const createdFaculty = await Faculty.create(sampleFaculty);
    console.log(`✅ Created ${createdFaculty.length} faculty members`);

    // Create industry users
    console.log('🏢 Creating sample industry users...');
    const createdIndustry = await Industry.create(sampleIndustry);
    console.log(`✅ Created ${createdIndustry.length} industry users`);

    // Create internships
    console.log('💼 Creating sample internships...');
    const internshipsWithCompany = sampleInternships.map((internship, index) => ({
      ...internship,
      company: createdIndustry[index % createdIndustry.length]._id,
      createdBy: createdIndustry[index % createdIndustry.length]._id,
      approval: {
        ...internship.approval,
        approvedBy: createdFaculty[0]._id
      }
    }));
    
    const createdInternships = await Internship.create(internshipsWithCompany);
    console.log(`✅ Created ${createdInternships.length} internships`);

    // Assign mentors to students
    console.log('🤝 Assigning mentors to students...');
    for (let i = 0; i < createdStudents.length; i++) {
      const student = createdStudents[i];
      const faculty = createdFaculty[i % createdFaculty.length];
      
      student.facultyMentor = faculty._id;
      await student.save();
      
      faculty.currentMentees.push(student._id);
      await faculty.save();
    }
    console.log('✅ Mentors assigned successfully');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`Students: ${createdStudents.length}`);
    console.log(`Faculty: ${createdFaculty.length}`);
    console.log(`Industry Users: ${createdIndustry.length}`);
    console.log(`Internships: ${createdInternships.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  seedDatabase();
}

export default seedDatabase;

