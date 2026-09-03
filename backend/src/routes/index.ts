import { Router } from 'express';
import authRoutes from './auth.routes';
import classroomRoutes from './classroom.routes';
import activityRoutes from './activity.routes';
import notificationRoutes from './notification.routes';
import preferenceRoutes from './preference.routes';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const dashboardController = new DashboardController();

router.use('/auth', authRoutes);
router.use('/classrooms', classroomRoutes);
router.use('/activities', activityRoutes);
router.use('/notifications', notificationRoutes);
router.use('/preferences', preferenceRoutes);
router.get('/dashboard', authenticate, dashboardController.getDashboard);

export default router;
