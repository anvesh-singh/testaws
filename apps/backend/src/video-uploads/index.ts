//@ts-nocheck
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import dotenv from "dotenv";
import path from "path";
dotenv.config();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadVideoOnCloudinary = async (req: Request, res: Response) => {
    try {
      const {folder} = req.body;
      const uploadDir = path.join(__dirname, `../../uploads/${folder}`);
      console.log('Reading files from:', uploadDir);
  
      const files = fs.readdirSync(uploadDir);
      if (files.length === 0) {
        return res.status(400).json({ error: 'No files found in uploads folder.' });
      }
  
      files.sort((a, b) => {
        return fs.statSync(path.join(uploadDir, b)).ctimeMs - fs.statSync(path.join(uploadDir, a)).ctimeMs;
      });
  
      const firstFile = files[0];
      const filePath = path.join(uploadDir, firstFile);
      console.log('Uploading file:', filePath);
  
      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: 'video',
        folder: 'lectures',
      });
  
      console.log('Upload success:', result.secure_url);
  
      fs.unlinkSync(filePath);
  
      res.status(200).json({
        message: 'Video uploaded successfully',
        url: result.secure_url,
      });
    } catch (err) {
      console.error('Upload error:', err);  // THIS is the important part to check
      res.status(500).json({ error: 'Failed to upload video' });
    }
  };

  export const getAllCloudinaryVideos = async (req, res) => {
    const course = req.params["folder"];
    try {
      const result = await cloudinary.search
        .expression(`folder:lectures/${course}`) // your cloudinary folder
        .sort_by('created_at', 'asc')
        .execute();
  
      const videos = result.resources.map((file) => ({
        url: file.secure_url,
        public_id: file.public_id,
      }));
  
      res.status(200).json({ videos });
    } catch (err) {
      console.error('Fetch Cloudinary error:', err);
      res.status(500).json({ error: 'Failed to fetch videos' });
    }
  };
  
    
    
    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url('shoes', {
        fetch_format: 'auto',
        quality: 'auto'
    });
    
    console.log(optimizeUrl);
    
    // Transform the image: auto-crop to square aspect_ratio
    const autoCropUrl = cloudinary.url('shoes', {
        crop: 'auto',
        gravity: 'auto',
        width: 500,
        height: 500,
    });
    
    console.log(autoCropUrl);    