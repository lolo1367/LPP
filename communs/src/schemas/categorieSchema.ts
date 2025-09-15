import {z} from 'zod' ;
import {
  nonNullablePositifStrictIntegerSchema,
  urlIntegerSchema
  } from './commonSchema.js';

/**
 * Données de base d'une categorie
 */
export const categorieDataSchema = z.object({
  nom: z.string().min(1, { message: "Le nom de la catégorie est requis." })
}).strict();

export const urlCategorieIdSchema = z.object({
  id : urlIntegerSchema("L'identifiant de la categorie d'aliment")
});

export const categorieSchema = categorieDataSchema.extend({id: nonNullablePositifStrictIntegerSchema("L'identifiant de la categorie d'aliment")}).strict() ;


export const categorieFiltreSchema = z.object({
   nom: z.string().min(1).optional(),
}).strict();

