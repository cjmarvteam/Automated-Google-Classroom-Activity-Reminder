import { getPrisma } from '../config/database';
import { logger } from '../utils/logger';

export class PreferenceService {
  async getPreferences(userId: string) {
    const prisma = getPrisma();

    let preferences = await prisma.userPreference.findUnique({
      where: { userId }
    });

    if (!preferences) {
      preferences = await prisma.userPreference.create({
        data: { userId }
      });
    }

    return preferences;
  }

  async updatePreferences(userId: string, data: any) {
    const prisma = getPrisma();

    return prisma.userPreference.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data }
    });
  }
}
