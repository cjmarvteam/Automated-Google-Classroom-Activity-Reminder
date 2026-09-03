import { getPrisma } from '../config/database';
import { NotificationService } from './notification.service';
import { logger } from '../utils/logger';

export class DashboardService {
  private notificationService = new NotificationService();

  async getDashboardStats(userId: string) {
    const prisma = getPrisma();
    const now = new Date();

    const [totalActivities, pendingActivities, overdueActivities, totalClassrooms] = await Promise.all([
      prisma.activity.count({ where: { userId } }),
      prisma.activity.count({ where: { userId, status: 'PENDING' } }),
      prisma.activity.count({
        where: { userId, status: 'PENDING', dueDate: { lt: now } }
      }),
      prisma.classroom.count({ where: { userId } })
    ]);

    return {
      totalActivities,
      pendingActivities,
      overdueActivities,
      totalClassrooms
    };
  }

  async getUpcomingActivities(userId: string, limit: number = 5) {
    const prisma = getPrisma();
    const now = new Date();

    return prisma.activity.findMany({
      where: {
        userId,
        status: 'PENDING',
        dueDate: { gte: now }
      },
      include: { classroom: true },
      orderBy: { dueDate: 'asc' },
      take: limit
    });
  }

  async getRecentNotifications(userId: string, limit: number = 5) {
    const prisma = getPrisma();

    return prisma.notification.findMany({
      where: { userId },
      include: { activity: true },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }
}
