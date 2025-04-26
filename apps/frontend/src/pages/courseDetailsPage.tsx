// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { FaChalkboardTeacher, FaBookOpen } from 'react-icons/fa';

// const CourseDetails = () => {
//   const { courseId } = useParams();
//   const [course, setCourse] = useState<any>(null);
//   const [joined, setJoined] = useState(false);

//   useEffect(() => {
//     // Simulate API fetch
//     setTimeout(() => {
//       setCourse({
//         id: courseId,
//         title: 'Advanced Web Development',
//         image: 'https://source.unsplash.com/800x400/?coding,technology',
//         teacher: 'John Doe',
//         type: 'Coding',
//         description: 'Master advanced concepts in front-end and back-end web development.',
//       });
//     }, 1000);

//     // Check if already joined
//     const joinedCourses = JSON.parse(localStorage.getItem('joinedCourses') || '[]');
//     setJoined(joinedCourses.includes(courseId));
//   }, [courseId]);

//   const handleJoin = () => {
//     const joinedCourses = JSON.parse(localStorage.getItem('joinedCourses') || '[]');
//     const updated = [...new Set([...joinedCourses, courseId])];
//     localStorage.setItem('joinedCourses', JSON.stringify(updated));
//     setJoined(true);
//   };

//   const handleLeave = () => {
//     const joinedCourses = JSON.parse(localStorage.getItem('joinedCourses') || '[]');
//     const updated = joinedCourses.filter((id: string) => id !== courseId);
//     localStorage.setItem('joinedCourses', JSON.stringify(updated));
//     setJoined(false);
//   };

//   if (!course) return <div className="text-center mt-10">Loading course details...</div>;

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <div className="mb-6">
//         <img src={course.image} alt={course.title} className="w-full rounded-lg shadow-lg" />
//       </div>

//       <h1 className="text-3xl font-bold text-gray-800 mb-4">{course.title}</h1>
//       <div className="flex items-center gap-6 text-gray-600 mb-4">
//         <p className="flex items-center gap-2"><FaBookOpen /> {course.type}</p>
//         <p className="flex items-center gap-2"><FaChalkboardTeacher /> {course.teacher}</p>
//       </div>

//       <p className="text-lg text-gray-700 mb-6">{course.description}</p>

//       {joined ? (
//         <button onClick={handleLeave} className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700">
//           Leave Course
//         </button>
//       ) : (
//         <button onClick={handleJoin} className="px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700">
//           Join Course
//         </button>
//       )}
//     </div>
//   );
// };

// export default CourseDetails;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChalkboardTeacher, FaBookOpen } from 'react-icons/fa';
import { useAuth } from '../context/Context.tsx';
import axios from 'axios';
const BACKEND_URL= import.meta.env.VITE_BACKEND_URL;


const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { joinCourse, leaveCourse, isJoined } = useAuth();
  
  const [course, setCourse] = useState<any>(null);

  useEffect(() => {
    const fetchcourse=async()=>{
      try{
      const res=await axios.get(`${BACKEND_URL}/getcourse/${courseId}`,{withCredentials:true});
      setCourse(res.data.course);
      console.log(course);
    }
    catch(e){
      console.log(e);
    }
    }
    fetchcourse().then();
  }, [courseId]);

  const handleJoin = () => {
    console.log(course);
    if (course) {
      console.log('join');
      joinCourse(course);
      console.log(isJoined(course._id))
    }
  };

  const handleLeave = () => {
    if (course) {
      leaveCourse(course.id);
    }
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
        <p className="flex items-center gap-2"><FaChalkboardTeacher /> {course.teacher}</p>
      </div>

      <p className="text-lg text-gray-700 mb-6">{course.description}</p>

      {isJoined(course._id) ? (
        <button
          onClick={handleLeave}
          className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Leave Course
        </button>
      ) : (
        <button
          onClick={handleJoin}
          className="px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Join Course
        </button>
      )}
    </div>
  );
};

export default CourseDetails;

