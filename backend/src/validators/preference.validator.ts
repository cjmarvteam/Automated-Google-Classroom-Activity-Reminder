import { z } from 'zod';

export const preferenceSchema = z.object({
  emailNotifications: z.boolean().optional(),
  studyReminders: z.boolean().optional(),
  reminderTime: z.string().optional(),
  timezone: z.string().optional(),
  reminderDaysBefore: z.number().min(1).max(30).optional()
});

export type PreferenceInput = z.infer<typeof preferenceSchema>;
