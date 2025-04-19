import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
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
        sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
        completed: Boolean,
        joinedAt: Date,
      },
    ],
    roles: { type: [String], default: ['learner'] }, // e.g., ['admin', 'instructor', 'learner']
  },
  { timestamps: true }
);

export const userModel = mongoose.model('User', UserSchema);
