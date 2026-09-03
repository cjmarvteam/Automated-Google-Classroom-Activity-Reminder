import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ClassroomService } from '../services/classroom.service';
import { logger } from '../utils/logger.util';

export class ClassroomController {
  private classroomService = new ClassroomService();

  getClassrooms = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const classrooms = await this.classroomService.getClassroomsByUser(req.userId!);
      res.json({ classrooms });
    } catch (error) {
      logger.error('Get classrooms error:', error);
      res.status(500).json({ error: 'Failed to get classrooms' });
    }
  };

  getClassroomById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const classroom = await this.classroomService.getClassroomById(req.params.id, req.userId!);
      if (!classroom) {
        res.status(404).json({ error: 'Classroom not found' });
        return;
      }
      res.json({ classroom });
    } catch (error) {
      logger.error('Get classroom error:', error);
      res.status(500).json({ error: 'Failed to get classroom' });
    }
  };

  createClassroom = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const classroom = await this.classroomService.createClassroom(req.body, req.userId!);
      res.status(201).json({ classroom });
    } catch (error) {
      logger.error('Create classroom error:', error);
      res.status(500).json({ error: 'Failed to create classroom' });
    }
  };

  updateClassroom = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const classroom = await this.classroomService.updateClassroom(req.params.id, req.body, req.userId!);
      if (!classroom) {
        res.status(404).json({ error: 'Classroom not found' });
        return;
      }
      res.json({ classroom });
    } catch (error) {
      logger.error('Update classroom error:', error);
      res.status(500).json({ error: 'Failed to update classroom' });
    }
  };

  deleteClassroom = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const classroom = await this.classroomService.deleteClassroom(req.params.id, req.userId!);
      if (!classroom) {
        res.status(404).json({ error: 'Classroom not found' });
        return;
      }
      res.json({ message: 'Classroom deleted successfully' });
    } catch (error) {
      logger.error('Delete classroom error:', error);
      res.status(500).json({ error: 'Failed to delete classroom' });
    }
  };

  syncFromGoogle = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const classrooms = await this.classroomService.syncFromGoogle(req.userId!);
      res.json({ classrooms });
    } catch (error) {
      logger.error('Sync classrooms error:', error);
      res.status(500).json({ error: 'Failed to sync classrooms' });
    }
  };
}