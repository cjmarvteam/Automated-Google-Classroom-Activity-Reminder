import { getPrisma } from '../config/database';
import { GoogleClassroomService } from './googleClassroom.service';
import { logger } from '../utils/logger';

export class ActivityService {
  private googleClassroomService = new GoogleClassroomService();

  async getActivitiesByUser(userId: string) {
    const prisma = getPrisma();
    return prisma.activity.findMany({
      where: { userId },
      include: { classroom: true },
      orderBy: { dueDate: 'asc' }
    });
  }

  async getUpcomingActivities(userId: string) {
    const prisma = getPrisma();
    const now = new Date();
    return prisma.activity.findMany({
      where: {
        userId,
        dueDate: { gte: now },
        status: 'PENDING'
      },
      include: { classroom: true },
      orderBy: { dueDate: 'asc' }
    });
  }

  async getOverdueActivities(userId: string) {
    const prisma = getPrisma();
    const now = new Date();
    return prisma.activity.findMany({
      where: {
        userId,
        dueDate: { lt: now },
        status: 'PENDING'
      },
      include: { classroom: true }
    });
  }

  async getActivityById(activityId: string, userId: string) {
    const prisma = getPrisma();
    return prisma.activity.findFirst({
      where: { id: activityId, userId },
      include: { classroom: true }
    });
  }

  async createActivity(data: any, userId: string) {
    const prisma = getPrisma();
    return prisma.activity.create({
      data: { ...data, userId },
      include: { classroom: true }
    });
  }

  async updateActivity(activityId: string, data: any, userId: string) {
    const prisma = getPrisma();
    return prisma.activity.updateMany({
      where: { id: activityId, userId },
      data
    });
  }

  async deleteActivity(activityId: string, userId: string) {
    const prisma = getPrisma();
    return prisma.activity.deleteMany({
      where: { id: activityId, userId }
    });
  }

  async syncFromGoogle(classroomId: string, userId: string) {
    try {
      const prisma = getPrisma();

      const classroom = await prisma.classroom.findFirst({
        where: { id: classroomId, userId }
      });

      if (!classroom) {
        throw new Error('Classroom not found');
      }

      const coursework = await this.googleClassroomService.getCourseWork(userId, classroom.googleClassroomId);

      for (const work of coursework) {
        const dueDate = work.dueDate
          ? new Date(`${work.dueDate.year}-${work.dueDate.month}-${work.dueDate.day}`)
          : null;

        await prisma.activity.upsert({
          where: {
            userId_googleActivityId: {
              userId,
              googleActivityId: work.id!
            }
          },
          update: {
            title: work.title || 'Untitled Activity',
            description: work.description || null,
            type: this.mapWorkType(work.workType),
            dueDate,
            maxPoints: work.maxPoints ? Number(work.maxPoints) : null,
            alternateLink: work.alternateLink || null
          },
          create: {
            userId,
            classroomId,
            googleActivityId: work.id!,
            title: work.title || 'Untitled Activity',
            description: work.description || null,
            type: this.mapWorkType(work.workType),
            dueDate,
            maxPoints: work.maxPoints ? Number(work.maxPoints) : null,
            alternateLink: work.alternateLink || null
          }
        });
      }

      return await this.getActivitiesByUser(userId);
    } catch (error) {
      logger.error('Error syncing activities:', error);
      throw error;
    }
  }

  private mapWorkType(workType: string | undefined | null): string {
    const typeMap: Record<string, string> = {
      'ASSIGNMENT': 'ASSIGNMENT',
      'SHORT_ANSWER_QUESTION': 'QUESTION',
      'MULTIPLE_CHOICE_QUESTION': 'QUIZ'
    };
    return typeMap[workType || ''] || 'ASSIGNMENT';
  }
}
