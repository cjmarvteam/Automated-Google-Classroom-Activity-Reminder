// routes/index.ts - API route registration
// Maps all API endpoint groups to their respective route files
// All routes are prefixed with /api (set in server.ts)

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

// Public routes (no auth required)
router.use('/auth', authRoutes);

// Protected routes (require valid JWT token)
router.use('/classrooms', authenticate, classroomRoutes);
router.use('/activities', authenticate, activityRoutes);
router.use('/notifications', authenticate, notificationRoutes);
router.use('/preferences', authenticate, preferenceRoutes);

// Dashboard endpoint (returns aggregated stats)
router.get('/dashboard', authenticate, dashboardController.getDashboard);

export default router;
