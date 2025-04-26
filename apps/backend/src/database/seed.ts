//@ts-nocheck
import mongoose from "mongoose";
import dotenv from "dotenv";
import { CourseModel } from "./courseschema";  // Assuming the Course schema is already defined
import { TeacherModel } from "./teacherschema";  // Import TeacherModel
import { StudentModel } from "./studentschema";  // Import StudentModel
import connectDB from "./db";  // Import your connectDB util
dotenv.config();

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getRandomDate = () => {
  const currentDate = new Date();
  const futureDate = new Date(currentDate.getTime() + Math.random() * 365 * 24 * 60 * 60 * 1000);
  return futureDate;
};

// Helper to generate unique emails by adding timestamp
const generateUniqueEmail = (prefix) => {
  return `${prefix}${new Date().getTime()}@example.com`;
};

const seedCourses = async (teachers) => {
  await CourseModel.deleteMany();

  const sampleCourses = [];

  const courseTitles = [
    "Intro to Web Development",
    "Mastering Carpentry",
    "Gardening for Beginners",
    "Social Media Marketing 101",
    "Advanced Data Science",
    "Plumbing Essentials",
    "Advanced Cooking Techniques",
    "Tailoring Masterclass",
    "Graphic Design Fundamentals",
    "Electric Vehicle Repair"
  ];

  const courseDescriptions = [
    "Learn the basics of building websites from scratch with HTML, CSS, and JavaScript.",
    "A comprehensive guide to carpentry, from tools to advanced techniques.",
    "Learn how to grow your own food with expert gardening techniques and sustainable practices.",
    "Boost your career with essential skills in social media marketing and content creation.",
    "Dive deep into data analysis and machine learning with this advanced course.",
    "Understand plumbing systems, tools, and techniques to start your own business or improve your home.",
    "Master the art of cooking with advanced techniques and recipes from top chefs.",
    "Learn the art of tailoring with hands-on experience in fitting and design.",
    "Create stunning visuals and layouts with core graphic design principles and tools.",
    "Understand how electric vehicles work and how to repair common issues."
  ];

  const tags = ["coding", "carpentry", "tailoring", "repair", "gardening", "marketing", "data science", "cooking", "plumbing", "design"];
  const types = ["Workshop", "Recorded", "Live", "Project-Based", "Bootcamp"];

  for (let i = 0; i < 10; i++) {
    const selectedTeacher = teachers[i % teachers.length];

    const course = {
      title: courseTitles[i],
      description: courseDescriptions[i],
      tags: [getRandomElement(tags), getRandomElement(tags), getRandomElement(tags)],
      instructor: selectedTeacher._id, // ref to Teacher
      instructorName: selectedTeacher.name, // required instructorName
      type: getRandomElement(types), // one of allowed course types
      students: [], // initially empty array
      resources: [getRandomElement(["https://example.com", "https://youtube.com", "https://coursera.com"])],
      prerequisites: [getRandomElement(["Basic knowledge", "Intermediate skills", "Advanced experience"])],
      schedule: getRandomDate(),
      difficulty: getRandomElement(["Beginner", "Intermediate", "Advanced"]),
      price: Math.random() > 0.5 ? 0 : Math.floor(Math.random() * 100 + 10),
      isLive: Math.random() > 0.5
    };

    sampleCourses.push(course);
  }

  await CourseModel.insertMany(sampleCourses);
  console.log("✅ Course seed data inserted!");
  return sampleCourses;
};


const seedTeachers = async () => {
  await TeacherModel.deleteMany(); // Delete existing teachers

  const sampleTeachers = [];

  for (let i = 0; i < 5; i++) {
    const teacher = {
      name: `Teacher ${i + 1}`,
      email: generateUniqueEmail(`teacher${i + 1}`), // Ensure unique email
      passwordHash: "hashedpassword123", // Example hash for simplicity
      avatarUrl: "https://example.com/avatar.jpg",
      bio: `Bio for Teacher ${i + 1}`,
      role: "teacher",
      skills: [getRandomElement(["carpentry", "coding", "tailoring", "plumbing", "gardening"]), getRandomElement(["woodwork", "frontend dev", "bike repair", "marketing", "social media"])],
      interests: [getRandomElement(["woodwork", "frontend dev", "bike repair", "marketing", "social media"])],
      coursesCreated: []  // Will be populated with course IDs after courses are created
    };

    sampleTeachers.push(teacher);
  }

  const teachers = await TeacherModel.insertMany(sampleTeachers);
  console.log("✅ Teacher seed data inserted!");

  return teachers;
};

const seedStudents = async (courses) => {
  const sampleStudents = [];

  for (let i = 0; i < 10; i++) {
    const student = {
      name: `Student ${i + 1}`,
      email: generateUniqueEmail(`student${i + 1}`), // Ensure unique email
      passwordHash: "hashedpassword123", // Example hash for simplicity
      avatarUrl: "https://example.com/avatar.jpg",
      bio: `Bio for Student ${i + 1}`,
      role: "student",
      skills: [getRandomElement(["carpentry", "coding", "tailoring", "plumbing", "gardening"]), getRandomElement(["woodwork", "frontend dev", "bike repair", "marketing", "social media"])],
      interests: [getRandomElement(["woodwork", "frontend dev", "bike repair", "marketing", "social media"])],
      enrolledCourses: []  // Will be populated with course IDs after courses are created
    };

    // Randomly assign 2-3 courses to each student
    const enrolledCourses = [];
    for (let j = 0; j < 3; j++) {
      const randomCourse = getRandomElement(courses);
      enrolledCourses.push(randomCourse._id);
    }

    student.enrolledCourses = enrolledCourses;
    sampleStudents.push(student);
  }

  await StudentModel.insertMany(sampleStudents);
  console.log("✅ Student seed data inserted!");
};

export const runSeeds = async () => {
  try {
    await connectDB(); // connect to MongoDB using your helper

    const teachers = await seedTeachers(); // Seed teachers first
    const courses = await seedCourses(teachers); // Seed courses with teachers
    await seedStudents(courses); // Seed students after courses are created

    console.log("🌱 All seeding completed!");
    process.exit();
  } catch (err) {
    console.error("❌ Error while seeding data:", err);
    process.exit(1);
  }
};

runSeeds();
