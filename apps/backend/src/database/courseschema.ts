import mongoose from "mongoose";
import { TeacherModel } from './teacherschema';  
import { StudentModel } from './studentschema';  

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
    ref: "Teacher",
    required: true,
  },
  instructorName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Workshop", "Recorded", "Live", "Project-Based", "Bootcamp"],
    default: "Workshop",
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  }],
  resources: [String],
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
  averageRating: {
    type: Number,
    default: 0,
  },
});

export const CourseModel = mongoose.model("Course", courseSchema);
