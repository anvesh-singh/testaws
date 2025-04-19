"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userschema_1 = require("./userschema"); // Import the User model
const studentSchema = new mongoose_1.default.Schema({
    enrolledCourses: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Course", // Reference to the Course model
        }],
});
// Create the Student model using the User model as the base schema
studentSchema.add(userschema_1.userModel.schema);
exports.StudentModel = mongoose_1.default.model("Student", studentSchema);
