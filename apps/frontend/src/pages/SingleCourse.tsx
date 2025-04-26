import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaChalkboardTeacher, FaBookOpen, FaCertificate, FaPrint } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/Context.tsx';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CourseDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [joined, setJoined] = useState(false);
  const { joinCourse, leaveCourse, isJoined } = useAuth();
  

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/getcourse/${courseId}`, {
          withCredentials: true,
        });

        setCourse(res.data.course);
      } catch (err) {
        console.error('Error fetching course:', err);
      }
    };
    if(courseId)fetchCourse();
    setJoined(isJoined(courseId));

  }, [courseId]);

  const handleJoin = () => {
     joinCourse(course);
     setJoined(isJoined(course._id));
      console.log(joined);
    
  };

  const handleLeave = () => {
    leaveCourse(course)
    setJoined(isJoined(course._id));
  };

  if (!course) return <div className="text-center mt-10">Loading course details...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <img src={course.image} alt={course.title} className="w-full rounded-lg shadow-lg" />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">{course.title}</h1>
      <div className="flex items-center gap-6 text-gray-600 mb-4">
        <p className="flex items-center gap-2"><FaBookOpen /> {course.type}</p>
        <p className="flex items-center gap-2"><FaChalkboardTeacher /> {course.instructorName}</p>
      </div>

      <p className="text-lg text-gray-700 mb-6">{course.description}</p>

      {joined ? (
        <button onClick={handleLeave} className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700">
          Leave Course
        </button>
      ) : (
        <button onClick={handleJoin} className="px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          Join Course
        </button>
      )}
    </div>
  );
};

export default CourseDetails;
