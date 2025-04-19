import { useEffect, useState } from 'react';
import axios from 'axios';

type Video = {
  url: string;
  public_id: string;
};

const CloudinaryVideoGallery = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get<{ videos: Video[] }>('http://localhost:3000/api/videos/getCloudinaryVideos');
        setVideos(res.data.videos);
      } catch (error) {
        console.error('Error fetching videos', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) return <p>Loading videos...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Uploaded Videos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {videos.map((video, idx) => (
          <video
            key={idx}
            src={video.url}
            controls
            className="w-full rounded shadow-md"
          />
        ))}
      </div>
    </div>
  );
};

export default CloudinaryVideoGallery;
