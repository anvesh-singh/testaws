import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Star, PlusCircle, MessageSquare } from 'lucide-react';

const TeacherHome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">Welcome Back, Teacher 👋</h1>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
          <BookOpen className="text-indigo-600 mb-2" size={32} />
          <p className="text-xl font-semibold">8</p>
          <p className="text-sm text-gray-500">Courses Created</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
          <Users className="text-green-600 mb-2" size={32} />
          <p className="text-xl font-semibold">240</p>
          <p className="text-sm text-gray-500">Students Enrolled</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
          <Star className="text-yellow-500 mb-2" size={32} />
          <p className="text-xl font-semibold">4.8</p>
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
          <li className="flex justify-between border-b pb-2">
            <span>React Basics</span>
            <span className="text-sm text-gray-500">Mon, 10:00 AM</span>
          </li>
          <li className="flex justify-between border-b pb-2">
            <span>Intro to Tailoring</span>
            <span className="text-sm text-gray-500">Tue, 2:00 PM</span>
          </li>
          <li className="flex justify-between">
            <span>Advanced JS</span>
            <span className="text-sm text-gray-500">Wed, 1:00 PM</span>
          </li>
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
  <h2 className="text-xl font-semibold mb-4">🏆 Top Performing Students</h2>
  <ul className="divide-y">
    {[
      { name: 'Alice Johnson', score: 98 },
      { name: 'Mark Lee', score: 95 },
      { name: 'Priya Singh', score: 93 },
      { name: 'Carlos Rivera', score: 91 },
      { name: 'Sarah Kim', score: 90 },
    ].map((student, index) => (
      <li key={index} className="flex justify-between py-2">
        <span className="font-medium">{student.name}</span>
        <span className="text-sm text-gray-500">Score: {student.score}</span>
      </li>
    ))}
  </ul>
  {/* <button className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition">
    View All Students
  </button> */}
</div>
    </div>
  );
};

export default TeacherHome;
