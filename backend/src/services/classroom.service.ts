// classroom.service.ts - Business logic for classroom operations
// Handles CRUD operations and Google Classroom sync

import { getPrisma } from '../config/database';
import { GoogleClassroomService } from './googleClassroom.service';
import { logger } from '../utils/logger';

export class ClassroomService {
  private googleClassroomService = new GoogleClassroomService();

  /**
   * Get all classrooms for a specific user
   * Includes a count of activities per classroom
   * Sorted alphabetically by name
   */
  async getClassroomsByUser(userId: string) {
    const prisma = getPrisma();
    return prisma.classroom.findMany({
      where: { userId },
      include: { _count: { select: { activities: true } } },
      orderBy: { name: 'asc' }
    });
  }

  /**
   * Get a single classroom by ID with all its activities
   * Ensures the classroom belongs to the requesting user (userId check)
   */
  async getClassroomById(classroomId: string, userId: string) {
    const prisma = getPrisma();
    return prisma.classroom.findFirst({
      where: { id: classroomId, userId },
      include: { activities: true }
    });
  }

  /**
   * Create a new classroom
   * If googleClassroomId is not provided, generates a unique ID for manual creation
   * Format: "manual-{timestamp}-{random6chars}"
   */
  async createClassroom(data: any, userId: string) {
    const prisma = getPrisma();
    // Generate unique ID for manually created classrooms
    const googleClassroomId = data.googleClassroomId || `manual-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    return prisma.classroom.create({
      data: {
        name: data.name,
        section: data.section,
        description: data.description,
        alternateLink: data.alternateLink,
        googleClassroomId,
        userId
      }
    });
  }

  /**
   * Update an existing classroom
   * Uses updateMany to ensure userId matches (prevents unauthorized edits)
   */
  async updateClassroom(classroomId: string, data: any, userId: string) {
    const prisma = getPrisma();
    return prisma.classroom.updateMany({
      where: { id: classroomId, userId },
      data
    });
  }

  /**
   * Delete a classroom
   * Uses deleteMany to ensure userId matches (prevents unauthorized deletes)
   * Note: Does NOT cascade delete activities (handled by Prisma schema)
   */
  async deleteClassroom(classroomId: string, userId: string) {
    const prisma = getPrisma();
    return prisma.classroom.deleteMany({
      where: { id: classroomId, userId }
    });
  }

  /**
   * Sync classrooms from Google Classroom API
   * Uses the user's stored Google OAuth tokens to fetch courses
   * Updates existing classrooms and creates new ones
   */
  async syncFromGoogle(userId: string) {
    try {
      await this.googleClassroomService.syncCourses(userId);
      // Return updated list after sync
      return await this.getClassroomsByUser(userId);
    } catch (error) {
      logger.error('Error syncing classrooms:', error);
      throw error;
    }
  }
}
