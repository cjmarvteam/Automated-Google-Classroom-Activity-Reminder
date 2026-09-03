import mongoose, { Schema } from 'mongoose';
import { IActivity } from '../types';

const activitySchema = new Schema<IActivity>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  classroom: { type: Schema.Types.ObjectId, ref: 'Classroom', required: true },
  googleActivityId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  type: { 
    type: String, 
    enum: ['ASSIGNMENT', 'QUIZ', 'QUESTION', 'MATERIAL', 'TOPIC'],
    required: true 
  },
  dueDate: { type: Date },
  dueTime: { type: Date },
  maxPoints: { type: Number },
  status: { 
    type: String, 
    enum: ['PENDING', 'SUBMITTED', 'LATE', 'MISSING'],
    default: 'PENDING' 
  },
  alternateLink: { type: String }
}, { timestamps: true });

activitySchema.index({ user: 1, googleActivityId: 1 }, { unique: true });
activitySchema.index({ user: 1, dueDate: 1 });

export const Activity = mongoose.model<IActivity>('Activity', activitySchema);