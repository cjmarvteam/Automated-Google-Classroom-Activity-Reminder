import nodemailer from 'nodemailer';
import { getPrisma } from '../config/database';
import { logger } from '../utils/logger';

export class NotificationService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async createNotification(data: any) {
    const prisma = getPrisma();
    const notification = await prisma.notification.create({ data });

    const user = await prisma.user.findUnique({
      where: { id: data.userId },
      include: { preferences: true }
    });

    if (user?.preferences?.emailNotifications) {
      await this.sendEmail(user.email, data.title, data.message);
    }

    return notification;
  }

  async getNotifications(userId: string) {
    const prisma = getPrisma();
    return prisma.notification.findMany({
      where: { userId },
      include: { activity: true },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  }

  async getUnreadCount(userId: string) {
    const prisma = getPrisma();
    return prisma.notification.count({
      where: { userId, read: false }
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    const prisma = getPrisma();
    return prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { read: true }
    });
  }

  async markAllAsRead(userId: string) {
    const prisma = getPrisma();
    return prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true }
    });
  }

  async deleteNotification(notificationId: string, userId: string) {
    const prisma = getPrisma();
    return prisma.notification.deleteMany({
      where: { id: notificationId, userId }
    });
  }

  private async sendEmail(to: string, subject: string, text: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
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
