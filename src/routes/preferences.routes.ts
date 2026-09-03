import { Router } from 'express';
import { PreferencesController } from '../controllers/preferences.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const preferencesController = new PreferencesController();

router.use(authenticate);

router.get('/', preferencesController.getPreferences);
router.put('/', preferencesController.updatePreferences);

export default router;