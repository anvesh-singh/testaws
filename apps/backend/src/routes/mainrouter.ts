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
  httpOnly: true,
  sameSite: 'Lax',
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

    const token = jwt.sign({ id: user._id, email: user.email, role: user.roles[0] }, SECRET, {
      expiresIn: 1 * 60 * 60 * 24, // Token expiration time in seconds
    });

    res.cookie('jwt', token, defaultOptions);
    return res.status(200).json({ msg: 'Login successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
});

mainrouter.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!email || !password || !name || !role) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  try {
    const existingTeacher = await TeacherModel.findOne({ email: email });
    const existingStudent = await StudentModel.findOne({ email: email });

    if (existingTeacher || existingStudent) {
      return res.status(409).json({ msg: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      name,
      email,
      passwordHash: hashedPassword,
    };

    if (role === 'teacher') {
      const newTeacher = new TeacherModel(user);
      await newTeacher.save();

      const token = jwt.sign({ id: newTeacher._id, email: newTeacher.email, role: 'teacher' }, SECRET, {
        expiresIn: 1 * 60 * 60 * 24,
      });

      res.cookie('jwt', token, defaultOptions);
      return res.status(201).json({ msg: 'Teacher created' });
    } else if (role === 'student') {
      const newStudent = new StudentModel(user);
      await newStudent.save();

      const token = jwt.sign({ id: newStudent._id, email: newStudent.email, role: 'student' }, SECRET, {
        expiresIn: 1 * 60 * 60 * 24,
      });

      res.cookie('jwt', token, defaultOptions);
      return res.status(201).json({ msg: 'Student created' });
    } else {
      return res.status(400).json({ msg: 'Invalid role provided' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Error creating user' });
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


//mainrouter.use('/', checkRole());


export default mainrouter;
