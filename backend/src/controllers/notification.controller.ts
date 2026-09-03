import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { NotificationService } from '../services/notification.service';
import { logger } from '../utils/logger';

export class NotificationController {
  private notificationService = new NotificationService();

  getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const notifications = await this.notificationService.getNotifications(req.userId!);
      res.json({ notifications });
    } catch (error) {
      logger.error('Get notifications error:', error);
      res.status(500).json({ error: 'Failed to get notifications' });
    }
  };

  getUnreadCount = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const count = await this.notificationService.getUnreadCount(req.userId!);
      res.json({ count });
    } catch (error) {
      logger.error('Get unread count error:', error);
      res.status(500).json({ error: 'Failed to get unread count' });
    }
  };

  markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      await this.notificationService.markAsRead(req.params.id, req.userId!);
      res.json({ message: 'Notification marked as read' });
    } catch (error) {
      logger.error('Mark as read error:', error);
      res.status(500).json({ error: 'Failed to mark notification as read' });
    }
  };

  markAllAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      await this.notificationService.markAllAsRead(req.userId!);
      res.json({ message: 'All notifications marked as read' });
    } catch (error) {
      logger.error('Mark all as read error:', error);
      res.status(500).json({ error: 'Failed to mark all notifications as read' });
    }
  };

  deleteNotification = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      await this.notificationService.deleteNotification(req.params.id, req.userId!);
      res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
      logger.error('Delete notification error:', error);
      res.status(500).json({ error: 'Failed to delete notification' });
    }
  };
}
