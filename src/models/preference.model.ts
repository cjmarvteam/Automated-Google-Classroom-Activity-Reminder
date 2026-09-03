import mongoose, { Schema } from 'mongoose';
import { IPreference } from '../types';

const preferenceSchema = new Schema<IPreference>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  emailNotifications: { type: Boolean, default: true },
  studyReminders: { type: Boolean, default: true },
  reminderTime: { type: String, default: '09:00' },
  timezone: { type: String, default: 'Asia/Manila' },
  reminderDaysBefore: { type: Number, default: 1 }
}, { timestamps: true });

export const Preference = mongoose.model<IPreference>('Preference', preferenceSchema);