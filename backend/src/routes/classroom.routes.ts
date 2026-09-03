import { Router } from 'express';
import { ClassroomController } from '../controllers/classroom.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { classroomSchema } from '../validators/classroom.validator';

const router = Router();
const classroomController = new ClassroomController();

router.use(authenticate);

router.get('/', classroomController.getClassrooms);
router.get('/:id', classroomController.getClassroomById);
router.post('/', validate(classroomSchema), classroomController.createClassroom);
router.put('/:id', classroomController.updateClassroom);
router.delete('/:id', classroomController.deleteClassroom);
router.post('/sync', classroomController.syncFromGoogle);

export default router;
