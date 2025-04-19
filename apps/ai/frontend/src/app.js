import React, { useState } from 'react';

function App() {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState([]);
  const [recs, setRecs] = useState([]);
  const [idx, setIdx] = useState('');

  const fetchTags = async () => {
    const res = await fetch('/api/predict', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ title, top_k: 3 })
    });
    setTags(await res.json());
  };

  const fetchRecs = async () => {
    const res = await fetch('/api/recommend', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ session_index: idx, n: 3 })
    });
    setRecs(await res.json());
  };

  return (
    <div style={{ maxWidth:600, margin:'auto', padding:20 }}>
      <h1>SkillBridge Demo</h1>

      <div>
        <h2>Predict Tags</h2>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Session title" />
        <button onClick={fetchTags}>Predict</button>
        {tags.map(t=><div key={t.tag}>{t.tag}: {t.score.toFixed(2)}</div>)}
      </div>

     <div>
  <h2>Recommendations</h2>
  <input value={idx} onChange={e=>setIdx(e.target.value)} placeholder="Session index" />
  <button onClick={fetchRecs}>Get Recs</button>
  {recs.map(r=><div key={r.session_id}>{r.title} — {r.tags.join(', ')}</div>)}
</div>
    </div>
  );
}

export default App;