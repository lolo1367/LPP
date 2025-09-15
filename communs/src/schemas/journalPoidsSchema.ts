import { z } from "zod";
import {
	dateIsoSchema,
	undefinedDateIsoSchema,
   nonNullablePositifStrictIntegerSchema,
  	nonNullablePositifDecimalSchema,
   urlIntegerSchema
} from "./commonSchema.js";

export const ligneJournalPoidsFiltreSchemas = z.object({  
  uti_id: urlIntegerSchema("L'identifiant de l'utilisateur"),
  date_debut: dateIsoSchema("La date de début de la pésée").optional(),
  date_fin: dateIsoSchema("La date de fin de la pésée").optional(),
  ligne_id: urlIntegerSchema("L'identifiant de la ligne de journal du poids").optional()
}).strict();

export const ligneJournalPoidsDataSchema = z.object({
  uti_id: nonNullablePositifStrictIntegerSchema("L'identifiant de l'utilisateur"),
  date: dateIsoSchema("La date de la pésée"),
  poids: nonNullablePositifDecimalSchema("Le poids",2),

});

export const urlLigneJournalPoidsIdSchema = z.object({
  id : urlIntegerSchema("L'identifiant de la ligne de journal du poids")
});

export const ligneJournalPoidsSchema = ligneJournalPoidsDataSchema.extend({id: nonNullablePositifStrictIntegerSchema("L'identifiant de la ligne de journal du poids")}).strict() ;


