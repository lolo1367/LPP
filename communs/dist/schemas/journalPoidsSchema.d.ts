import { z } from "zod";
export declare const ligneJournalPoidsFiltreSchemas: z.ZodObject<{
    uti_id: z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>;
    date_debut: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>>;
    date_fin: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>>;
    ligne_id: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
}, z.core.$strict>;
export declare const ligneJournalPoidsDataSchema: z.ZodObject<{
    uti_id: z.ZodNumber;
    date: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    poids: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
}, z.core.$strip>;
export declare const urlLigneJournalPoidsIdSchema: z.ZodObject<{
    id: z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>;
}, z.core.$strip>;
export declare const ligneJournalPoidsSchema: z.ZodObject<{
    uti_id: z.ZodNumber;
    date: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    poids: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
    id: z.ZodNumber;
}, z.core.$strict>;
