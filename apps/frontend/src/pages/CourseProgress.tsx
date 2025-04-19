import React from 'react';
import { useParams } from 'react-router-dom';
import { FaCertificate, FaPrint } from 'react-icons/fa';

const mockProgressData: Record<string, { title: string; progress: number; completed: boolean }> = {
  '1': { title: 'React Fundamentals', progress: 100, completed: true },
  '2': { title: 'TypeScript Basics', progress: 75, completed: false },
  '3': { title: 'Advanced CSS', progress: 100, completed: true },
};

const CourseProgress: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const course = mockProgressData[courseId || ''];

  if (!course) {
    return <div className="text-center mt-10 text-gray-600">Course not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-4 text-indigo-700">📘 {course.title}</h1>

      <div className="mb-6">
        <p className="text-lg">Progress:</p>
        <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden mt-2">
          <div
            className="bg-indigo-600 h-4"
            style={{ width: `${course.progress}%` }}
          />
        </div>
        <p className="mt-2 text-gray-600">{course.progress}% completed</p>
      </div>

      {course.completed && (
        <div className="flex gap-4 mt-6">
          {/* <button className="px-5 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center gap-2">
            <FaCertificate /> Download Certificate
          </button> */}
          <button
            onClick={() => window.print()}
            className="px-5 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 flex items-center gap-2"
          >
            <FaPrint /> Print Certificate
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseProgress;
