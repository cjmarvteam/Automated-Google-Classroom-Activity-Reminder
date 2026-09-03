import cron from 'node-cron';
import { Activity } from '../models/activity.model';
import { User } from '../models/user.model';
import { NotificationsService } from './notifications.service';
import { logger } from '../utils/logger.util';
import { getDaysUntil } from '../utils/date.util';

export class AutomationService {
  private notificationsService = new NotificationsService();
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
    logger.info('Automation service started');
  }

  async sendDailyReminders() {
    try {
      const users = await User.find({ 'preferences.studyReminders': true });

      for (const user of users) {
        const activities = await Activity.find({
          user: user._id,
          status: 'PENDING',
          dueDate: { $gte: new Date() }
        }).sort({ dueDate: 1 });

        for (const activity of activities) {
          const daysUntil = getDaysUntil(activity.dueDate!);
          const reminderDays = (user.preferences as any).reminderDaysBefore || 1;

          if (daysUntil <= reminderDays) {
            await this.notificationsService.createNotification({
              user: user._id,
              activity: activity._id,
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
      const overdueActivities = await Activity.find({
        status: 'PENDING',
        dueDate: { $lt: new Date() }
      });

      for (const activity of overdueActivities) {
        activity.status = 'MISSING';
        await activity.save();

        await this.notificationsService.createNotification({
          user: activity.user,
          activity: activity._id,
          type: 'IN_APP',
          title: 'Missed Deadline',
          message: `"${activity.title}" deadline has passed`
        });
      }
    } catch (error) {
      logger.error('Error checking overdue activities:', error);
    }
  }
}