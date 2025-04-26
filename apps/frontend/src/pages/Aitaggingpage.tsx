import React, { useState } from "react";
import "../styles/Aitagging.css";

interface Tag {
  tag: string;
  score: number;
}
interface Course {
  session_id: number;
  title: string;
  tags: string[];
}

const App: React.FC = () => {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Fetch predicted tags
      const predictRes = await fetch("http://localhost:3000/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: "predict", title, top_k: 5 }),
      });
      const tagsData: Tag[] = await predictRes.json();
      setTags(tagsData);

      // Fetch recommended courses (placeholder uses index 0)
      const recRes = await fetch("http://localhost:3000/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: "recommend", session_index: 0, n: 5 }),
      });
      const coursesData: Course[] = await recRes.json();
      setCourses(coursesData);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>SkillBridge Explorer</h1>

      <div className="input-group">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter course title..."
        />
        <button onClick={handleSearch} disabled={loading || !title}>
          {loading ? "Searching..." : "Go"}
        </button>
      </div>

      {tags.length > 0 && (
        <div className="tags-container">
          <h2>Predicted Tags</h2>
          <ul>
            {tags.map((t, i) => (
              <li key={i}>
                {t.tag} ({t.score.toFixed(2)})
              </li>
            ))}
          </ul>
        </div>
      )}

      {courses.length > 0 && (
        <div className="courses-container">
          <h2>Recommended Courses</h2>
          <div className="courses-grid">
            {courses.map((c) => (
              <div key={c.session_id} className="course-card">
                <h3>{c.title}</h3>
                <p>Tags: {c.tags.join(", ")}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
