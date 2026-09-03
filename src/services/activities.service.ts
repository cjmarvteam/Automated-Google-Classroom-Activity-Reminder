import { Activity } from '../models/activity.model';
import { Classroom } from '../models/classroom.model';
import { GoogleClassroomService } from './google-classroom.service';
import { logger } from '../utils/logger.util';

export class ActivitiesService {
  private googleClassroomService = new GoogleClassroomService();

  async getActivitiesByUser(userId: string) {
    return Activity.find({ user: userId }).populate('classroom');
  }

  async getUpcomingActivities(userId: string) {
    const now = new Date();
    return Activity.find({
      user: userId,
      dueDate: { $gte: now },
      status: 'PENDING'
    }).populate('classroom').sort({ dueDate: 1 });
  }

  async getOverdueActivities(userId: string) {
    const now = new Date();
    return Activity.find({
      user: userId,
      dueDate: { $lt: now },
      status: 'PENDING'
    }).populate('classroom');
  }

  async getActivityById(activityId: string, userId: string) {
    return Activity.findOne({ _id: activityId, user: userId }).populate('classroom');
  }

  async createActivity(data: any, userId: string) {
    return Activity.create({ ...data, user: userId });
  }

  async updateActivity(activityId: string, data: any, userId: string) {
    return Activity.findOneAndUpdate(
      { _id: activityId, user: userId },
      data,
      { new: true }
    );
  }

  async deleteActivity(activityId: string, userId: string) {
    return Activity.findOneAndDelete({ _id: activityId, user: userId });
  }

  async syncFromGoogle(classroomId: string, userId: string) {
    try {
      const classroom = await Classroom.findOne({ _id: classroomId, user: userId });
      if (!classroom) {
        throw new Error('Classroom not found');
      }

      const coursework = await this.googleClassroomService.getCourseWork(userId, classroom.googleClassroomId);
      
      for (const work of coursework) {
        await Activity.findOneAndUpdate(
          { user: userId, googleActivityId: work.id },
          {
            user: userId,
            classroom: classroomId,
            googleActivityId: work.id,
            title: work.title || 'Untitled Activity',
            description: work.description,
            type: this.mapWorkType(work.workType),
            dueDate: work.dueDate ? new Date(`${work.dueDate.year}-${work.dueDate.month}-${work.dueDate.day}`) : undefined,
            maxPoints: work.maxPoints ? parseInt(work.maxPoints) : undefined,
            alternateLink: work.alternateLink
          },
          { upsert: true, new: true }
        );
      }

      return await this.getActivitiesByUser(userId);
    } catch (error) {
      logger.error('Error syncing activities:', error);
      throw error;
    }
  }

  private mapWorkType(workType: string | undefined | null): 'ASSIGNMENT' | 'QUIZ' | 'QUESTION' | 'MATERIAL' | 'TOPIC' {
    const typeMap: Record<string, 'ASSIGNMENT' | 'QUIZ' | 'QUESTION' | 'MATERIAL' | 'TOPIC'> = {
      'ASSIGNMENT': 'ASSIGNMENT',
      'SHORT_ANSWER_QUESTION': 'QUESTION',
      'MULTIPLE_CHOICE_QUESTION': 'QUIZ'
    };
    return typeMap[workType || ''] || 'ASSIGNMENT';
  }
}