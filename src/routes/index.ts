import { Router } from 'express';
import authRoutes from './auth.routes';
import classroomRoutes from './classroom.routes';
import activitiesRoutes from './activities.routes';
import preferencesRoutes from './preferences.routes';
import notificationsRoutes from './notifications.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/classrooms', classroomRoutes);
router.use('/activities', activitiesRoutes);
router.use('/preferences', preferencesRoutes);
router.use('/notifications', notificationsRoutes);

export default router;