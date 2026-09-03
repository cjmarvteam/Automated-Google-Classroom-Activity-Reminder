import { Router } from 'express';
import { NotificationsController } from '../controllers/notifications.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const notificationsController = new NotificationsController();

router.use(authenticate);

router.get('/', notificationsController.getNotifications);
router.get('/unread', notificationsController.getUnreadCount);
router.put('/:id/read', notificationsController.markAsRead);
router.put('/read-all', notificationsController.markAllAsRead);
router.delete('/:id', notificationsController.deleteNotification);

export default router;