import { z } from 'zod';
import { uniteDataSchema, uniteSchema } from '../schemas/uniteSchema.js';
export type UniteData = z.infer<typeof uniteDataSchema>;
export type Unite = z.infer<typeof uniteSchema>;
