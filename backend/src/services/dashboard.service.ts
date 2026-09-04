// dashboard.service.ts - Aggregates data for the dashboard view
// Returns stats (total/pending/overdue activities), upcoming activities, and recent notifications

import { getPrisma } from '../config/database';
import { NotificationService } from './notification.service';
import { logger } from '../utils/logger';

export class DashboardService {
  private notificationService = new NotificationService();

  /**
   * Get dashboard statistics for a user
   * Uses Promise.all for parallel database queries (faster than sequential)
   * Returns:
   * - totalActivities: All activities count
   * - pendingActivities: Activities not yet completed
   * - overdueActivities: PENDING activities past their due date
   * - totalClassrooms: Number of classrooms
   */
  async getDashboardStats(userId: string) {
    const prisma = getPrisma();
    const now = new Date();

    // Run all 4 queries in parallel for better performance
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

  /**
   * Get upcoming activities for the dashboard sidebar
   * Returns the next `limit` activities that are due in the future
   * Sorted by due date (soonest first)
   */
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

  /**
   * Get recent notifications for the dashboard
   * Returns the last `limit` notifications, most recent first
   */
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
