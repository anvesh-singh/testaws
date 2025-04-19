// @ts-nocheck
import React, { useEffect, useState } from 'react'
import { FaVideo, FaUserTie, FaChalkboardTeacher, FaGraduationCap } from 'react-icons/fa'
import axios from 'axios'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Home = () => {
  const [topCourses, setTopCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/getcourses`, { withCredentials: true });
        const courses = res.data.courses;
        setTopCourses(courses.slice(0, 3));  // Pick first 3 as top courses
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="text-gray-800">
      {/* Hero Banner */}
      <div className="relative w-full h-[350px] bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1600195077901-c26b3e43a542?auto=format&fit=crop&w=1400&q=80)' }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-center px-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Welcome to Skill Bridge</h1>
            <p className="text-lg md:text-xl max-w-xl mx-auto">Learn. Grow. Succeed. Join our platform for a personalized, guided learning experience.</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-10">What We Offer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <Feature icon={<FaUserTie />} title="1:1 Mentorship" desc="Dedicated mentors to guide your learning journey." />
            <Feature icon={<FaChalkboardTeacher />} title="Expert Guidance" desc="Get trained by experienced industry professionals." />
            <Feature icon={<FaVideo />} title="Video Sessions" desc="Interactive live sessions and recorded materials." />
            <Feature icon={<FaGraduationCap />} title="Live Classes" desc="Join live online classrooms with peers and mentors." />
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="bg-gray-50 py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Popular Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {topCourses.map((course, i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition">
              <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="font-semibold text-xl mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm">{course.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-14 px-6 bg-white">
        <h2 className="text-3xl font-bold mb-4">Start Your Journey with Skill Bridge</h2>
        <p className="text-gray-600 mb-6">Unlock your potential with hands-on learning and expert mentorship.</p>
        <a href="/courses" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
          Browse Courses
        </a>
      </section>
    </div>
  )
}

const Feature = ({ icon, title, desc }) => (
  <div className="p-6 bg-gray-100 rounded-lg shadow hover:shadow-md text-center">
    <div className="flex justify-center items-center text-4xl text-indigo-600 mb-3">
      {icon}
    </div>
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className="text-sm text-gray-600">{desc}</p>
  </div>
);

export default Home;
