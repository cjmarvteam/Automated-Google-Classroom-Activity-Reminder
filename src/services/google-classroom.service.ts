import { googleClassroom, oauth2Client } from '../config/google';
import { User } from '../models/user.model';
import { Classroom } from '../models/classroom.model';
import { logger } from '../utils/logger.util';

export class GoogleClassroomService {
  async getCourses(userId: string) {
    try {
      const user = await User.findById(userId);
      if (!user?.googleTokens) {
        throw new Error('No Google tokens found');
      }

      oauth2Client.setCredentials(user.googleTokens);
      
      const response = await googleClassroom.courses.list({
        pageSize: 50,
        courseStates: ['ACTIVE']
      });

      return response.data.courses || [];
    } catch (error) {
      logger.error('Error fetching Google Classroom courses:', error);
      throw error;
    }
  }

  async getCourseWork(userId: string, courseId: string) {
    try {
      const user = await User.findById(userId);
      if (!user?.googleTokens) {
        throw new Error('No Google tokens found');
      }

      oauth2Client.setCredentials(user.googleTokens);
      
      const response = await googleClassroom.courses.courseWork.list({
        courseId,
        pageSize: 100
      });

      return response.data.courseWork || [];
    } catch (error) {
      logger.error('Error fetching Google Classroom course work:', error);
      throw error;
    }
  }

  async syncCourses(userId: string) {
    try {
      const courses = await this.getCourses(userId);
      
      for (const course of courses) {
        await Classroom.findOneAndUpdate(
          { user: userId, googleClassroomId: course.id },
          {
            user: userId,
            googleClassroomId: course.id,
            name: course.name || 'Untitled Course',
            section: course.section,
            description: course.description,
            alternateLink: course.alternateLink
          },
          { upsert: true, new: true }
        );
      }

      return courses;
    } catch (error) {
      logger.error('Error syncing courses:', error);
      throw error;
    }
  }
}