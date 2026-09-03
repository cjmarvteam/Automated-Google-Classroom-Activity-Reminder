import mongoose, { Schema } from 'mongoose';
import { IClassroom } from '../types';

const classroomSchema = new Schema<IClassroom>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  googleClassroomId: { type: String, required: true },
  name: { type: String, required: true },
  section: { type: String },
  description: { type: String },
  alternateLink: { type: String }
}, { timestamps: true });

classroomSchema.index({ user: 1, googleClassroomId: 1 }, { unique: true });

export const Classroom = mongoose.model<IClassroom>('Classroom', classroomSchema);