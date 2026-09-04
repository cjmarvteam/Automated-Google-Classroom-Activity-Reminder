// notification.service.ts - Handles notification creation, retrieval, and email sending
// Notifications are created by the reminder scheduler and sent via in-app + email (if enabled)

import nodemailer from 'nodemailer';
import { getPrisma } from '../config/database';
import { logger } from '../utils/logger';

export class NotificationService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Initialize email transporter using SMTP credentials from .env
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,  // Use TLS (port 587), not SSL (port 465)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  /**
   * Create a new notification and optionally send email
   * 1. Save notification to database
   * 2. Check if user has email notifications enabled
   * 3. If yes, send email notification
   */
  async createNotification(data: any) {
    const prisma = getPrisma();
    const notification = await prisma.notification.create({ data });

    // Check user's notification preferences
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
      include: { preferences: true }
    });

    // Send email if user has enabled email notifications
    if (user?.preferences?.emailNotifications) {
      await this.sendEmail(user.email, data.title, data.message);
    }

    return notification;
  }

  /**
   * Get all notifications for a user (most recent first)
   * Limited to 50 notifications to avoid performance issues
   * Includes related activity data for display
   */
  async getNotifications(userId: string) {
    const prisma = getPrisma();
    return prisma.notification.findMany({
      where: { userId },
      include: { activity: true },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  }

  /**
   * Get count of unread notifications
   * Used by the navbar badge to show unread count
   */
  async getUnreadCount(userId: string) {
    const prisma = getPrisma();
    return prisma.notification.count({
      where: { userId, read: false }
    });
  }

  /**
   * Mark a single notification as read
   * Uses updateMany to ensure userId matches
   */
  async markAsRead(notificationId: string, userId: string) {
    const prisma = getPrisma();
    return prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { read: true }
    });
  }

  /**
   * Mark all notifications for a user as read
   * Used by "Mark all as read" button
   */
  async markAllAsRead(userId: string) {
    const prisma = getPrisma();
    return prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true }
    });
  }

  /**
   * Delete a single notification
   */
  async deleteNotification(notificationId: string, userId: string) {
    const prisma = getPrisma();
    return prisma.notification.deleteMany({
      where: { id: notificationId, userId }
    });
  }

  /**
   * Send email notification via SMTP
   * Email subject is prefixed with "Classroom Reminder:" for easy filtering
   */
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
