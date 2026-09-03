import { Router } from 'express';
import { ActivityController } from '../controllers/activity.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { activitySchema } from '../validators/activity.validator';

const router = Router();
const activityController = new ActivityController();

router.use(authenticate);

router.get('/', activityController.getActivities);
router.get('/upcoming', activityController.getUpcomingActivities);
router.get('/overdue', activityController.getOverdueActivities);
router.get('/:id', activityController.getActivityById);
router.post('/', validate(activitySchema), activityController.createActivity);
router.put('/:id', activityController.updateActivity);
router.delete('/:id', activityController.deleteActivity);
router.post('/sync/:classroomId', activityController.syncFromGoogle);

export default router;
