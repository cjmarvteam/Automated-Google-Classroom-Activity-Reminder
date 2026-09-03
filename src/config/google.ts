import { google } from 'googleapis';
import { environment } from './environment';

export const oauth2Client = new google.auth.OAuth2(
  environment.GOOGLE_CLIENT_ID,
  environment.GOOGLE_CLIENT_SECRET,
  environment.GOOGLE_REDIRECT_URI
);

export const googleClassroom = google.classroom({ version: 'v1', auth: oauth2Client });

export const SCOPES = [
  'https://www.googleapis.com/auth/classroom.courses.readonly',
  'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
  'https://www.googleapis.com/auth/classroom.notifications.readonly',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];