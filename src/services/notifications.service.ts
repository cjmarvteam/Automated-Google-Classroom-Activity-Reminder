import nodemailer from 'nodemailer';
import { Notification } from '../models/notification.model';
import { User } from '../models/user.model';
import { environment } from '../config/environment';
import { logger } from '../utils/logger.util';

export class NotificationsService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: environment.EMAIL_HOST,
      port: environment.EMAIL_PORT,
      secure: false,
      auth: {
        user: environment.EMAIL_USER,
        pass: environment.EMAIL_PASS
      }
    });
  }

  async createNotification(data: any) {
    const notification = await Notification.create(data);

    const user = await User.findById(data.user);
    if (user?.preferences?.emailNotifications) {
      await this.sendEmail(user.email, data.title, data.message);
    }

    return notification;
  }

  async getNotifications(userId: string) {
    return Notification.find({ user: userId })
      .populate('activity')
      .sort({ createdAt: -1 })
      .limit(50);
  }

  async getUnreadCount(userId: string) {
    return Notification.countDocuments({ user: userId, read: false });
  }

  async markAsRead(notificationId: string, userId: string) {
    return Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { read: true },
      { new: true }
    );
  }

  async markAllAsRead(userId: string) {
    return Notification.updateMany(
      { user: userId, read: false },
      { read: true }
    );
  }

  async deleteNotification(notificationId: string, userId: string) {
    return Notification.findOneAndDelete({ _id: notificationId, user: userId });
  }

  private async sendEmail(to: string, subject: string, text: string) {
    try {
      await this.transporter.sendMail({
        from: environment.EMAIL_USER,
        to,
        subject: `Classroom Reminder: ${subject}`,
        text
      });
      logger.info(`Email sent to ${to}`);
    } catch (error) {
      logger.error('Error sending email:', error);
    }
  }
}