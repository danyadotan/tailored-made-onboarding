import { z } from 'zod';

export const messageSchema = z.object({
  content: z.string().trim().min(1, "Message cannot be empty").max(10000, "Message is too long"),
  role: z.enum(['user', 'assistant', 'system']),
});

export const profileUpdateSchema = z.object({
  username: z.string().trim().min(3, "Username must be at least 3 characters").max(50, "Username must be less than 50 characters").regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens").optional().nullable(),
  full_name: z.string().trim().min(1, "Name cannot be empty").max(100, "Name must be less than 100 characters").optional().nullable(),
});

export const signatureSchema = z.string().trim().min(2, "Signature must be at least 2 characters").max(200, "Signature must be less than 200 characters");

export const sensoryPreferencesSchema = z.object({
  brightness: z.number().min(0).max(100),
  contrast: z.number().min(0).max(100),
  motion_sensitivity: z.boolean(),
  sound_enabled: z.boolean(),
  notification_style: z.enum(['visual', 'audio', 'haptic', 'flash', 'both']),
  color_scheme: z.enum(['default', 'high-contrast', 'muted', 'bridge-it']),
  notification_timing: z.enum(['immediate', 'scheduled', 'batched']),
  haptic_intensity: z.enum(['low', 'medium', 'high']),
  flash_pattern: z.enum(['single', 'double', 'pulse']),
  flash_color: z.enum(['white', 'blue', 'pink', 'rainbow']),
});
