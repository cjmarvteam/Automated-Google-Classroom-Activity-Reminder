import { z } from 'zod';

export const classroomSchema = z.object({
  googleClassroomId: z.string().min(1, 'Google Classroom ID is required'),
  name: z.string().min(1, 'Classroom name is required'),
  section: z.string().optional(),
  description: z.string().optional(),
  alternateLink: z.string().url().optional()
});

export const classroomIdSchema = z.object({
  id: z.string().min(1, 'Classroom ID is required')
});

export type ClassroomInput = z.infer<typeof classroomSchema>;
