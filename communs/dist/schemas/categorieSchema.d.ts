import { z } from 'zod';
/**
 * Données de base d'une categorie
 */
export declare const categorieDataSchema: z.ZodObject<{
    nom: z.ZodString;
}, z.core.$strict>;
export declare const urlCategorieIdSchema: z.ZodObject<{
    id: z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>;
}, z.core.$strip>;
export declare const categorieSchema: z.ZodObject<{
    nom: z.ZodString;
    id: z.ZodNumber;
}, z.core.$strict>;
export declare const categorieFiltreSchema: z.ZodObject<{
    nom: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
