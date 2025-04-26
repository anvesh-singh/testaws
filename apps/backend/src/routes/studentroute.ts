//@ts-nocheck
import express from 'express';
import jwt from 'jsonwebtoken';
const studentrouter = express.Router();
import { StudentModel } from '../database/studentschema';
import dotenv from 'dotenv';
import { CourseModel } from '../database/courseschema';
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
  
    if (!token) return res.status(401).json({ msg: 'No token provided' });
  
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


  studentrouter.post('/join-course', async (req, res) => {
    const token = req.cookies.jwt;
    const { courseId } = req.body;
  
    if (!token) return res.status(401).json({ msg: 'No token provided' });
    if (!courseId) return res.status(400).json({ msg: 'Course ID required' });
  
    try {
      const decoded = jwt.verify(token, SECRET) as { id: string };
      const studentId = decoded.id;
  
      const student = await StudentModel.findById(studentId);
      const course = await CourseModel.findById(courseId);
  
      if (!student) return res.status(404).json({ msg: 'Student not found' });
      if (!course) return res.status(404).json({ msg: 'Course not found' });
  
      if (student.enrolledCourses.includes(courseId)) {
        return res.status(400).json({ msg: 'Already enrolled in this course' });
      }
  
      student.enrolledCourses.push(courseId);
      await student.save();
  
      if (!course.students.includes(studentId)) {
        course.students.push(studentId);
        await course.save();
      }
  
      return res.status(200).json({ msg: 'Enrolled successfully' });
    } catch (error: any) {
      console.error('Error joining course:', error);
      if (error.name === 'JsonWebTokenError')
        return res.status(401).json({ msg: 'Invalid token' });
      return res.status(500).json({ msg: 'Internal server error' });
    }
  });

  studentrouter.post('/leave-course', async (req, res) => {
    const token = req.cookies.jwt;
    const { courseId } = req.body;
  
    if (!token) return res.status(401).json({ msg: 'No token provided' });
    if (!courseId) return res.status(400).json({ msg: 'Course ID required' });
  
    try {
      const decoded = jwt.verify(token, SECRET) as { id: string };
      const studentId = decoded.id;
  
      const student = await StudentModel.findById(studentId);
      const course = await CourseModel.findById(courseId);
  
      if (!student) return res.status(404).json({ msg: 'Student not found' });
      if (!course) return res.status(404).json({ msg: 'Course not found' });
  
      // Check if student is enrolled
      if (!student.enrolledCourses.includes(courseId)) {
        return res.status(400).json({ msg: 'Not enrolled in this course' });
      }
  
      // Remove course from student's enrolledCourses
      student.enrolledCourses = student.enrolledCourses.filter(
        id => id.toString() !== courseId
      );
      await student.save();
  
      // Remove student from course's students list
      course.students = course.students.filter(
        id => id.toString() !== studentId
      );
      await course.save();
  
      return res.status(200).json({ msg: 'Left course successfully' });
    } catch (error: any) {
      console.error('Error leaving course:', error);
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



// Add other student-specific routes here...

export default studentrouter;
