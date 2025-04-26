//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Star, PlusCircle } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const TeacherHome = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    coursesCreated: 0,
    studentsEnrolled: 0,
    averageRating: 0,
    upcomingClasses: [],
    topStudents: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/getuser`, {
          withCredentials: true, // send cookies if needed
        });
        const cousesnum=res.data.teacher.courses.size;
        try{
          const res2 = await axios.get(`${BACKEND_URL}/getdetails`, {
            withCredentials: true, // send cookies if needed
          });
          setDashboardData({
            averageRating:res2.data.teacher.averageRating,
            studentsEnrolled:res2.data.totalStudents,
            upcomingClasses:res2.data.upcomingClasses,
            coursesCreated:coursenum});
        }catch(err){
          console.error('Failed to fetch teacher dashboard data:', err);
        }
      } catch (err) {
        console.error('Failed to fetch teacher dashboard data:', err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">Welcome Back, Teacher 👋</h1>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
          <BookOpen className="text-indigo-600 mb-2" size={32} />
          <p className="text-xl font-semibold">{dashboardData.coursesCreated}</p>
          <p className="text-sm text-gray-500">Courses Created</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
          <Users className="text-green-600 mb-2" size={32} />
          <p className="text-xl font-semibold">{dashboardData.studentsEnrolled}</p>
          <p className="text-sm text-gray-500">Students Enrolled</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
          <Star className="text-yellow-500 mb-2" size={32} />
          <p className="text-xl font-semibold">{dashboardData.averageRating}</p>
          <p className="text-sm text-gray-500">Average Rating</p>
        </div>
      </div>

      {/* Shortcuts */}
      <div className="flex flex-wrap gap-4 mb-10">
        <button
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
          onClick={() => navigate('/addCourse')}
        >
          <PlusCircle className="inline-block mr-2" /> Add New Course
        </button>
        <button
          className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900 transition"
          onClick={() => navigate('/myCourses')}
        >
          <BookOpen className="inline-block mr-2" /> View My Courses
        </button>
      </div>

      {/* Upcoming Schedule */}
      <div className="bg-white rounded-lg shadow p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">📅 Upcoming Classes</h2>
        <ul className="space-y-3">
          {dashboardData.upcomingClasses.map((cls, index) => (
            <li key={index} className="flex justify-between border-b pb-2">
              <span>{cls.title}</span>
              <span className="text-sm text-gray-500">{cls.time}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Top Performing Students */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">🏆 Top Performing Students</h2>
        <ul className="divide-y">
          {dashboardData.topStudents.map((student, index) => (
            <li key={index} className="flex justify-between py-2">
              <span className="font-medium">{student.name}</span>
              <span className="text-sm text-gray-500">Score: {student.score}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TeacherHome;
