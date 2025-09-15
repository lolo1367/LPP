import { z } from 'zod';
import { categorieDataSchema, categorieSchema } from '../schemas/categorieSchema.js';
export type CategorieData = z.infer<typeof categorieDataSchema>;
export type Categorie = z.infer<typeof categorieSchema>;
