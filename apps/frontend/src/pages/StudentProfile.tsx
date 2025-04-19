import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/StudentProfile.css';

interface Course {
  id: number;
  title: string;
  completed: boolean;
  progress: number;
}

interface Certificate {
  id: number;
  name: string;
  fileUrl: string;
}

const StudentProfile: React.FC = () => {
  const studentName = 'Jane Doe';
  const avatarUrl = 'https://s.udemycdn.com/career-academies/careers/data-scientist/data-scientist-person.png';

  const courses: Course[] = [
    { id: 1, title: 'React Fundamentals', completed: true, progress: 100 },
    { id: 2, title: 'TypeScript Basics', completed: false, progress: 75 },
    { id: 3, title: 'Advanced CSS', completed: true, progress: 100 },
  ];

  const certificates: Certificate[] = [
    { id: 1, name: 'React Fundamentals Certificate', fileUrl: '/certs/react-fundamentals.pdf' },
    { id: 2, name: 'Advanced CSS Certificate', fileUrl: '/certs/advanced-css.pdf' },
  ];

  return (
    <div className="profile-page">
      <header className="profile-header">
        <img className="avatar" src={avatarUrl} alt={`${studentName} avatar`} />
        <h1 className="student-name">{studentName}</h1>
      </header>

      <section className="courses-section">
        <h2>My Courses</h2>
        <div className="courses-list">
          {courses.map(course => (
            <Link to={`/profile/${course.id}`} key={course.id} className="course-card-link">
              <div className="course-card">
                <div className="course-info">
                  <h3 className="course-title">{course.title}</h3>
                  <span className={`status ${course.completed ? 'completed' : ''}`}>
                    {course.completed ? 'Completed' : `${course.progress}%`}
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
          ))}
        </div>
      </section>

      <section className="certificates-section">
        <h2>Certificates</h2>
        <div className="certificates-folder">
          <div className="folder-icon">📁</div>
          <ul className="cert-list">
            {certificates.map(cert => (
              <li key={cert.id} className="cert-item">
                <a href={cert.fileUrl} download className="cert-link">
                  {cert.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default StudentProfile;
