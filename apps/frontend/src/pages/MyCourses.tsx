// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Video, VideoOff, Camera, PlusCircle } from 'lucide-react';

// interface Course {
//   _id: string;
//   title: string;
//   description: string;
//   difficulty: string;
//   isLive: boolean;
// }

// const MyCourses = () => {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const navigate = useNavigate();

//   // Placeholder data, replace with API fetch later
//   useEffect(() => {
//     setCourses([
//       {
//         _id: '1',
//         title: 'React for Beginners',
//         description: 'Learn React from scratch.',
//         difficulty: 'Beginner',
//         isLive: false,
//       },
//       {
//         _id: '2',
//         title: 'Advanced JavaScript',
//         description: 'Deep dive into JS concepts.',
//         difficulty: 'Advanced',
//         isLive: true,
//       },
//     ]);
//   }, []);

//   return (
//     <div className="p-6 min-h-screen bg-gray-100">
//       <h1 className="text-3xl font-bold text-indigo-700 mb-6">📚 My Courses</h1>

//       {courses.length === 0 ? (
//         <p className="text-gray-600">You haven't created any courses yet.</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {courses.map(course => (
//             <div key={course._id} className="bg-white p-5 rounded-lg shadow">
//               <h2 className="text-xl font-semibold text-indigo-600">{course.title}</h2>
//               <p className="text-sm text-gray-600 mb-2">{course.description}</p>
//               <span className="text-xs text-white bg-indigo-500 px-2 py-1 rounded-full">{course.difficulty}</span>

//               <div className="mt-4 flex gap-4">
//                 <button
//                   className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center gap-2"
//                   onClick={() => navigate(`/upload-recorded/${course._id}`)}
//                 >
//                   <Video size={18} /> Upload Recorded Session
//                 </button>
//                 <button
//                   className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
//                   onClick={() => navigate(`/live-session/${course._id}`)}
//                 >
//                   <Camera size={18} /> {course.isLive ? 'Edit Live Session' : 'Create Live Session'}
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       <div className="mt-10">
//         <button
//           className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded flex items-center gap-2"
//           onClick={() => navigate('/addCourse')}
//         >
//           <PlusCircle size={20} /> Create New Course
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MyCourses;

import React from 'react';
import { Link } from 'react-router-dom';

const mockCourses = [
  { id: 'course1', title: 'React Fundamentals', studentsCount: 20 },
  { id: 'course2', title: 'Intro to Python', studentsCount: 15 },
];

const MyCourses = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600">📚 My Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white shadow p-4 rounded cursor-pointer hover:shadow-md transition"
          >
            <h3 className="text-xl font-semibold">{course.title}</h3>
            <p className="text-sm text-gray-500">{course.studentsCount} students enrolled</p>

            {/* Buttons for Uploading Video and Creating Live Session */}
            <div className="mt-4 flex gap-4">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                onClick={() => alert(`Upload video for ${course.title}`)}
              >
                Upload Video
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                onClick={() => alert(`Create live session for ${course.title}`)}
              >
                Create Live Session
              </button>
            </div>
            <Link
              to={`/myCourses/${course.id}`}
              className="block text-blue-600 mt-4 text-sm hover:underline"
            >
              View Course Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCourses;

