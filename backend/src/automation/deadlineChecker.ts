import { getPrisma } from '../config/database';
import { NotificationService } from '../services/notification.service';
import { logger } from '../utils/logger';

export class DeadlineChecker {
  private notificationService = new NotificationService();

  async checkAllDeadlines() {
    try {
      const prisma = getPrisma();
      const now = new Date();

      const overdueActivities = await prisma.activity.findMany({
        where: {
          status: 'PENDING',
          dueDate: { lt: now }
        }
      });

      for (const activity of overdueActivities) {
        await prisma.activity.update({
          where: { id: activity.id },
          data: { status: 'MISSING' }
        });

        await this.notificationService.createNotification({
          userId: activity.userId,
          activityId: activity.id,
          type: 'IN_APP',
          title: 'Missed Deadline',
          message: `"${activity.title}" deadline has passed`
        });
      }

      logger.info(`Checked ${overdueActivities.length} overdue activities`);
    } catch (error) {
      logger.error('Error checking deadlines:', error);
    }
  }

  async getUpcomingDeadlines(userId: string, daysAhead: number = 7) {
    const prisma = getPrisma();
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    return prisma.activity.findMany({
      where: {
        userId,
        status: 'PENDING',
        dueDate: {
          gte: now,
          lte: futureDate
        }
      },
      include: { classroom: true },
      orderBy: { dueDate: 'asc' }
    });
  }
}
