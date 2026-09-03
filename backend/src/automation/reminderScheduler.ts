import cron from 'node-cron';
import { getPrisma } from '../config/database';
import { NotificationService } from '../services/notification.service';
import { logger } from '../utils/logger';

export class ReminderScheduler {
  private notificationService = new NotificationService();
  private isRunning = false;

  start() {
    if (this.isRunning) return;

    cron.schedule('0 9 * * *', async () => {
      logger.info('Running daily reminder check...');
      await this.sendDailyReminders();
    });

    cron.schedule('0 * * * *', async () => {
      await this.checkOverdueActivities();
    });

    this.isRunning = true;
    logger.info('Reminder scheduler started');
  }

  async sendDailyReminders() {
    try {
      const prisma = getPrisma();
      const now = new Date();

      const users = await prisma.user.findMany({
        where: { preferences: { studyReminders: true } },
        include: { preferences: true }
      });

      for (const user of users) {
        const activities = await prisma.activity.findMany({
          where: {
            userId: user.id,
            status: 'PENDING',
            dueDate: { gte: now }
          },
          orderBy: { dueDate: 'asc' }
        });

        for (const activity of activities) {
          const daysUntil = this.getDaysUntil(activity.dueDate!);
          const reminderDays = user.preferences?.reminderDaysBefore || 1;

          if (daysUntil <= reminderDays) {
            await this.notificationService.createNotification({
              userId: user.id,
              activityId: activity.id,
              type: 'IN_APP',
              title: 'Upcoming Deadline',
              message: `"${activity.title}" is due in ${daysUntil} day(s)`
            });
          }
        }
      }
    } catch (error) {
      logger.error('Error sending daily reminders:', error);
    }
  }

  async checkOverdueActivities() {
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
    } catch (error) {
      logger.error('Error checking overdue activities:', error);
    }
  }

  private getDaysUntil(date: Date): number {
    const now = new Date();
    const target = new Date(date);
    const diffTime = target.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
