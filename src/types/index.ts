import { Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  avatar?: string;
  googleId: string;
  googleTokens: {
    access_token: string;
    refresh_token: string;
    scope: string;
    token_type: string;
    expiry_date: number;
  };
  preferences: {
    emailNotifications: boolean;
    studyReminders: boolean;
    reminderTime: string;
    timezone: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IClassroom extends Document {
  user: string;
  googleClassroomId: string;
  name: string;
  section?: string;
  description?: string;
  alternateLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IActivity extends Document {
  user: string;
  classroom: string;
  googleActivityId: string;
  title: string;
  description?: string;
  type: 'ASSIGNMENT' | 'QUIZ' | 'QUESTION' | 'MATERIAL' | 'TOPIC';
  dueDate?: Date;
  dueTime?: Date;
  maxPoints?: number;
  status: 'PENDING' | 'SUBMITTED' | 'LATE' | 'MISSING';
  alternateLink?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPreference extends Document {
  user: string;
  emailNotifications: boolean;
  studyReminders: boolean;
  reminderTime: string;
  timezone: string;
  reminderDaysBefore: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotification extends Document {
  user: string;
  activity: string;
  type: 'EMAIL' | 'PUSH' | 'IN_APP';
  title: string;
  message: string;
  sentAt: Date;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface JwtPayload {
  userId: string;
  email: string;
}