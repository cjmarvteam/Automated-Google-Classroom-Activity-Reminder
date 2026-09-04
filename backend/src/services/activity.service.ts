// activity.service.ts - Business logic for activity (assignment) operations
// Handles CRUD, filtering (upcoming/overdue), and Google Classroom coursework sync

import { getPrisma } from '../config/database';
import { GoogleClassroomService } from './googleClassroom.service';
import { logger } from '../utils/logger';

export class ActivityService {
  private googleClassroomService = new GoogleClassroomService();

  /**
   * Get all activities for a user, sorted by due date (soonest first)
   * Includes the parent classroom for each activity
   */
  async getActivitiesByUser(userId: string) {
    const prisma = getPrisma();
    return prisma.activity.findMany({
      where: { userId },
      include: { classroom: true },
      orderBy: { dueDate: 'asc' }
    });
  }

  /**
   * Get upcoming activities (due date is in the future, status is PENDING)
   * Used by Dashboard and Calendar to show what's due next
   */
  async getUpcomingActivities(userId: string) {
    const prisma = getPrisma();
    const now = new Date();
    return prisma.activity.findMany({
      where: {
        userId,
        dueDate: { gte: now },   // gte = greater than or equal
        status: 'PENDING'
      },
      include: { classroom: true },
      orderBy: { dueDate: 'asc' }
    });
  }

  /**
   * Get overdue activities (due date is in the past, status is still PENDING)
   * These activities have missed their deadline but haven't been marked MISSING yet
   */
  async getOverdueActivities(userId: string) {
    const prisma = getPrisma();
    const now = new Date();
    return prisma.activity.findMany({
      where: {
        userId,
        dueDate: { lt: now },    // lt = less than
        status: 'PENDING'
      },
      include: { classroom: true }
    });
  }

  /**
   * Get a single activity by ID
   * Ensures the activity belongs to the requesting user
   */
  async getActivityById(activityId: string, userId: string) {
    const prisma = getPrisma();
    return prisma.activity.findFirst({
      where: { id: activityId, userId },
      include: { classroom: true }
    });
  }

  /**
   * Create a new activity
   * The activity data should include: title, classroomId, type, dueDate, etc.
   * userId is injected from the authenticated request
   */
  async createActivity(data: any, userId: string) {
    const prisma = getPrisma();
    return prisma.activity.create({
      data: { ...data, userId },
      include: { classroom: true }
    });
  }

  /**
   * Update an activity
   * Uses updateMany to ensure userId matches (prevents unauthorized edits)
   */
  async updateActivity(activityId: string, data: any, userId: string) {
    const prisma = getPrisma();
    return prisma.activity.updateMany({
      where: { id: activityId, userId },
      data
    });
  }

  /**
   * Delete an activity
   * Uses deleteMany to ensure userId matches
   */
  async deleteActivity(activityId: string, userId: string) {
    const prisma = getPrisma();
    return prisma.activity.deleteMany({
      where: { id: activityId, userId }
    });
  }

  /**
   * Sync activities from Google Classroom for a specific classroom
   * Uses Google Classroom API to fetch coursework
   * Upserts: creates new activities, updates existing ones (by googleActivityId)
   */
  async syncFromGoogle(classroomId: string, userId: string) {
    try {
      const prisma = getPrisma();

      // Verify the classroom belongs to the user
      const classroom = await prisma.classroom.findFirst({
        where: { id: classroomId, userId }
      });

      if (!classroom) {
        throw new Error('Classroom not found');
      }

      // Fetch coursework from Google Classroom API
      const coursework = await this.googleClassroomService.getCourseWork(userId, classroom.googleClassroomId);

      for (const work of coursework) {
        // Parse Google's due date format (year, month, day) into a Date object
        const dueDate = work.dueDate
          ? new Date(`${work.dueDate.year}-${work.dueDate.month}-${work.dueDate.day}`)
          : null;

        // Upsert: update if exists (by userId + googleActivityId), otherwise create
        await prisma.activity.upsert({
          where: {
            userId_googleActivityId: {
              userId,
              googleActivityId: work.id!
            }
          },
          update: {
            title: work.title || 'Untitled Activity',
            description: work.description || null,
            type: this.mapWorkType(work.workType),
            dueDate,
            maxPoints: work.maxPoints ? Number(work.maxPoints) : null,
            alternateLink: work.alternateLink || null
          },
          create: {
            userId,
            classroomId,
            googleActivityId: work.id!,
            title: work.title || 'Untitled Activity',
            description: work.description || null,
            type: this.mapWorkType(work.workType),
            dueDate,
            maxPoints: work.maxPoints ? Number(work.maxPoints) : null,
            alternateLink: work.alternateLink || null
          }
        });
      }

      return await this.getActivitiesByUser(userId);
    } catch (error) {
      logger.error('Error syncing activities:', error);
      throw error;
    }
  }

  /**
   * Maps Google Classroom work types to our internal activity types
   * Google types: ASSIGNMENT, SHORT_ANSWER_QUESTION, MULTIPLE_CHOICE_QUESTION
   */
  private mapWorkType(workType: string | undefined | null): string {
    const typeMap: Record<string, string> = {
      'ASSIGNMENT': 'ASSIGNMENT',
      'SHORT_ANSWER_QUESTION': 'QUESTION',
      'MULTIPLE_CHOICE_QUESTION': 'QUIZ'
    };
    return typeMap[workType || ''] || 'ASSIGNMENT';
  }
}
