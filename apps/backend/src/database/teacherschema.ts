import mongoose from "mongoose";
import { userModel } from './userschema';  // Import the User model

const teacherSchema = new mongoose.Schema({
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",  // Reference to the Course model
  }],
});

// Create the Teacher model using the User model as the base schema
teacherSchema.add(userModel.schema);

export const TeacherModel = mongoose.model("Teacher", teacherSchema);
