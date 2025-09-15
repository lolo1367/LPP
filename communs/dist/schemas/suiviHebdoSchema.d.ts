import { z } from 'zod';
export declare const suiviHebdoDataSchema: z.ZodObject<{
    uti_id: z.ZodNumber;
    semaine: z.ZodString;
    point_bonus_initial: z.ZodNumber;
    point_bonus_restant: z.ZodNumber;
    point_journalier: z.ZodNumber;
    point_lundi_utilise: z.ZodNumber;
    point_mardi_utilise: z.ZodNumber;
    point_mercredi_utilise: z.ZodNumber;
    point_jeudi_utilise: z.ZodNumber;
    point_vendredi_utilise: z.ZodNumber;
    point_samedi_utilise: z.ZodNumber;
    point_dimanche_utilise: z.ZodNumber;
    point_total_initial: z.ZodNumber;
    point_total_utilise: z.ZodNumber;
    derniere_mise_a_jour: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const suiviHebdoFiltreSchemas: z.ZodObject<{
    uti_id: z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>;
    date: z.ZodPipe<z.ZodTransform<Date | undefined, unknown>, z.ZodDate>;
}, z.core.$strict>;
