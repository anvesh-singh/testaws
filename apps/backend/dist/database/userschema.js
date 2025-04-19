"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String }, // optional if social login
    socialProvider: { type: String, enum: ['google', 'facebook', null] }, // helpful for validation
    avatarUrl: { type: String },
    bio: { type: String },
    skills: [String],
    interests: [String],
    badges: [String],
    sessionHistory: [
        {
            sessionId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Session' },
            completed: Boolean,
            joinedAt: Date,
        },
    ],
    roles: { type: [String], default: ['learner'] }, // e.g., ['admin', 'instructor', 'learner']
}, { timestamps: true });
exports.userModel = mongoose_1.default.model('User', UserSchema);
