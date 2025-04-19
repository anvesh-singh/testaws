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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const teacherschema_1 = require("../database/teacherschema");
const studentschema_1 = require("../database/studentschema");
const courseschema_1 = require("../database/courseschema"); // Import your course model
const db_1 = __importDefault(require("../database/db")); // Import the connectDB function to connect to MongoDB
dotenv_1.default.config();
const mainrouter = express_1.default.Router();
const SECRET = process.env.JWT_SECRET;
const defaultOptions = {
    httpOnly: true,
    sameSite: 'Lax',
};
// Connect to DB before handling routes
(0, db_1.default)();
mainrouter.use(body_parser_1.default.urlencoded({ extended: true }));
mainrouter.use((0, cookie_parser_1.default)());
mainrouter.use(express_1.default.json());
mainrouter.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: 'Email and password are required' });
    }
    try {
        // Check if the user is a teacher or a student
        let user = yield teacherschema_1.TeacherModel.findOne({ email });
        if (!user) {
            user = yield studentschema_1.StudentModel.findOne({ email });
        }
        if (!user) {
            return res.status(404).json({ msg: 'User not found, please signup first' });
        }
        const isValid = yield bcrypt_1.default.compare(password, user.passwordHash);
        if (!isValid) {
            return res.status(401).json({ msg: 'Incorrect password' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, role: user.roles[0] }, SECRET, {
            expiresIn: 1 * 60 * 60 * 24, // Token expiration time in seconds
        });
        res.cookie('jwt', token, defaultOptions);
        return res.status(200).json({ msg: 'Login successful' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
}));
mainrouter.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role } = req.body;
    if (!email || !password || !name || !role) {
        return res.status(400).json({ msg: 'All fields are required' });
    }
    try {
        const existingTeacher = yield teacherschema_1.TeacherModel.findOne({ email: email });
        const existingStudent = yield studentschema_1.StudentModel.findOne({ email: email });
        if (existingTeacher || existingStudent) {
            return res.status(409).json({ msg: 'User already exists' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = {
            name,
            email,
            passwordHash: hashedPassword,
        };
        if (role === 'teacher') {
            const newTeacher = new teacherschema_1.TeacherModel(user);
            yield newTeacher.save();
            const token = jsonwebtoken_1.default.sign({ id: newTeacher._id, email: newTeacher.email, role: 'teacher' }, SECRET, {
                expiresIn: 1 * 60 * 60 * 24,
            });
            res.cookie('jwt', token, defaultOptions);
            return res.status(201).json({ msg: 'Teacher created' });
        }
        else if (role === 'student') {
            const newStudent = new studentschema_1.StudentModel(user);
            yield newStudent.save();
            const token = jsonwebtoken_1.default.sign({ id: newStudent._id, email: newStudent.email, role: 'student' }, SECRET, {
                expiresIn: 1 * 60 * 60 * 24,
            });
            res.cookie('jwt', token, defaultOptions);
            return res.status(201).json({ msg: 'Student created' });
        }
        else {
            return res.status(400).json({ msg: 'Invalid role provided' });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Error creating user' });
    }
}));
mainrouter.get('/getcourses', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all courses from the database
        const courses = yield courseschema_1.CourseModel.find();
        if (!courses || courses.length === 0) {
            return res.status(404).json({ msg: 'No courses found' });
        }
        return res.status(200).json({ courses });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
}));
mainrouter.get('/getcourse/:courseId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    if (!courseId) {
        return res.status(400).json({ msg: 'Course ID is required' });
    }
    try {
        // Fetch the course from the database
        const course = yield courseschema_1.CourseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }
        return res.status(200).json({ course });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
}));
//mainrouter.use('/', checkRole());
exports.default = mainrouter;
