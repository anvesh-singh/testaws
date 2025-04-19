//@ts-nocheck
import express from 'express';
import jwt from 'jsonwebtoken';
const studentrouter = express.Router();
import { StudentModel } from '../database/studentschema';
import dotenv from 'dotenv';
dotenv.config();
const SECRET = process.env.JWT_SECRET;


studentrouter.get('/getuser', async (req, res) => {
    const token = req.cookies.jwt; // Retrieve token from cookies

    if (!token) {
        return res.status(401).json({ msg: 'No token provided',
            type : "getuser"
        });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, SECRET) as { id: string };
        const userId = decoded.id;

        // Fetch the student from the database
        const student = await StudentModel.findById(userId);

        if (!student) {
            return res.status(404).json({ msg: 'Student not found' });
        }

        return res.status(200).json({ student });
    } catch (error) {
        console.error('Error fetching student:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ msg: 'Invalid token' });
        }
        return res.status(500).json({ msg: 'Internal server error' });
    }
});



studentrouter.get('/isenrolled/:courseId', async (req, res) => {
    const token = req.cookies.jwt;
    const { courseId } = req.params;
  
    if (!token) return res.status(401).json({ msg: 'No token provided',
        type : "isenrolled"
    });
  
    try {
      const decoded = jwt.verify(token, SECRET) as { id: string };
      const userId = decoded.id;
  
      const student = await StudentModel.findById(userId);
  
      if (!student) return res.status(404).json({ msg: 'Student not found' });
  
      const isEnrolled = student.enrolledCourses.includes(courseId);
  
      return res.status(200).json({ enrolled: isEnrolled });
    } catch (error: any) {
      console.error('Error checking enrollment:', error);
      if (error.name === 'JsonWebTokenError')
        return res.status(401).json({ msg: 'Invalid token' });
      return res.status(500).json({ msg: 'Internal server error' });
    }
  });



studentrouter.get('/search', async (req, res) => {
    const { query } = req.query;  // Retrieve search query from the request query params
    try {
        // Search for students by name or email
        const students = await StudentModel.find({
            $or: [
                { name: { $regex: query, $options: 'i' } }, // case-insensitive match for name
                { email: { $regex: query, $options: 'i' } }, // case-insensitive match for email
            ]
        });

        if (!students.length) {
            return res.status(404).json({ message: 'No students found' });
        }

        return res.status(200).json({ students });
    } catch (error) {
        console.error('Error searching students:', error);
        return res.status(500).json({ message: 'Server error, please try again later' });
    }
});




// Enroll in a course (Only students can enroll in courses)
studentrouter.post('/enroll-course/:courseId', async (req, res) => {
    const { courseId } = req.params;
    // Logic to enroll a student in the course
    res.status(200).json({ msg: 'Enrolled in course successfully' });
});




// Add other student-specific routes here...

export default studentrouter;
