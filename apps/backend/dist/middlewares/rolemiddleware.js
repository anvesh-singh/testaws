"use strict";
//@ts-nocheck
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const teacherroute_1 = __importDefault(require("../routes/teacherroute"));
const studentroute_1 = __importDefault(require("../routes/studentroute"));
dotenv_1.default.config();
const SECRET = process.env.JWT_SECRET;
// Middleware to check the user role
const checkRole = () => {
    return (req, res, next) => {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ msg: 'No token provided',
                type: "check role"
            });
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, SECRET);
            if (decoded.role == "teacher") {
                return (0, teacherroute_1.default)(req, res, next);
            }
            else {
                return (0, studentroute_1.default)(req, res, next);
            }
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ msg: 'Internal server error' });
        }
    };
};
exports.checkRole = checkRole;
