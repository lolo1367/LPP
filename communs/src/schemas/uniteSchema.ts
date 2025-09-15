import {z} from 'zod' ;


/**
 * Données de base d'une unite
 */
export const uniteDataSchema = z.object({
  unite: z.string().min(1, { message: "Le nom de l'unité est requis." })
}).strict();

export const uniteSchema = uniteDataSchema.strict() ;


export const uniteFiltreSchema = z.object({
   unite: z.string().min(1).optional(),
}).strict();

