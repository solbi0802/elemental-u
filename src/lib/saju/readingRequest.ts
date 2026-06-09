import { z } from 'zod';

const birthDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    const today = new Date();

    return (
      year >= 1900 &&
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day &&
      date <= today
    );
  }, 'Birth date must be a valid date between 1900 and today');

const birthTimeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
  .nullable()
  .optional();

export const readingRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .refine((value) => !/[\u0000-\u001f\u007f]/.test(value), {
      message: 'Name contains unsupported characters',
    }),
  birthDate: birthDateSchema,
  birthTime: birthTimeSchema,
});

export type ReadingRequest = z.infer<typeof readingRequestSchema>;
