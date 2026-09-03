import { getPrisma } from '../config/database';
import { googleClassroom, oauth2Client } from '../config/google';
import { logger } from '../utils/logger';

export class GoogleClassroomService {
  async getCourses(userId: string) {
    try {
      const prisma = getPrisma();
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user?.accessToken) {
        throw new Error('No Google tokens found');
      }

      oauth2Client.setCredentials({
        access_token: user.accessToken,
        refresh_token: user.refreshToken
      });

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
      const prisma = getPrisma();
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user?.accessToken) {
        throw new Error('No Google tokens found');
      }

      oauth2Client.setCredentials({
        access_token: user.accessToken,
        refresh_token: user.refreshToken
      });

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
      const prisma = getPrisma();
      const courses = await this.getCourses(userId);

      for (const course of courses) {
        await prisma.classroom.upsert({
          where: {
            userId_googleClassroomId: {
              userId,
              googleClassroomId: course.id!
            }
          },
          update: {
            name: course.name || 'Untitled Course',
            section: course.section || null,
            description: course.description || null,
            alternateLink: course.alternateLink || null
          },
          create: {
            userId,
            googleClassroomId: course.id!,
            name: course.name || 'Untitled Course',
            section: course.section || null,
            description: course.description || null,
            alternateLink: course.alternateLink || null
          }
        });
      }

      return courses;
    } catch (error) {
      logger.error('Error syncing courses:', error);
      throw error;
    }
  }
}
