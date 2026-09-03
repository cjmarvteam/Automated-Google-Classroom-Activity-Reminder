import { Router } from 'express';
import { PreferenceController } from '../controllers/preference.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { preferenceSchema } from '../validators/preference.validator';

const router = Router();
const preferenceController = new PreferenceController();

router.use(authenticate);

router.get('/', preferenceController.getPreferences);
router.put('/', validate(preferenceSchema), preferenceController.updatePreferences);

export default router;
