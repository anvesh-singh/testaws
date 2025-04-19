import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { Menu, X, } from 'lucide-react'
import toast from 'react-hot-toast';
import  Cookies from 'js-cookie';
// const TeacherNavbar = ({ isLoggedIn, setIsLoggedIn }: { isLoggedIn: boolean, setIsLoggedIn: (value: boolean) => void }) => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     toast.success('Logged out successfully!');
//     navigate('/login');
//   };

//   return (
//     <nav className="bg-white shadow-md fixed w-full z-50 top-0 px-6 py-3 flex justify-between items-center">
//       {/* Left Side - Brand */}
//       <div className="text-2xl font-bold text-indigo-600">Skill Bridge</div>
      
//       {/* Centered Navigation Links */}
//       <div className="hidden md:flex space-x-6 items-center mx-auto">
//         <Link to="/add-course" className="text-gray-700 hover:text-indigo-600 transition font-medium">Add Course</Link>
//         <Link to="/my-courses" className="text-gray-700 hover:text-indigo-600 transition font-medium">My Courses</Link>
//         <Link to="/about" className="text-gray-700 hover:text-indigo-600 transition font-medium">About</Link>
//         <Link to="/contact" className="text-gray-700 hover:text-indigo-600 transition font-medium">Contact</Link>
//       </div>

//       {/* Right Side - Profile and Logout */}
//       <div className="flex space-x-6 items-center">
//         {isLoggedIn && (
//           <>
//             <Link to="/profile" className="text-gray-700 hover:text-indigo-600">
//               <User className="w-5 h-5" />
//             </Link>
//             <button onClick={handleLogout} className="text-gray-700 hover:text-red-500">
//               <LogOut className="w-5 h-5" />
//             </button>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

const TeacherNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Replace with actual auth state if needed
const navigate = useNavigate();

const handleLogout = () => {
  setIsLoggedIn(false);
  Cookies.remove('token'); // if you're storing a token
  toast.success("Logged out successfully!");
  navigate('/login');
};
 // Replace with your actual auth check


  const toggleMenu = () => setMenuOpen(!menuOpen)

 

  return (
    <nav className="bg-white shadow-md fixed w-full z-50 top-0">
      <div className="w-full">
        <div className="flex items-center justify-between h-16 px-4 md:px-8">

          {/* Left: Brand */}
          <div className="text-2xl font-bold text-indigo-600">
            Skill Bridge
          </div>

          {/* Center: Menu */}
          <div className="hidden md:flex flex-1 justify-center space-x-8">
            <Link to="/teacherhome" className="text-gray-700 hover:text-indigo-600 transition font-medium">Home</Link>
            <Link to="/addCourse" className="text-gray-700 hover:text-indigo-600 transition font-medium">Add Course</Link>
            <Link to="/myCourses" className="text-gray-700 hover:text-indigo-600 transition font-medium">My Courses</Link>
            <Link to="/about" className="text-gray-700 hover:text-indigo-600 transition font-medium">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-indigo-600 transition font-medium">Contact</Link>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center space-x-4">
            <Link to="/profile-teacher" className="hidden md:block">
              <User className="w-6 h-6 text-gray-700 hover:text-indigo-600 transition" />
            </Link>
            {isLoggedIn && (
  <button onClick={handleLogout} className="hidden md:block">
    <LogOut className="w-6 h-6 text-gray-700 hover:text-red-500 transition" />
  </button>
)}

            <button className="md:hidden" onClick={toggleMenu}>
              {menuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-4 pt-2 pb-4 space-y-2 shadow-md">
        <Link to="/teacherhome" onClick={toggleMenu} className="block text-gray-700 hover:text-indigo-600">Home</Link> 
          <Link to="/addCourse" onClick={toggleMenu} className="block text-gray-700 hover:text-indigo-600">Add Course</Link>
          <Link to="/myCourses" onClick={toggleMenu} className="block text-gray-700 hover:text-indigo-600">My Courses</Link>
          <Link to="/about" onClick={toggleMenu} className="block text-gray-700 hover:text-indigo-600">About</Link>
          <Link to="/contact" onClick={toggleMenu} className="block text-gray-700 hover:text-indigo-600">Contact</Link>
          <Link to="/profile-teacher" onClick={toggleMenu} className="block text-gray-700 hover:text-indigo-600">Profile</Link>
          {isLoggedIn && (
  <button onClick={() => { toggleMenu(); handleLogout(); }} className="w-full text-left text-gray-700 hover:text-red-500">
    Logout
  </button>
)}

        </div>
      )}
    </nav>
  )
}

export default TeacherNavbar;
