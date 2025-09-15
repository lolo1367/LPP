import { z } from "zod";
import {
  dateIsoSchema,
  undefinedDateIsoSchema,
  nonNullablePositifIntegerSchema,
  nonNullablePositifDecimalSchema,
  nonNullablePositifStrictIntegerSchema,
  urlIntegerSchema
} from "./commonSchema.js";

import { repasSchema } from './repasSchema.js';
import { alimentSchema } from "./alimentSchema.js";


export const ligneJournalAlimentaireDataSimpleSchema = z.object({
  uti:nonNullablePositifStrictIntegerSchema("L'identifiant de l'utilisateur"),
  date: dateIsoSchema("La date du journal alimentaire"),
  alimentId: nonNullablePositifStrictIntegerSchema("L'identifiant de l'aliment"),
  typeRepasId: nonNullablePositifStrictIntegerSchema("L'identifiant du type de repas"),
  quantite: nonNullablePositifDecimalSchema("Le nombre de portion",2),
  points: nonNullablePositifIntegerSchema("Le nombre de point"),
  unite: z.string().min(1, { message: "L'unité est requise." })
  
});

export const ligneJournalAlimentaireDataCompletSchema = z.object({
  id: nonNullablePositifStrictIntegerSchema("L'identifiant de la ligne du journal alimentaire"),
  uti_id: nonNullablePositifStrictIntegerSchema("L'identifiant de l'utilisateur"),
  date: dateIsoSchema("La date du journal alimentaire"),
  aliment: alimentSchema,
  repas: repasSchema,
  quantite: nonNullablePositifDecimalSchema("Le nombre de portion",2),
  points: nonNullablePositifIntegerSchema("Le nombre de point"),
  unite: z.string().min(1, { message: "L'unité est requise." })
  
});

export const urlLigneJournalAlimentaireIdSchema = z.object({
  id : urlIntegerSchema("L'identifiant de la ligne de journal alimentaire")
});

export const ligneJournalAlimentaireSimpleSchema = ligneJournalAlimentaireDataSimpleSchema.extend({id: nonNullablePositifStrictIntegerSchema("L'identifiant de la ligne de journal alimentaire")}).strict() ;
export const ligneJournalAlimentaireCompletSchema = ligneJournalAlimentaireDataCompletSchema.extend({id: nonNullablePositifStrictIntegerSchema("L'identifiant de la ligne de journal alimentaire")}).strict() ;

export const ligneJournalAlimentaireFiltreSchemas = z.object({
  uti_id: urlIntegerSchema("L'identifiant de l'utilisateur"),
  date: dateIsoSchema("La date ").optional(),
  date_fin: dateIsoSchema("La date de fin").optional(),
  type_repas_id: urlIntegerSchema("L'identifiant du type de repas").optional(),
  ligne_id: urlIntegerSchema ("L'identifiant de la ligne").optional()
}).strict();




