import { z } from 'zod';
/**
 * Données de base d'une unite
 */
export declare const uniteDataSchema: z.ZodObject<{
    unite: z.ZodString;
}, z.core.$strict>;
export declare const uniteSchema: z.ZodObject<{
    unite: z.ZodString;
}, z.core.$strict>;
export declare const uniteFiltreSchema: z.ZodObject<{
    unite: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
