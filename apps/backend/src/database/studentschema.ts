import mongoose from "mongoose";
import { userModel } from './userschema';  // Import the User model

const studentSchema = new mongoose.Schema({
  enrolledCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",  // Reference to the Course model
  }],
});

// Create the Student model using the User model as the base schema
studentSchema.add(userModel.schema);

export const StudentModel = mongoose.model("Student", studentSchema);
