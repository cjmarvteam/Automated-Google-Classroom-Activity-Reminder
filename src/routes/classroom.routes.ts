import { Router } from 'express';
import { ClassroomController } from '../controllers/classroom.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { classroomSchema, classroomIdSchema } from '../validators/classroom.validator';

const router = Router();
const classroomController = new ClassroomController();

router.use(authenticate);

router.get('/', classroomController.getClassrooms);
router.get('/:id', validate(classroomIdSchema), classroomController.getClassroomById);
router.post('/', validate(classroomSchema), classroomController.createClassroom);
router.put('/:id', validate(classroomIdSchema), classroomController.updateClassroom);
router.delete('/:id', validate(classroomIdSchema), classroomController.deleteClassroom);
router.post('/sync', classroomController.syncFromGoogle);

export default router;