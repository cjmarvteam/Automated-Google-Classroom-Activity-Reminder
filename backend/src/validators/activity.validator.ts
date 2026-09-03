import { z } from 'zod';

export const activitySchema = z.object({
  classroomId: z.string().min(1, 'Classroom ID is required'),
  title: z.string().min(1, 'Activity title is required'),
  description: z.string().optional(),
  type: z.enum(['ASSIGNMENT', 'QUIZ', 'QUESTION', 'MATERIAL', 'TOPIC']),
  dueDate: z.string().datetime().optional(),
  maxPoints: z.number().positive().optional(),
  status: z.enum(['PENDING', 'SUBMITTED', 'LATE', 'MISSING']).default('PENDING')
});

export const activityIdSchema = z.object({
  id: z.string().min(1, 'Activity ID is required')
});

export type ActivityInput = z.infer<typeof activitySchema>;
