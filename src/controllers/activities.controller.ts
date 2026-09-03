import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ActivitiesService } from '../services/activities.service';
import { logger } from '../utils/logger.util';

export class ActivitiesController {
  private activitiesService = new ActivitiesService();

  getActivities = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const activities = await this.activitiesService.getActivitiesByUser(req.userId!);
      res.json({ activities });
    } catch (error) {
      logger.error('Get activities error:', error);
      res.status(500).json({ error: 'Failed to get activities' });
    }
  };

  getUpcomingActivities = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const activities = await this.activitiesService.getUpcomingActivities(req.userId!);
      res.json({ activities });
    } catch (error) {
      logger.error('Get upcoming activities error:', error);
      res.status(500).json({ error: 'Failed to get upcoming activities' });
    }
  };

  getOverdueActivities = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const activities = await this.activitiesService.getOverdueActivities(req.userId!);
      res.json({ activities });
    } catch (error) {
      logger.error('Get overdue activities error:', error);
      res.status(500).json({ error: 'Failed to get overdue activities' });
    }
  };

  getActivityById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const activity = await this.activitiesService.getActivityById(req.params.id, req.userId!);
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
      const activity = await this.activitiesService.createActivity(req.body, req.userId!);
      res.status(201).json({ activity });
    } catch (error) {
      logger.error('Create activity error:', error);
      res.status(500).json({ error: 'Failed to create activity' });
    }
  };

  updateActivity = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const activity = await this.activitiesService.updateActivity(req.params.id, req.body, req.userId!);
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
      const activity = await this.activitiesService.deleteActivity(req.params.id, req.userId!);
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
      const activities = await this.activitiesService.syncFromGoogle(req.params.classroomId, req.userId!);
      res.json({ activities });
    } catch (error) {
      logger.error('Sync activities error:', error);
      res.status(500).json({ error: 'Failed to sync activities' });
    }
  };
}