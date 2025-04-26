//@ts-nocheck
import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { TeacherModel } from '../database/teacherschema';
import { StudentModel } from '../database/studentschema';
import { CourseModel } from '../database/courseschema'; // Import your course model
dotenv.config();

const teacherrouter = express.Router();
const SECRET=process.env.JWT_SECRET;
teacherrouter.get('/getuser', async (req, res) => {
    const token = req.cookies.jwt; // Retrieve token from cookies

    if (!token) {
        return res.status(401).json({ msg: 'No token provided',
            type : "teachergetuser"
         });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, SECRET) as { id: string };
        const userId = decoded.id;

        // Fetch the teacher from the database
        const teacher = await TeacherModel.findById(userId);

        if (!teacher) {
            return res.status(404).json({ msg: 'Teacher not found' });
        }

        return res.status(200).json({ teacher });
    } catch (error) {
        console.error('Error fetching teacher:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ msg: 'Invalid token' });
        }
        return res.status(500).json({ msg: 'Internal server error' });
    }
});


teacherrouter.get('/getdetails', async (req, res) => {
  const token = req.cookies.jwt; // Retrieve token from cookies

  if (!token) {
      return res.status(401).json({ msg: 'No token provided',
          type : "teachergetuser"
       });
  }

  try {
      // Verify the token
      const decoded = jwt.verify(token, SECRET) as { id: string };
      const userId = decoded.id;

      // Fetch the teacher from the database
      const teacher = await TeacherModel.findById(userId);
      const courses = await CourseModel.find({ instructor: teacher._id }).populate('students');

    // 2. Count total students across all courses (unique if needed)
    let totalStudents = 0;
    courses.forEach(course => {
      totalStudents += course.students.length;
    });

      if (!teacher) {
          return res.status(404).json({ msg: 'Teacher not found' });
      }

      return res.status(200).json({ totalStudents });
  } catch (error) {
      console.error('Error fetching teacher:', error);
      if (error.name === 'JsonWebTokenError') {
          return res.status(401).json({ msg: 'Invalid token' });
      }
      return res.status(500).json({ msg: 'Internal server error' });
  }
});



teacherrouter.get('/getteachercourses', async (req, res) => {
  const token = req.cookies.jwt; // Retrieve token from cookies
  if (!token) {
      return res.status(401).json({ msg: 'No token provided',
          type : "teachergetuser"
       });
  }

  try {
      // Verify the token
      const decoded = jwt.verify(token, SECRET) as { id: string };
      const userId = decoded.id;
      // Fetch the teacher from the database
      const teacher = await TeacherModel.findById(userId);
      const courses = await CourseModel.find({ instructor: teacher._id });
    // 2. Count total students across all courses (unique if needed)

      if (!teacher) {
          return res.status(404).json({ msg: 'Teacher not found' });
      }

      return res.status(200).json({ courses });
  } catch (error) {
      console.error('Error fetching teacher:', error);
      if (error.name === 'JsonWebTokenError') {
          return res.status(401).json({ msg: 'Invalid token' });
      }
      return res.status(500).json({ msg: 'Internal server error' });
  }
});


teacherrouter.post("/addcourse", async (req, res) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ msg: "No token provided" });
  }

  try {
    // 1. Verify token
    const decoded = jwt.verify(token, SECRET) as { id: string };
    const teacherId = decoded.id;

    // 2. Fetch teacher
    const teacher = await TeacherModel.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ msg: "Teacher not found" });
    }

    // 3. Extract course details from body
    const {
      title,
      description,
      tags,
      prerequisites,
      schedule,
      difficulty,
      price,
      isLive,
      resources,
    } = req.body;

    // 4. Create and save the new course
    const course = new CourseModel({
      title,
      description,
      tags,
      prerequisites,
      schedule,
      difficulty,
      price,
      isLive,
      resources,
      instructor: teacherId,
      instructorName:teacher.name
    });

    const savedCourse = await course.save();

    // 5. Add to teacher’s courses list
    teacher.courses = teacher.courses || [];
    teacher.courses.push(savedCourse._id);
    await teacher.save();

    return res.status(201).json({ msg: "Course created", course: savedCourse });
  } catch (error: any) {
    console.error("Error creating course:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ msg: "Invalid token" });
    }
    return res.status(500).json({ msg: "Internal server error" });
  }
});
  


teacherrouter.get('/search', async (req, res) => {
    const { query } = req.query;  // Retrieve search query from the request query params
    try {
        // Search for teachers by name or email
        const teachers = await TeacherModel.find({
            $or: [
                { name: { $regex: query, $options: 'i' } }, // case-insensitive match for name
                { email: { $regex: query, $options: 'i' } }, // case-insensitive match for email
            ]
        });

        if (!teachers.length) {
            return res.status(404).json({ message: 'No teachers found' });
        }

        return res.status(200).json({ teachers });
    } catch (error) {
        console.error('Error searching teachers:', error);
        return res.status(500).json({ message: 'Server error, please try again later' });
    }
});


// Add other teacher-specific routes here...

export default teacherrouter;
