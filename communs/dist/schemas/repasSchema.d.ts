import { z } from 'zod';
/**
 * Données de base d'une categorie
 */
export declare const repasDataSchema: z.ZodObject<{
    nom: z.ZodString;
    icone: z.ZodString;
    ordre: z.ZodNumber;
}, z.core.$strict>;
export declare const urlRepasIdSchema: z.ZodObject<{
    id: z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>;
}, z.core.$strip>;
export declare const repasSchema: z.ZodObject<{
    nom: z.ZodString;
    icone: z.ZodString;
    ordre: z.ZodNumber;
    id: z.ZodNumber;
}, z.core.$strict>;
