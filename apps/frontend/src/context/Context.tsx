//@ts-nocheck
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { decodeToken } from 'react-jwt';
import Cookies from 'js-cookie';
import axios from 'axios';


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


// ----------- Types ------------
type Course = {
  id: string;
  title: string;
  image: string;
  type: string;
  teacher: string;
  description: string;
};

type DecodedToken = {
  id: string;
  email: string;
  role: string;
  exp: number;
};

interface AuthContextType {
  isAuthenticated: boolean;
  role: string | null;
  userId: string | null;
  email: string | null;
  loading: boolean;
  logout: () => void;
  checkAuth: () => boolean;
  joinedCourses: Course[];
  joinCourse: (course: Course) => void;
  leaveCourse: (courseId: string) => void;
  isJoined: (courseId: string) => boolean;
}

// ----------- Context ------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ----------- Provider ------------
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [joinedCourses, setJoinedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load authentication state from cookie
  const loadAuthFromCookie = (): boolean => {
    const token = Cookies.get("jwt");
    
    if (!token) {
      setIsAuthenticated(false);
      setRole(null);
      setUserId(null);
      setEmail(null);
      return false;
    }
    
    try {
      const decoded = decodeToken<DecodedToken>(token);
      
      // Check if token is expired
      const currentTime = Date.now() / 1000;
      if (!decoded || !decoded.exp || decoded.exp < currentTime) {
        // Token is invalid or expired
        Cookies.remove("jwt");
        setIsAuthenticated(false);
        setRole(null);
        setUserId(null);
        setEmail(null);
        return false;
      }
      
      // Token is valid
      setIsAuthenticated(true);
      setRole(decoded.role);
      setUserId(decoded.id);
      setEmail(decoded.email);
      return true;
    } catch (error) {
      console.error("Error decoding token:", error);
      setIsAuthenticated(false);
      setRole(null);
      setUserId(null);
      setEmail(null);
      return false;
    }
  };

  // Initialize on component mount
  useEffect(() => {
    // Begin with loading state
    setLoading(true);
    
    // Check authentication status
    loadAuthFromCookie();
    
    // End loading state after authentication check
    setTimeout(() => {
      setLoading(false);
    }, 300); // Short delay to ensure state updates properly
    
    // Set up interval to periodically check token validity
    const interval = setInterval(() => {
      loadAuthFromCookie();
    }, 5 * 60 * 1000); // Check every 5 minutes
    
    return () => clearInterval(interval);
  }, []);

  // Check authentication status - can be called before navigation
  const checkAuth = (): boolean => {
    return loadAuthFromCookie();
  };

  // Logout function
  const logout = () => {
    Cookies.remove("jwt");
    setIsAuthenticated(false);
    setRole(null);
    setUserId(null);
    setEmail(null);
    // Clear any route state from localStorage if you're using that
    localStorage.removeItem('lastProtectedRoute');
  };

  // Course management functions
  const joinCourse =  (course: Course) => {
    const alreadyJoined = joinedCourses.some(c => c._id === course._id);
    if (alreadyJoined) return;
  
    try {
       axios.post(
        `${BACKEND_URL}/join-course`,
        { courseId: course._id },
        { withCredentials: true }
      ).then(()=>{
        setJoinedCourses(prev => [...prev, course]);
      });
    } catch (e) {
      console.error('Failed to join course:', e);
    }
  };
  
  const leaveCourse = async (course: Course) => {
    const alreadyJoined = joinedCourses.some(c => c._id === course._id);
    if (!alreadyJoined) return;
    try {
      await axios.post(
        `${BACKEND_URL}/leave-course`,
        { courseId: course._id },
        { withCredentials: true }
      );
      setJoinedCourses(prev => prev.filter(c => c._id !== course._id));
    } catch (e) {
      console.error('Failed to leave course:', e);
    }
  };

  const isJoined = (courseId: string) => {
    return joinedCourses.some(course => course.id === courseId);
  };

  // Load joined courses from localStorage when user ID changes
  useEffect(() => {
    if (userId) {
      const savedCourses = localStorage.getItem(`joinedCourses_${userId}`);
      if (savedCourses) {
        try {
          setJoinedCourses(JSON.parse(savedCourses));
        } catch (e) {
          console.error("Error parsing saved courses:", e);
        }
      }
    } else {
      setJoinedCourses([]);
    }
  }, [userId]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        role,
        userId,
        email,
        loading,
        logout,
        checkAuth,
        joinedCourses,
        joinCourse,
        leaveCourse,
        isJoined,
        setRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ----------- Hook ------------
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};