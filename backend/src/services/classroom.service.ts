import { getPrisma } from '../config/database';
import { GoogleClassroomService } from './googleClassroom.service';
import { logger } from '../utils/logger';

export class ClassroomService {
  private googleClassroomService = new GoogleClassroomService();

  async getClassroomsByUser(userId: string) {
    const prisma = getPrisma();
    return prisma.classroom.findMany({
      where: { userId },
      include: { _count: { select: { activities: true } } },
      orderBy: { name: 'asc' }
    });
  }

  async getClassroomById(classroomId: string, userId: string) {
    const prisma = getPrisma();
    return prisma.classroom.findFirst({
      where: { id: classroomId, userId },
      include: { activities: true }
    });
  }

  async createClassroom(data: any, userId: string) {
    const prisma = getPrisma();
    const googleClassroomId = data.googleClassroomId || `manual-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    return prisma.classroom.create({
      data: {
        name: data.name,
        section: data.section,
        description: data.description,
        alternateLink: data.alternateLink,
        googleClassroomId,
        userId
      }
    });
  }

  async updateClassroom(classroomId: string, data: any, userId: string) {
    const prisma = getPrisma();
    return prisma.classroom.updateMany({
      where: { id: classroomId, userId },
      data
    });
  }

  async deleteClassroom(classroomId: string, userId: string) {
    const prisma = getPrisma();
    return prisma.classroom.deleteMany({
      where: { id: classroomId, userId }
    });
  }

  async syncFromGoogle(userId: string) {
    try {
      await this.googleClassroomService.syncCourses(userId);
      return await this.getClassroomsByUser(userId);
    } catch (error) {
      logger.error('Error syncing classrooms:', error);
      throw error;
    }
  }
}
