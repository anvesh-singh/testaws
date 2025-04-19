// server/upload.ts
import multer from 'multer';
import path from 'path';

const PORT = 3000;

// Store uploaded videos in 'uploads/' folder
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  }
});
export const upload = multer({ storage });
