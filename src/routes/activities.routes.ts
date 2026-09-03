import { Router } from 'express';
import { ActivitiesController } from '../controllers/activities.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { activitySchema, activityIdSchema } from '../validators/activities.validator';

const router = Router();
const activitiesController = new ActivitiesController();

router.use(authenticate);

router.get('/', activitiesController.getActivities);
router.get('/upcoming', activitiesController.getUpcomingActivities);
router.get('/overdue', activitiesController.getOverdueActivities);
router.get('/:id', validate(activityIdSchema), activitiesController.getActivityById);
router.post('/', validate(activitySchema), activitiesController.createActivity);
router.put('/:id', validate(activityIdSchema), activitiesController.updateActivity);
router.delete('/:id', validate(activityIdSchema), activitiesController.deleteActivity);
router.post('/sync/:classroomId', activitiesController.syncFromGoogle);

export default router;