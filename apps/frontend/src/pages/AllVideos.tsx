import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

type Video = {
  url: string;
  public_id: string;
};

const CloudinaryVideoGallery = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const { courseId } = useParams();
  const courseName = decodeURIComponent(courseId || '');

  useEffect(() => {
    const fetchVideos = async (courseName : any) => {
      try {
        const res = await axios.get<{ videos: Video[] }>('http://localhost:3000/api/videos/getCloudinaryVideos'
        //   , {
        //   params: { folder: courseName }
        
        // }
      );        
        setVideos(res.data.videos);
      } catch (error) {
        console.error('Error fetching videos', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos(courseName);
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
