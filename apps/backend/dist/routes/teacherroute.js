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
const dotenv_1 = __importDefault(require("dotenv"));
const teacherschema_1 = require("../database/teacherschema");
const courseschema_1 = require("../database/courseschema"); // Import your course model
dotenv_1.default.config();
const teacherrouter = express_1.default.Router();
const SECRET = process.env.JWT_SECRET;
teacherrouter.get('/getuser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.jwt; // Retrieve token from cookies
    if (!token) {
        return res.status(401).json({ msg: 'No token provided',
            type: "teachergetuser"
        });
    }
    try {
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, SECRET);
        const userId = decoded.id;
        // Fetch the teacher from the database
        const teacher = yield teacherschema_1.TeacherModel.findById(userId);
        if (!teacher) {
            return res.status(404).json({ msg: 'Teacher not found' });
        }
        return res.status(200).json({ teacher });
    }
    catch (error) {
        console.error('Error fetching teacher:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ msg: 'Invalid token' });
        }
        return res.status(500).json({ msg: 'Internal server error' });
    }
}));
teacherrouter.get('/getdetails', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.jwt; // Retrieve token from cookies
    if (!token) {
        return res.status(401).json({ msg: 'No token provided',
            type: "teachergetuser"
        });
    }
    try {
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, SECRET);
        const userId = decoded.id;
        // Fetch the teacher from the database
        const teacher = yield teacherschema_1.TeacherModel.findById(userId);
        const courses = yield courseschema_1.CourseModel.find({ instructor: teacher._id }).populate('students');
        // 2. Count total students across all courses (unique if needed)
        let totalStudents = 0;
        courses.forEach(course => {
            totalStudents += course.students.length;
        });
        if (!teacher) {
            return res.status(404).json({ msg: 'Teacher not found' });
        }
        return res.status(200).json({ totalStudents });
    }
    catch (error) {
        console.error('Error fetching teacher:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ msg: 'Invalid token' });
        }
        return res.status(500).json({ msg: 'Internal server error' });
    }
}));
teacherrouter.get('/getteachercourses', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.jwt; // Retrieve token from cookies
    if (!token) {
        return res.status(401).json({ msg: 'No token provided',
            type: "teachergetuser"
        });
    }
    try {
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, SECRET);
        const userId = decoded.id;
        // Fetch the teacher from the database
        const teacher = yield teacherschema_1.TeacherModel.findById(userId);
        const courses = yield courseschema_1.CourseModel.find({ instructor: teacher._id });
        // 2. Count total students across all courses (unique if needed)
        if (!teacher) {
            return res.status(404).json({ msg: 'Teacher not found' });
        }
        return res.status(200).json({ courses });
    }
    catch (error) {
        console.error('Error fetching teacher:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ msg: 'Invalid token' });
        }
        return res.status(500).json({ msg: 'Internal server error' });
    }
}));
teacherrouter.post("/addcourse", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ msg: "No token provided" });
    }
    try {
        // 1. Verify token
        const decoded = jsonwebtoken_1.default.verify(token, SECRET);
        const teacherId = decoded.id;
        // 2. Fetch teacher
        const teacher = yield teacherschema_1.TeacherModel.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ msg: "Teacher not found" });
        }
        // 3. Extract course details from body
        const { title, description, tags, prerequisites, schedule, difficulty, price, isLive, resources, } = req.body;
        // 4. Create and save the new course
        const course = new courseschema_1.CourseModel({
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
            instructorName: teacher.name
        });
        const savedCourse = yield course.save();
        // 5. Add to teacher’s courses list
        teacher.courses = teacher.courses || [];
        teacher.courses.push(savedCourse._id);
        yield teacher.save();
        return res.status(201).json({ msg: "Course created", course: savedCourse });
    }
    catch (error) {
        console.error("Error creating course:", error);
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ msg: "Invalid token" });
        }
        return res.status(500).json({ msg: "Internal server error" });
    }
}));
teacherrouter.get('/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.query; // Retrieve search query from the request query params
    try {
        // Search for teachers by name or email
        const teachers = yield teacherschema_1.TeacherModel.find({
            $or: [
                { name: { $regex: query, $options: 'i' } }, // case-insensitive match for name
                { email: { $regex: query, $options: 'i' } }, // case-insensitive match for email
            ]
        });
        if (!teachers.length) {
            return res.status(404).json({ message: 'No teachers found' });
        }
        return res.status(200).json({ teachers });
    }
    catch (error) {
        console.error('Error searching teachers:', error);
        return res.status(500).json({ message: 'Server error, please try again later' });
    }
}));
// Add other teacher-specific routes here...
exports.default = teacherrouter;
