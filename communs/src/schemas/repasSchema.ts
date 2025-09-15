import {z} from 'zod' ;
import {
  nonNullablePositifStrictIntegerSchema,
  urlIntegerSchema
 } from './commonSchema.js';

/**
 * Données de base d'une categorie
 */
export const repasDataSchema = z.object({
  nom: z.string().min(1, { message: "Le nom du type de repas est requis." }),
  icone: z.string().min(1, { message: "Le nom de l'icone est requis." }),
  ordre: nonNullablePositifStrictIntegerSchema("Le numero d'ordre"),
}).strict();

export const urlRepasIdSchema = z.object({
  id : urlIntegerSchema ("L'identifiant du repas")
});

export const repasSchema = repasDataSchema.extend({id: nonNullablePositifStrictIntegerSchema("L'identifiant du type de repas")}).strict() ;