"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
// server/upload.ts
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const PORT = 3000;
// Store uploaded videos in 'uploads/' folder
const storage = multer_1.default.diskStorage({
    destination: 'uploads/',
    filename: (_, file, cb) => {
        cb(null, Date.now() + path_1.default.extname(file.originalname)); // unique filename
    }
});
exports.upload = (0, multer_1.default)({ storage });
