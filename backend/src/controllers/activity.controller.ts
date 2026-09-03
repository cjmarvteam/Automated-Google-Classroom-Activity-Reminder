import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ActivityService } from '../services/activity.service';
import { logger } from '../utils/logger';

export class ActivityController {
  private activityService = new ActivityService();

  getActivities = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const activities = await this.activityService.getActivitiesByUser(req.userId!);
      res.json({ activities });
    } catch (error) {
      logger.error('Get activities error:', error);
      res.status(500).json({ error: 'Failed to get activities' });
    }
  };

  getUpcomingActivities = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const activities = await this.activityService.getUpcomingActivities(req.userId!);
      res.json({ activities });
    } catch (error) {
      logger.error('Get upcoming activities error:', error);
      res.status(500).json({ error: 'Failed to get upcoming activities' });
    }
  };

  getOverdueActivities = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const activities = await this.activityService.getOverdueActivities(req.userId!);
      res.json({ activities });
    } catch (error) {
      logger.error('Get overdue activities error:', error);
      res.status(500).json({ error: 'Failed to get overdue activities' });
    }
  };

  getActivityById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const activity = await this.activityService.getActivityById(req.params.id, req.userId!);
      if (!activity) {
        res.status(404).json({ error: 'Activity not found' });
        return;
      }
      res.json({ activity });
    } catch (error) {
      logger.error('Get activity error:', error);
      res.status(500).json({ error: 'Failed to get activity' });
    }
  };

  createActivity = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const activity = await this.activityService.createActivity(req.body, req.userId!);
      res.status(201).json({ activity });
    } catch (error) {
      logger.error('Create activity error:', error);
      res.status(500).json({ error: 'Failed to create activity' });
    }
  };

  updateActivity = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const activity = await this.activityService.updateActivity(req.params.id, req.body, req.userId!);
      if (!activity) {
        res.status(404).json({ error: 'Activity not found' });
        return;
      }
      res.json({ activity });
    } catch (error) {
      logger.error('Update activity error:', error);
      res.status(500).json({ error: 'Failed to update activity' });
    }
  };

  deleteActivity = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const activity = await this.activityService.deleteActivity(req.params.id, req.userId!);
      if (!activity) {
        res.status(404).json({ error: 'Activity not found' });
        return;
      }
      res.json({ message: 'Activity deleted successfully' });
    } catch (error) {
      logger.error('Delete activity error:', error);
      res.status(500).json({ error: 'Failed to delete activity' });
    }
  };

  syncFromGoogle = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const activities = await this.activityService.syncFromGoogle(req.params.classroomId, req.userId!);
      res.json({ activities });
    } catch (error) {
      logger.error('Sync activities error:', error);
      res.status(500).json({ error: 'Failed to sync activities' });
    }
  };
}
