import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

const Uploader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videos, setVideos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

    const uploadVideo = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('video', file);
  
    const response = await axios.post('http://localhost:3000/api/videos/upload', formData);
  
    return response.data.url;
  };
  
   const fetchVideos = async (): Promise<string[]> => {
    const response = await axios.get<{ videos: string[] }>('/api/videos');
    return response.data.videos;
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const list = await fetchVideos();
      setVideos(list);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    setError('');
    try {
      await uploadVideo(selectedFile);
      setSelectedFile(null);
      await loadVideos();
    } catch (err) {
      setError('Upload failed.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  async function handleSubmitOnCloudinary() {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3000/api/videos/uploadCloudinary');
      setVideoUrl(response.data.url);
    } catch (err) {
      console.error('Error uploading video to Cloudinary:', err);
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl mb-4">Video Uploader</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !selectedFile} className="ml-2">
          {loading ? 'Uploading...' : 'Upload'}
        </button>
        <button type="submit" className="ml-2" onClick={handleSubmitOnCloudinary}>
          submit
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      <h2 className="text-xl mb-2">Available Videos</h2>
      <div className="space-y-4">
        {Array.isArray(videos) && videos.map(url => (
          <video
            key={url}
            src={url}
            controls
            width={640}
            className="border"
          />
        ))}
      </div>
    </div>
  );
};

export default Uploader;