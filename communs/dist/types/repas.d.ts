import { z } from 'zod';
import { repasDataSchema, repasSchema } from '../schemas/repasSchema.js';
export type RepasData = z.infer<typeof repasDataSchema>;
export type Repas = z.infer<typeof repasSchema>;
