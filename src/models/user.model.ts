import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types';

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  avatar: { type: String },
  googleId: { type: String, required: true, unique: true },
  googleTokens: {
    access_token: { type: String, required: true },
    refresh_token: { type: String, required: true },
    scope: { type: String },
    token_type: { type: String },
    expiry_date: { type: Number }
  },
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    studyReminders: { type: Boolean, default: true },
    reminderTime: { type: String, default: '09:00' },
    timezone: { type: String, default: 'Asia/Manila' }
  }
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', userSchema);