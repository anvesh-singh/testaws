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
const rolemiddleware_1 = require("../middlewares/rolemiddleware");
dotenv_1.default.config();
const mainrouter = express_1.default.Router();
const SECRET = process.env.JWT_SECRET;
const defaultOptions = {
    httpOnly: false,
    sameSite: 'lax',
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
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, role: user.role }, SECRET, {
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
    const { name, email, password, role, skills, interests } = req.body;
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
        const [existingTeacher, existingStudent] = yield Promise.all([
            teacherschema_1.TeacherModel.findOne({ email }),
            studentschema_1.StudentModel.findOne({ email })
        ]);
        if (existingTeacher || existingStudent) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const userData = Object.assign(Object.assign({ name,
            email, passwordHash: hashedPassword, role }, (skills && { skills })), (interests && { interests }));
        let newUser;
        let userRole;
        if (role === 'teacher') {
            newUser = yield teacherschema_1.TeacherModel.create(userData);
            userRole = 'teacher';
        }
        else {
            newUser = yield studentschema_1.StudentModel.create(userData);
            userRole = 'student';
        }
        // Create JWT token
        const token = jsonwebtoken_1.default.sign({
            id: newUser._id,
            email: newUser.email,
            role: userRole
        }, SECRET, { expiresIn: '24h' });
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
    }
    catch (error) {
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
mainrouter.use('/', (0, rolemiddleware_1.checkRole)());
exports.default = mainrouter;
