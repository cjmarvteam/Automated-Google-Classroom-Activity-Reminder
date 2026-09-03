import { Activity } from '../models/activity.model';
import { User } from '../models/user.model';
import { NotificationsService } from './notifications.service';
import { logger } from '../utils/logger.util';
import { getDaysUntil } from '../utils/date.util';

export class StudyLogicService {
  private notificationsService = new NotificationsService();

  async getStudySchedule(userId: string) {
    const activities = await Activity.find({
      user: userId,
      status: 'PENDING',
      dueDate: { $gte: new Date() }
    }).sort({ dueDate: 1 });

    const schedule = activities.map(activity => {
      const daysUntil = getDaysUntil(activity.dueDate!);
      const urgency = this.calculateUrgency(daysUntil);
      
      return {
        activity,
        daysUntilDue: daysUntil,
        urgency,
        suggestedStudyDays: this.getSuggestedStudyDays(activity, daysUntil)
      };
    });

    return schedule;
  }

  async getStudyPriority(userId: string) {
    const activities = await Activity.find({
      user: userId,
      status: 'PENDING',
      dueDate: { $gte: new Date() }
    });

    const prioritized = activities
      .map(activity => {
        const daysUntil = getDaysUntil(activity.dueDate!);
        const score = this.calculatePriorityScore(activity, daysUntil);
        
        return {
          activity,
          priorityScore: score
        };
      })
      .sort((a, b) => b.priorityScore - a.priorityScore);

    return prioritized;
  }

  async sendSmartReminders(userId: string) {
    const activities = await Activity.find({
      user: userId,
      status: 'PENDING',
      dueDate: { $gte: new Date() }
    });

    const user = await User.findById(userId);

    for (const activity of activities) {
      const daysUntil = getDaysUntil(activity.dueDate!);
      const urgency = this.calculateUrgency(daysUntil);

      if (urgency === 'HIGH' || urgency === 'CRITICAL') {
        await this.notificationsService.createNotification({
          user: userId,
          activity: activity._id,
          type: 'IN_APP',
          title: `Study Reminder: ${activity.title}`,
          message: this.getUrgencyMessage(activity.title, daysUntil, urgency)
        });
      }
    }
  }

  private calculateUrgency(daysUntil: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (daysUntil <= 1) return 'CRITICAL';
    if (daysUntil <= 3) return 'HIGH';
    if (daysUntil <= 7) return 'MEDIUM';
    return 'LOW';
  }

  private calculatePriorityScore(activity: any, daysUntil: number): number {
    let score = 100;

    if (daysUntil <= 1) score += 50;
    else if (daysUntil <= 3) score += 30;
    else if (daysUntil <= 7) score += 10;

    if (activity.maxPoints) {
      score += Math.min(activity.maxPoints / 10, 20);
    }

    return score;
  }

  private getSuggestedStudyDays(activity: any, daysUntil: number): number {
    if (daysUntil <= 1) return 1;
    if (daysUntil <= 3) return 2;
    if (daysUntil <= 7) return Math.min(3, daysUntil);
    return Math.min(5, daysUntil);
  }

  private getUrgencyMessage(title: string, daysUntil: number, urgency: string): string {
    if (urgency === 'CRITICAL') {
      return `"${title}" is due ${daysUntil === 0 ? 'today' : 'tomorrow'}! Start studying now!`;
    }
    return `"${title}" is due in ${daysUntil} days. Start preparing!`;
  }
}