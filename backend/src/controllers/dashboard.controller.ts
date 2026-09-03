import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { getPrisma } from '../config/database';
import { logger } from '../utils/logger';

export class DashboardController {
  getDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const prisma = getPrisma();
      const userId = req.userId!;

      const now = new Date();

      const [totalActivities, pendingActivities, overdueActivities, upcomingActivities, totalClassrooms, recentNotifications] = await Promise.all([
        prisma.activity.count({ where: { userId } }),
        prisma.activity.count({ where: { userId, status: 'PENDING' } }),
        prisma.activity.count({ where: { userId, status: 'PENDING', dueDate: { lt: now } } }),
        prisma.activity.findMany({
          where: { userId, status: 'PENDING', dueDate: { gte: now } },
          orderBy: { dueDate: 'asc' },
          take: 5,
          include: { classroom: true }
        }),
        prisma.classroom.count({ where: { userId } }),
        prisma.notification.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: { activity: true }
        })
      ]);

      res.json({
        stats: {
          totalActivities,
          pendingActivities,
          overdueActivities,
          totalClassrooms
        },
        upcomingActivities,
        recentNotifications
      });
    } catch (error) {
      logger.error('Get dashboard error:', error);
      res.status(500).json({ error: 'Failed to get dashboard' });
    }
  };
}
