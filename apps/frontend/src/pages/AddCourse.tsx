// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';

// const AddCourse = () => {
//   const [form, setForm] = useState({
//     title: '',
//     description: '',
//     tags: '',
//     prerequisites: '',
//     schedule: '',
//     difficulty: 'Beginner',
//     price: 0,
//   });

//   const navigate = useNavigate();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       const response = await fetch('/api/courses', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ...form,
//           tags: form.tags.split(',').map(tag => tag.trim()),
//           prerequisites: form.prerequisites.split(',').map(pre => pre.trim()),
//           schedule: new Date(form.schedule),
//           instructor: "TEACHER_OBJECT_ID", // Replace with actual ID from context
//         }),
//       });

//       if (!response.ok) throw new Error('Failed to add course');
//       toast.success('Course added successfully!');
//       navigate('/teacher-home');
//     } catch (err) {
//       toast.error('Failed to add course');
//       console.error(err);
//     }
//   };

//   const handleRecordedUpload = () => {
//     toast('Redirecting to upload recorded session...');
//   };

//   const handleLiveSession = () => {
//     toast('Live session setup coming soon!');
//   };

//   return (
//     <div className="max-w-3xl mx-auto px-4 py-10">
//       <h2 className="text-2xl font-bold mb-6 text-indigo-600">📚 Add a New Course</h2>
//       <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md rounded-lg p-6">

//         <input name="title" placeholder="Course Title" required onChange={handleChange} className="w-full p-2 border rounded" />
//         <textarea name="description" placeholder="Course Description" required onChange={handleChange} className="w-full p-2 border rounded" rows={4} />
//         <input name="tags" placeholder="Tags (comma separated)" onChange={handleChange} className="w-full p-2 border rounded" />
//         <input name="prerequisites" placeholder="Prerequisites (comma separated)" onChange={handleChange} className="w-full p-2 border rounded" />
//         <input name="schedule" type="datetime-local" onChange={handleChange} className="w-full p-2 border rounded" />
        
//         <select name="difficulty" value={form.difficulty} onChange={handleChange} className="w-full p-2 border rounded">
//           <option>Beginner</option>
//           <option>Intermediate</option>
//           <option>Advanced</option>
//         </select>

//         <input name="price" type="number" placeholder="Price (₹)" onChange={handleChange} className="w-full p-2 border rounded" />

//         <div className="flex gap-4">
//           <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">Add Course</button>
//           <button type="button" onClick={handleRecordedUpload} className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900">Upload Recorded Session</button>
//           <button type="button" onClick={handleLiveSession} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Create Live Session</button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddCourse;

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AddCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    resources: '',
    prerequisites: '',
    schedule: '',
    difficulty: 'Beginner',
    price: '',
    isLive: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value, type } = e.target;
  
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : value,
    }));
  };
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate backend call
    const processedData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()),
      resources: formData.resources.split(',').map(res => res.trim()),
      prerequisites: formData.prerequisites.split(',').map(pre => pre.trim()),
      schedule: new Date(formData.schedule),
      price: Number(formData.price),
    };

    console.log('Course to be saved:', processedData);
    toast.success('Course created successfully!');
    navigate('/myCourses');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">Add New Course</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="title"
            placeholder="Course Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Course Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            rows={4}
            required
          />
          <input
            type="text"
            name="tags"
            placeholder="Tags (comma-separated)"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="text"
            name="resources"
            placeholder="Resources (comma-separated links)"
            value={formData.resources}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="text"
            name="prerequisites"
            placeholder="Prerequisites (comma-separated)"
            value={formData.prerequisites}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="datetime-local"
            name="schedule"
            value={formData.schedule}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isLive"
              checked={formData.isLive}
              onChange={handleChange}
              className="form-checkbox"
            />
            <span>Make this a live course</span>
          </label>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 w-full"
          >
            Create Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;

