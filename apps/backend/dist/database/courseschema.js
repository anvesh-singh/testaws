"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const courseSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    tags: [String],
    instructor: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Teacher", // Reference to the Teacher model
        required: true,
    },
    students: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Student", // Reference to the Student model
        }],
    resources: [{
            type: String,
        }],
    prerequisites: [String],
    schedule: {
        type: Date,
    },
    difficulty: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"],
        default: "Beginner",
    },
    price: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isLive: {
        type: Boolean,
        default: false,
    },
});
exports.CourseModel = mongoose_1.default.model("Course", courseSchema);
