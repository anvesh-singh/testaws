//@ts-nocheck
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/StudentProfile.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface Course {
  _id: string;
  title: string;
  completed: boolean;
  progress: number;
}

interface Certificate {
  name: string;
  fileUrl: string;
}

interface User {
  name: string;
  avatarUrl: string;
  certificates: Certificate[];
  enrolledCourses: Course[];
}

const StudentProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/getuser`, { withCredentials: true });
        setUser(res.data.student);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="profile-page">
      <header className="profile-header">
        <img
          className="avatar"
          src={user?.avatarUrl || "https://via.placeholder.com/100"}
          alt={`${user?.name || "User"} avatar`}
        />
        <h1 className="student-name">{user?.name || "Loading..."}</h1>
      </header>

      <section className="courses-section">
        <h2>My Courses</h2>
        <div className="courses-list">
          {user?.enrolledCourses?.length ? (
            user.enrolledCourses.map((course) => (
              <Link to={`/profile/${course}`} key={course} className="course-card-link">
                <div className="course-card">
                  <div className="course-info">
                    <h3 className="course-title">{course.title}</h3>
                    <span className={`status ${course.completed ? "completed" : ""}`}>
                      {course.completed ? "Completed" : `${course.progress}%`}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p>No courses enrolled yet.</p>
          )}
        </div>
      </section>

      <section className="certificates-section">
        <h2>Certificates</h2>
        <div className="certificates-folder">
          <div className="folder-icon">📁</div>
          <ul className="cert-list">
            {user?.certificates?.length ? (
              user.certificates.map((cert, idx) => (
                <li key={idx} className="cert-item">
                  <a href={cert.fileUrl} download className="cert-link">
                    {cert.name}
                  </a>
                </li>
              ))
            ) : (
              <p>No certificates earned yet.</p>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default StudentProfile;
