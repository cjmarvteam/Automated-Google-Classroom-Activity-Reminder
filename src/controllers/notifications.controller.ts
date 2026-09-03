import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { NotificationsService } from '../services/notifications.service';
import { logger } from '../utils/logger.util';

export class NotificationsController {
  private notificationsService = new NotificationsService();

  getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const notifications = await this.notificationsService.getNotifications(req.userId!);
      res.json({ notifications });
    } catch (error) {
      logger.error('Get notifications error:', error);
      res.status(500).json({ error: 'Failed to get notifications' });
    }
  };

  getUnreadCount = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const count = await this.notificationsService.getUnreadCount(req.userId!);
      res.json({ count });
    } catch (error) {
      logger.error('Get unread count error:', error);
      res.status(500).json({ error: 'Failed to get unread count' });
    }
  };

  markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      await this.notificationsService.markAsRead(req.params.id, req.userId!);
      res.json({ message: 'Notification marked as read' });
    } catch (error) {
      logger.error('Mark as read error:', error);
      res.status(500).json({ error: 'Failed to mark notification as read' });
    }
  };

  markAllAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      await this.notificationsService.markAllAsRead(req.userId!);
      res.json({ message: 'All notifications marked as read' });
    } catch (error) {
      logger.error('Mark all as read error:', error);
      res.status(500).json({ error: 'Failed to mark all notifications as read' });
    }
  };

  deleteNotification = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      await this.notificationsService.deleteNotification(req.params.id, req.userId!);
      res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
      logger.error('Delete notification error:', error);
      res.status(500).json({ error: 'Failed to delete notification' });
    }
  };
}