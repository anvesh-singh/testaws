"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const studentrouter = express_1.default.Router();
const studentschema_1 = require("../database/studentschema");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET = process.env.JWT_SECRET;
studentrouter.get('/getuser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.jwt; // Retrieve token from cookies
    if (!token) {
        return res.status(401).json({ msg: 'No token provided',
            type: "getuser"
        });
    }
    try {
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, SECRET);
        const userId = decoded.id;
        // Fetch the student from the database
        const student = yield studentschema_1.StudentModel.findById(userId);
        if (!student) {
            return res.status(404).json({ msg: 'Student not found' });
        }
        return res.status(200).json({ student });
    }
    catch (error) {
        console.error('Error fetching student:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ msg: 'Invalid token' });
        }
        return res.status(500).json({ msg: 'Internal server error' });
    }
}));
studentrouter.get('/isenrolled/:courseId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.jwt;
    const { courseId } = req.params;
    if (!token)
        return res.status(401).json({ msg: 'No token provided',
            type: "isenrolled"
        });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET);
        const userId = decoded.id;
        const student = yield studentschema_1.StudentModel.findById(userId);
        if (!student)
            return res.status(404).json({ msg: 'Student not found' });
        const isEnrolled = student.enrolledCourses.includes(courseId);
        return res.status(200).json({ enrolled: isEnrolled });
    }
    catch (error) {
        console.error('Error checking enrollment:', error);
        if (error.name === 'JsonWebTokenError')
            return res.status(401).json({ msg: 'Invalid token' });
        return res.status(500).json({ msg: 'Internal server error' });
    }
}));
studentrouter.get('/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.query; // Retrieve search query from the request query params
    try {
        // Search for students by name or email
        const students = yield studentschema_1.StudentModel.find({
            $or: [
                { name: { $regex: query, $options: 'i' } }, // case-insensitive match for name
                { email: { $regex: query, $options: 'i' } }, // case-insensitive match for email
            ]
        });
        if (!students.length) {
            return res.status(404).json({ message: 'No students found' });
        }
        return res.status(200).json({ students });
    }
    catch (error) {
        console.error('Error searching students:', error);
        return res.status(500).json({ message: 'Server error, please try again later' });
    }
}));
// Enroll in a course (Only students can enroll in courses)
studentrouter.post('/enroll-course/:courseId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    // Logic to enroll a student in the course
    res.status(200).json({ msg: 'Enrolled in course successfully' });
}));
// Add other student-specific routes here...
exports.default = studentrouter;
