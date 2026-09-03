import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { PreferenceService } from '../services/preference.service';
import { logger } from '../utils/logger';

export class PreferenceController {
  private preferenceService = new PreferenceService();

  getPreferences = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const preferences = await this.preferenceService.getPreferences(req.userId!);
      res.json({ preferences });
    } catch (error) {
      logger.error('Get preferences error:', error);
      res.status(500).json({ error: 'Failed to get preferences' });
    }
  };

  updatePreferences = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const preferences = await this.preferenceService.updatePreferences(req.userId!, req.body);
      res.json({ preferences });
    } catch (error) {
      logger.error('Update preferences error:', error);
      res.status(500).json({ error: 'Failed to update preferences' });
    }
  };
}
