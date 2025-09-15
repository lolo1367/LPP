import { z } from 'zod';
import { alimentDataSchema, alimentSchema, alimentRecentSchema } from '../schemas/alimentSchema.js';
export type AlimentData = z.infer<typeof alimentDataSchema>;
export type Aliment = z.infer<typeof alimentSchema>;
export type AlimentSimple = Omit<Aliment, 'categorie'>;
export type AlimentRecent = z.infer<typeof alimentRecentSchema>;
