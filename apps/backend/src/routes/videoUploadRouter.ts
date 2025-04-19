import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadVideo, getAllVideos } from '../controllers/videoController';
import { getAllCloudinaryVideos, uploadVideoOnCloudinary } from '../video-uploads';

const videoRouter = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Route to upload a video
//@ts-ignore
videoRouter.post('/upload', upload.single('video'), uploadVideo);
//@ts-ignore
videoRouter.post('/uploadCloudinary', uploadVideoOnCloudinary);
videoRouter.get('/getCloudinaryVideos', getAllCloudinaryVideos);

// Route to get all video URLs
videoRouter.get('/', getAllVideos);

export default videoRouter;
