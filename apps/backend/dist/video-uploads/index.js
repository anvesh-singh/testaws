"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCloudinaryVideos = exports.uploadVideoOnCloudinary = void 0;
//@ts-nocheck
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const uploadVideoOnCloudinary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { folder } = req.body;
        const uploadDir = path_1.default.join(__dirname, `../../uploads/${folder}`);
        console.log('Reading files from:', uploadDir);
        const files = fs_1.default.readdirSync(uploadDir);
        if (files.length === 0) {
            return res.status(400).json({ error: 'No files found in uploads folder.' });
        }
        files.sort((a, b) => {
            return fs_1.default.statSync(path_1.default.join(uploadDir, b)).ctimeMs - fs_1.default.statSync(path_1.default.join(uploadDir, a)).ctimeMs;
        });
        const firstFile = files[0];
        const filePath = path_1.default.join(uploadDir, firstFile);
        console.log('Uploading file:', filePath);
        const result = yield cloudinary_1.v2.uploader.upload(filePath, {
            resource_type: 'video',
            folder: 'lectures',
        });
        console.log('Upload success:', result.secure_url);
        fs_1.default.unlinkSync(filePath);
        res.status(200).json({
            message: 'Video uploaded successfully',
            url: result.secure_url,
        });
    }
    catch (err) {
        console.error('Upload error:', err); // THIS is the important part to check
        res.status(500).json({ error: 'Failed to upload video' });
    }
});
exports.uploadVideoOnCloudinary = uploadVideoOnCloudinary;
const getAllCloudinaryVideos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const course = req.params["folder"];
    try {
        const result = yield cloudinary_1.v2.search
            .expression(`folder:lectures/${course}`) // your cloudinary folder
            .sort_by('created_at', 'asc')
            .execute();
        const videos = result.resources.map((file) => ({
            url: file.secure_url,
            public_id: file.public_id,
        }));
        res.status(200).json({ videos });
    }
    catch (err) {
        console.error('Fetch Cloudinary error:', err);
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
});
exports.getAllCloudinaryVideos = getAllCloudinaryVideos;
// Optimize delivery by resizing and applying auto-format and auto-quality
const optimizeUrl = cloudinary_1.v2.url('shoes', {
    fetch_format: 'auto',
    quality: 'auto'
});
console.log(optimizeUrl);
// Transform the image: auto-crop to square aspect_ratio
const autoCropUrl = cloudinary_1.v2.url('shoes', {
    crop: 'auto',
    gravity: 'auto',
    width: 500,
    height: 500,
});
console.log(autoCropUrl);
