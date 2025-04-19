"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllVideos = exports.uploadVideo = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const UPLOAD_DIR = path_1.default.join(__dirname, '..', 'uploads');
// POST /api/videos/upload
const uploadVideo = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No video file uploaded.' });
    }
    const videoUrl = `/videos/${req.file.filename}`;
    res.status(201).json({ message: 'Video uploaded successfully', url: videoUrl });
};
exports.uploadVideo = uploadVideo;
// GET /api/videos
const getAllVideos = (req, res) => {
    fs_1.default.readdir(UPLOAD_DIR, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read videos directory.' });
        }
        const videoUrls = files.map(filename => `/videos/${filename}`);
        res.json({ videos: videoUrls });
    });
};
exports.getAllVideos = getAllVideos;
