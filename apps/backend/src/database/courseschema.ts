import mongoose from "mongoose";
import { TeacherModel } from './teacherschema';  // Import the Teacher model
import { StudentModel } from './studentschema';  // Import the Student model

const courseSchema = new mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",  // Reference to the Teacher model
    required: true,
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",  // Reference to the Student model
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

export const CourseModel = mongoose.model("Course", courseSchema);
