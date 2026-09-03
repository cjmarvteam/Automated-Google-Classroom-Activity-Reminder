import { getPrisma } from '../config/database';
import { logger } from '../utils/logger';

export class PriorityCalculator {
  async calculatePriority(userId: string) {
    try {
      const prisma = getPrisma();
      const now = new Date();

      const activities = await prisma.activity.findMany({
        where: {
          userId,
          status: 'PENDING',
          dueDate: { gte: now }
        },
        include: { classroom: true }
      });

      const prioritized = activities
        .map(activity => {
          const daysUntil = this.getDaysUntil(activity.dueDate!);
          const score = this.calculateScore(activity, daysUntil);

          return {
            activity,
            priorityScore: score,
            urgency: this.getUrgency(daysUntil),
            suggestedStudyDays: this.getSuggestedStudyDays(daysUntil)
          };
        })
        .sort((a, b) => b.priorityScore - a.priorityScore);

      return prioritized;
    } catch (error) {
      logger.error('Error calculating priority:', error);
      throw error;
    }
  }

  private calculateScore(activity: any, daysUntil: number): number {
    let score = 100;

    if (daysUntil <= 1) score += 50;
    else if (daysUntil <= 3) score += 30;
    else if (daysUntil <= 7) score += 10;

    if (activity.maxPoints) {
      score += Math.min(activity.maxPoints / 10, 20);
    }

    return score;
  }

  private getUrgency(daysUntil: number): string {
    if (daysUntil <= 1) return 'CRITICAL';
    if (daysUntil <= 3) return 'HIGH';
    if (daysUntil <= 7) return 'MEDIUM';
    return 'LOW';
  }

  private getSuggestedStudyDays(daysUntil: number): number {
    if (daysUntil <= 1) return 1;
    if (daysUntil <= 3) return 2;
    if (daysUntil <= 7) return Math.min(3, daysUntil);
    return Math.min(5, daysUntil);
  }

  private getDaysUntil(date: Date): number {
    const now = new Date();
    const target = new Date(date);
    const diffTime = target.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
