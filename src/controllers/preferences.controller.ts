import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { PreferencesService } from '../services/preferences.service';
import { logger } from '../utils/logger.util';

export class PreferencesController {
  private preferencesService = new PreferencesService();

  getPreferences = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const preferences = await this.preferencesService.getPreferences(req.userId!);
      res.json({ preferences });
    } catch (error) {
      logger.error('Get preferences error:', error);
      res.status(500).json({ error: 'Failed to get preferences' });
    }
  };

  updatePreferences = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const preferences = await this.preferencesService.updatePreferences(req.userId!, req.body);
      res.json({ preferences });
    } catch (error) {
      logger.error('Update preferences error:', error);
      res.status(500).json({ error: 'Failed to update preferences' });
    }
  };
}