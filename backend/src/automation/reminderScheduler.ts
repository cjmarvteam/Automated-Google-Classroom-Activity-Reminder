// reminderScheduler.ts - Automation scheduler for sending reminders and checking overdue activities
// Uses node-cron for scheduled tasks:
//   - Daily at 9:00 AM: Sends reminders for upcoming deadlines
//   - Every hour: Checks and marks overdue activities as MISSING

import cron from 'node-cron';
import { getPrisma } from '../config/database';
import { NotificationService } from '../services/notification.service';
import { logger } from '../utils/logger';

export class ReminderScheduler {
  private notificationService = new NotificationService();
  private isRunning = false;

  /**
   * Start the scheduler
   * Prevents duplicate schedulers from being started
   */
  start() {
    if (this.isRunning) return;

    // Schedule 1: Daily reminders at 9:00 AM
    // Cron expression: '0 9 * * *' = at 9:00 every day
    cron.schedule('0 9 * * *', async () => {
      logger.info('Running daily reminder check...');
      await this.sendDailyReminders();
    });

    // Schedule 2: Check for overdue activities every hour
    // Cron expression: '0 * * * *' = at minute 0 of every hour
    cron.schedule('0 * * * *', async () => {
      await this.checkOverdueActivities();
    });

    this.isRunning = true;
    logger.info('Reminder scheduler started');
  }

  /**
   * Send daily reminders for upcoming deadlines
   * For each user with study reminders enabled:
   * 1. Find all PENDING activities with future due dates
   * 2. Calculate days until due date
   * 3. If within user's reminder threshold, create an in-app notification
   */
  async sendDailyReminders() {
    try {
      const prisma = getPrisma();
      const now = new Date();

      // Get all users who have study reminders enabled
      const users = await prisma.user.findMany({
        where: { preferences: { studyReminders: true } },
        include: { preferences: true }
      });

      for (const user of users) {
        // Get all pending activities for this user
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
          // User can configure how many days before to remind (default: 1 day)
          const reminderDays = user.preferences?.reminderDaysBefore || 1;

          // Only notify if deadline is within the reminder window
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

  /**
   * Check for overdue activities every hour
   * Finds all PENDING activities with past due dates and:
   * 1. Updates their status to MISSING (past deadline)
   * 2. Creates a notification for the user
   */
  async checkOverdueActivities() {
    try {
      const prisma = getPrisma();
      const now = new Date();

      // Find all pending activities that are past their due date
      const overdueActivities = await prisma.activity.findMany({
        where: {
          status: 'PENDING',
          dueDate: { lt: now }
        }
      });

      for (const activity of overdueActivities) {
        // Mark activity as MISSING (missed deadline)
        await prisma.activity.update({
          where: { id: activity.id },
          data: { status: 'MISSING' }
        });

        // Notify user about the missed deadline
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

  /**
   * Calculate days remaining until a given date
   * Returns positive number for future dates, negative for past dates
   */
  private getDaysUntil(date: Date): number {
    const now = new Date();
    const target = new Date(date);
    const diffTime = target.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert ms to days
  }
}
