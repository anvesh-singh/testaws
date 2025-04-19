import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

// POST /api/videos/upload
export const uploadVideo = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No video file uploaded.' });
  }
  const videoUrl = `/videos/${req.file.filename}`;
  res.status(201).json({ message: 'Video uploaded successfully', url: videoUrl });
};

// GET /api/videos
export const getAllVideos = (req: Request, res: Response) => {
  fs.readdir(UPLOAD_DIR, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read videos directory.' });
    }

    const videoUrls = files.map(filename => `/videos/${filename}`);
    res.json({ videos: videoUrls });
  });
};
