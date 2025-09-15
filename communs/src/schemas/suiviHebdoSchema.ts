import { z } from 'zod';

import {
  nonNullablePositifStrictIntegerSchema,
  urlIntegerSchema
} from "./commonSchema.js";

export const suiviHebdoDataSchema = z.object({
  uti_id: nonNullablePositifStrictIntegerSchema("L'identifiant de l'utilisateur"),
  semaine: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  point_bonus_initial: z.number().int(),
  point_bonus_restant: z.number().int().nonnegative(),
  point_journalier: z.number().int().nonnegative(),
  point_lundi_utilise: z.number().int().nonnegative(),
  point_mardi_utilise: z.number().int().nonnegative(),
  point_mercredi_utilise: z.number().int().nonnegative(),
  point_jeudi_utilise: z.number().int().nonnegative(),
  point_vendredi_utilise: z.number().int().nonnegative(),
  point_samedi_utilise: z.number().int().nonnegative(),
  point_dimanche_utilise: z.number().int().nonnegative(),
  point_total_initial: z.number().int().nonnegative(),
  point_total_utilise : z.number().int().nonnegative(),
  derniere_mise_a_jour: z.string().optional() // format ISO retourné par SQLite
});

export const suiviHebdoFiltreSchemas = z.object({
  uti_id: urlIntegerSchema("L'identifiant de l'utilisateur"),
  date: z.preprocess((val) => {
    if (typeof val !== 'string' || val.trim() === '') return undefined;

    // Validation manuelle format AAAA-MM-JJ
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(val)) {
      throw new Error("Le format de la date doit être AAAA-MM-JJ.");
    }

    const date = new Date(val);
    if (isNaN(date.getTime()) || !date.toISOString().startsWith(val)) {
      throw new Error("La date n'est pas valide (ex. 2025-02-30 est invalide).");
    }
    return date;

  }, z.date()) 

}).strict();
