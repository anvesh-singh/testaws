"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const videoController_1 = require("../controllers/videoController");
const video_uploads_1 = require("../video-uploads");
const videoRouter = express_1.default.Router();
// Multer setup
const storage = multer_1.default.diskStorage({
    destination: 'uploads/',
    filename: (_, file, cb) => {
        const uniqueName = Date.now() + path_1.default.extname(file.originalname);
        cb(null, uniqueName);
    }
});
const upload = (0, multer_1.default)({ storage });
// Route to upload a video
//@ts-ignore
videoRouter.post('/upload', upload.single('video'), videoController_1.uploadVideo);
//@ts-ignore
videoRouter.post('/uploadCloudinary', video_uploads_1.uploadVideoOnCloudinary);
videoRouter.get('/getCloudinaryVideos', video_uploads_1.getAllCloudinaryVideos);
// Route to get all video URLs
videoRouter.get('/', videoController_1.getAllVideos);
exports.default = videoRouter;
