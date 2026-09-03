import { Preference } from '../models/preference.model';
import { logger } from '../utils/logger.util';

export class PreferencesService {
  async getPreferences(userId: string) {
    let preferences = await Preference.findOne({ user: userId });
    
    if (!preferences) {
      preferences = await Preference.create({ user: userId });
    }
    
    return preferences;
  }

  async updatePreferences(userId: string, data: any) {
    return Preference.findOneAndUpdate(
      { user: userId },
      data,
      { new: true, upsert: true }
    );
  }
}