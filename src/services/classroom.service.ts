import { Classroom } from '../models/classroom.model';
import { GoogleClassroomService } from './google-classroom.service';
import { logger } from '../utils/logger.util';

export class ClassroomService {
  private googleClassroomService = new GoogleClassroomService();

  async getClassroomsByUser(userId: string) {
    return Classroom.find({ user: userId });
  }

  async getClassroomById(classroomId: string, userId: string) {
    return Classroom.findOne({ _id: classroomId, user: userId });
  }

  async createClassroom(data: any, userId: string) {
    return Classroom.create({ ...data, user: userId });
  }

  async updateClassroom(classroomId: string, data: any, userId: string) {
    return Classroom.findOneAndUpdate(
      { _id: classroomId, user: userId },
      data,
      { new: true }
    );
  }

  async deleteClassroom(classroomId: string, userId: string) {
    return Classroom.findOneAndDelete({ _id: classroomId, user: userId });
  }

  async syncFromGoogle(userId: string) {
    try {
      await this.googleClassroomService.syncCourses(userId);
      return await this.getClassroomsByUser(userId);
    } catch (error) {
      logger.error('Error syncing classrooms:', error);
      throw error;
    }
  }
}