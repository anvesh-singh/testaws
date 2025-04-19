// import { createContext, useContext, useState, ReactNode } from 'react';

// // Define types for the context value
// interface AuthContextType {
//   role: string | null;
//   setRole: (role: string | null) => void;
// }

// // Set initial value for context
// const AuthContext = createContext<AuthContextType>({
//   role: null, // Set default role as null
//   setRole: () => {} // Placeholder function for setting role
// });

// interface AuthProviderProps {
//   children: ReactNode; // Define children as ReactNode
// }

// export const AuthProvider = ({ children }: AuthProviderProps) => {
//   const [role, setRole] = useState<string | null>(null); // 'student' or 'teacher'

//   return (
//     <AuthContext.Provider value={{ role, setRole }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useState, ReactNode } from 'react';

// ----------- Types ------------
type Course = {
  id: string;
  title: string;
  image: string;
  type: string;
  teacher: string;
  description: string;
};

interface AuthContextType {
  role: string | null;
  setRole: (role: string | null) => void;

  joinedCourses: Course[];
  joinCourse: (course: Course) => void;
  leaveCourse: (courseId: string) => void;
  isJoined: (courseId: string) => boolean;
}

// ----------- Context ------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ----------- Provider ------------
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<string | null>(null); // 'student' or 'teacher'
  const [joinedCourses, setJoinedCourses] = useState<Course[]>([]);

  const joinCourse = (course: Course) => {
    setJoinedCourses(prev => {
      const alreadyJoined = prev.some(c => c.id === course.id);
      return alreadyJoined ? prev : [...prev, course];
    });
  };

  const leaveCourse = (courseId: string) => {
    setJoinedCourses(prev => prev.filter(course => course.id !== courseId));
  };

  const isJoined = (courseId: string) => {
    return joinedCourses.some(course => course.id === courseId);
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
        joinedCourses,
        joinCourse,
        leaveCourse,
        isJoined,
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

