//@ts-nocheck
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { TeacherModel } from '../database/teacherschema';
import { StudentModel } from '../database/studentschema';
import { CourseModel } from '../database/courseschema'; // Import your course model
import connectDB from '../database/db'; // Import the connectDB function to connect to MongoDB
import { runSeeds } from '../database/seed';
import { checkRole } from '../middlewares/rolemiddleware';
dotenv.config();


const mainrouter = express.Router();
const SECRET = process.env.JWT_SECRET;
const defaultOptions = {
  httpOnly: false,
  sameSite: 'lax',
};

// Connect to DB before handling routes
connectDB();

mainrouter.use(bodyParser.urlencoded({ extended: true }));
mainrouter.use(cookieParser());

mainrouter.use(express.json());


mainrouter.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Email and password are required' });
  }

  try {
    // Check if the user is a teacher or a student
    let user = await TeacherModel.findOne({ email });
    if (!user) {
      user = await StudentModel.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ msg: 'User not found, please signup first' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return res.status(401).json({ msg: 'Incorrect password' });
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, SECRET, {
      expiresIn: 1 * 60 * 60 * 24, // Token expiration time in seconds
    });

    res.cookie('jwt', token, defaultOptions);
    return res.status(200).json({ msg: 'Login successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
});




mainrouter.post('/signup', async (req: Request, res: Response) => {
  const { name, email, password, role, skills, interests }: SignupRequestBody = req.body;

  // Validate required fields
  if (!email || !password || !name || !role) {
    return res.status(400).json({ 
      success: false,
      message: 'All fields are required',
      requiredFields: ['name', 'email', 'password', 'role']
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false,
      message: 'Invalid email format'
    });
  }

  // Validate password strength
  if (password.length < 8) {
    return res.status(400).json({ 
      success: false,
      message: 'Password must be at least 8 characters long'
    });
  }

  // Validate role
  if (!['teacher', 'student'].includes(role)) {
    return res.status(400).json({ 
      success: false,
      message: 'Invalid role provided',
      validRoles: ['teacher', 'student']
    });
  }

  try {
    // Check for existing user in both collections
    const [existingTeacher, existingStudent] = await Promise.all([
      TeacherModel.findOne({ email }),
      StudentModel.findOne({ email })
    ]);

    if (existingTeacher || existingStudent) {
      return res.status(409).json({ 
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      name,
      email,
      passwordHash: hashedPassword,
      role,
      ...(skills && { skills }),
      ...(interests && { interests })
    };

    let newUser;
    let userRole: UserRole;

    if (role === 'teacher') {
      newUser = await TeacherModel.create(userData);
      userRole = 'teacher';
    } else {
      newUser = await StudentModel.create(userData);
      userRole = 'student';
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        id: newUser._id, 
        email: newUser.email, 
        role: userRole 
      }, 
      SECRET, 
      { expiresIn: '24h' }
    );

    // Set cookie
    res.cookie('jwt', token, defaultOptions);

    // Return success response (excluding sensitive data)
    return res.status(201).json({ 
      success: true,
      message: `${userRole} account created successfully`,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: userRole
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle specific errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        error: error.message 
      });
    }

    return res.status(500).json({ 
      success: false,
      message: 'Internal server error during signup'
    });
  }
});



mainrouter.get('/getcourses', async (req, res) => {
  try {
    // Fetch all courses from the database
    const courses = await CourseModel.find();

    if (!courses || courses.length === 0) {
      return res.status(404).json({ msg: 'No courses found' });
    }

    return res.status(200).json({ courses });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
});

mainrouter.get('/getcourse/:courseId', async (req, res) => {
  const { courseId } = req.params;

  if (!courseId) {
    return res.status(400).json({ msg: 'Course ID is required' });
  }

  try {
    // Fetch the course from the database
    const course = await CourseModel.findById(courseId);

    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    return res.status(200).json({ course });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
});


mainrouter.use('/', checkRole());


export default mainrouter;
