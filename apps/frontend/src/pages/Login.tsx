// //@ts-nocheck
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { useAuth } from '../context/Context.tsx';
// import axios from 'axios';
// import { decodeToken } from "react-jwt";
// import  Cookies  from 'js-cookie';


// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;  

// const Login = () => {
//   const [currentState, setCurrentState] = useState('Login');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();
//   const { setRole } = useAuth(); // Accessing setRole from context API

//   // Utility to get cookies
//   const getCookie = (name: string) => {
//     const value = `; ${document.cookie}`;
//     console.log("hi",document.cookie)
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop()?.split(';').shift();
//     return null;
//   };

//   const signInUser = async () => {
//     try {
//       // Step 1: Attempt login
//       const loginResponse = await axios.post(
//         `${BACKEND_URL}/signin`,
//         { email, password },
//         { withCredentials: true }
//       );
//       console.log(loginResponse);

//       // Step 2: Get the token from cookies using the custom function
//       const token = Cookies.get('jwt')
//       console.log("JWT Token:", token);

//       if (!token) {
//         toast.error("Login failed: no token received");
//         return;
//       }

//       // Step 3: Decode the token to get role
//       const decoded = decodeToken(token);
//       console.log("Decoded Token:", decoded);

//       if (!decoded || !decoded.role) {
//         toast.error("Login failed: role missing in token");
//         return;
//       }

//       const role = decoded.role;
//       setRole(role); // Update the role in context
//       toast.success("Login successful");

//       // Step 4: Navigate based on role
//       if (role === 'teacher') {
//         navigate('/teacherhome');
//       } else {
//         navigate('/');
//       }

//     } catch (err: any) {
//       console.error("Login error:", err);
//       toast.error("Invalid credentials");
//     }
//   };

//   const onSubmitHandler = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await signInUser();
//   };

//   return (
//     <form onSubmit={onSubmitHandler} className="flex flex-col items-center w-[90%] sm:max-w-md mx-auto mt-20 gap-4 text-gray-800">
//       <div className="inline-flex items-center gap-2 mb-2 mt-10">
//         <p className="text-3xl font-semibold">{currentState}</p>
//         <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
//       </div>

//       {currentState === 'Login' ? null : (
//         <input type="text" className="w-full px-3 py-2 border border-gray-800 rounded" placeholder="Name" required />
//       )}

//       <input
//         onChange={(e) => setEmail(e.target.value)}
//         type="email"
//         className="w-full px-3 py-2 border border-gray-800 rounded"
//         placeholder="Email"
//         required
//       />
//       <input
//         onChange={(e) => setPassword(e.target.value)}
//         type="password"
//         className="w-full px-3 py-2 border border-gray-800 rounded"
//         placeholder="Password"
//         required
//       />

//       <div className="w-full flex justify-between text-sm mt-[-8px]">
//         <p className="cursor-pointer">Forgot Your Password</p>
//         {currentState === 'Login' ? (
//           <p onClick={() => setCurrentState('Sign Up')} className="cursor-pointer">Create Account</p>
//         ) : (
//           <p onClick={() => setCurrentState('Login')} className="cursor-pointer">Login Instead</p>
//         )}
//       </div>

//       <button type="submit" className="bg-black text-white font-light px-8 py-2 mt-4">
//         {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
//       </button>
//     </form>
//   );
// };

// export default Login;

// @ts-nocheck
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/Context.tsx';
import axios from 'axios';
import { decodeToken } from "react-jwt";
import Cookies from 'js-cookie';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [skills, setSkills] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');
  const [isTeacher, setIsTeacher] = useState(false);

  const navigate = useNavigate();
  const { setRole } = useAuth();

  const signInUser = async () => {
    try {
      const loginResponse = await axios.post(
        `${BACKEND_URL}/signin`,
        { email, password },
        { withCredentials: true }
      );
      console.log(loginResponse);

      const token = Cookies.get('jwt');
      console.log("JWT Token:", token);

      if (!token) {
        toast.error("Login failed: no token received");
        return;
      }

      const decoded = decodeToken(token);
      console.log("Decoded Token:", decoded);

      if (!decoded || !decoded.role) {
        toast.error("Login failed: role missing in token");
        return;
      }

      const role = decoded.role;
      setRole(role);
      toast.success("Login successful");

      if (role === 'teacher') {
        navigate('/teacherhome');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Invalid credentials");
    }
  };

  const signUpUser = async () => {
    const role = isTeacher ? 'teacher' : 'student';

    const payload = {
      name,
      email,
      password,
      role,
      ...(isTeacher
        ? { skills: skills.split(',').map(s => s.trim()), bio }
        : { interests: interests.split(',').map(i => i.trim()) }),
    };

    try {
      const res = await axios.post(`${BACKEND_URL}/signup`, payload, {
        withCredentials: true,
      });
      toast.success('Signup successful! Please login.');
      setCurrentState('Login');
    } catch (err) {
      console.error('Signup error:', err);
      toast.error('Signup failed');
    }
  };

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentState === 'Login') {
      await signInUser();
    } else {
      await signUpUser();
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-md mx-auto mt-20 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="text-3xl font-semibold">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {currentState === 'Sign Up' && (
        <>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-800 rounded"
            placeholder="Name"
            required
          />

         

          {isTeacher ? (
            <>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full px-3 py-2 border border-gray-800 rounded"
                placeholder="Skills (comma-separated)"
              />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 border border-gray-800 rounded"
                placeholder="Short Bio"
              />
            </>
          ) : (
            <input
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              className="w-full px-3 py-2 border border-gray-800 rounded"
              placeholder="Interests (comma-separated)"
            />
          )}
        </>
      )}

      <input
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        className="w-full px-3 py-2 border border-gray-800 rounded"
        placeholder="Email"
        required
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        className="w-full px-3 py-2 border border-gray-800 rounded"
        placeholder="Password"
        required
      />

      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot Your Password</p>
        {currentState === 'Login' ? (
          <p onClick={() => setCurrentState('Sign Up')} className="cursor-pointer">Create Account</p>
        ) : (
          <p onClick={() => setCurrentState('Login')} className="cursor-pointer">Login Instead</p>
        )}
      </div>

      {currentState==='Sign Up' && <div className="w-full flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={isTeacher}
              onChange={() => setIsTeacher(!isTeacher)}
            />
            <label>Sign up as Teacher</label>
          </div>}

      <button type="submit" className="bg-black text-white font-light px-8 py-2 mt-4">
        {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
      </button>

    </form>
  );
};

export default Login;

