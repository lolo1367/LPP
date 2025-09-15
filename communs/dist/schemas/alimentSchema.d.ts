import { z } from 'zod';
export declare const alimentDataSchema: z.ZodObject<{
    nom: z.ZodString;
    quantite: z.ZodNumber;
    unite: z.ZodString;
    points: z.ZodNumber;
    categorie: z.ZodObject<{
        nom: z.ZodString;
        id: z.ZodNumber;
    }, z.core.$strict>;
    calories: z.ZodPipe<z.ZodTransform<{} | null, unknown>, z.ZodNullable<z.ZodNumber>>;
    fibres: z.ZodPipe<z.ZodTransform<{} | null, unknown>, z.ZodNullable<z.ZodNumber>>;
    proteines: z.ZodPipe<z.ZodTransform<{} | null, unknown>, z.ZodNullable<z.ZodNumber>>;
    acideGrasSature: z.ZodPipe<z.ZodTransform<{} | null, unknown>, z.ZodNullable<z.ZodNumber>>;
    matieresGrasses: z.ZodPipe<z.ZodTransform<{} | null, unknown>, z.ZodNullable<z.ZodNumber>>;
    glucides: z.ZodPipe<z.ZodTransform<{} | null, unknown>, z.ZodNullable<z.ZodNumber>>;
    sel: z.ZodPipe<z.ZodTransform<{} | null, unknown>, z.ZodNullable<z.ZodNumber>>;
    sucres: z.ZodPipe<z.ZodTransform<{} | null, unknown>, z.ZodNullable<z.ZodNumber>>;
    zeroPoint: z.ZodBoolean;
}, z.core.$strict>;
export declare const urlAlimentIdSchema: z.ZodObject<{
    id: z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>;
}, z.core.$strip>;
export declare const alimentFiltreSchema: z.ZodObject<{
    nom: z.ZodOptional<z.ZodString>;
    categorie_id: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
}, z.core.$strict>;
export declare const alimentSchema: z.ZodObject<{
    nom: z.ZodString;
    quantite: z.ZodNumber;
    unite: z.ZodString;
    points: z.ZodNumber;
    categorie: z.ZodObject<{
        nom: z.ZodString;
        id: z.ZodNumber;
    }, z.core.$strict>;
    calories: z.ZodPipe<z.ZodTransform<{} | null, unknown>, z.ZodNullable<z.ZodNumber>>;
    fibres: z.ZodPipe<z.ZodTransform<{} | null, unknown>, z.ZodNullable<z.ZodNumber>>;
    proteines: z.ZodPipe<z.ZodTransform<{} | null, unknown>, z.ZodNullable<z.ZodNumber>>;
    acideGrasSature: z.ZodPipe<z.ZodTransform<{} | null, unknown>, z.ZodNullable<z.ZodNumber>>;
    matieresGrasses: z.ZodPipe<z.ZodTransform<{} | null, unknown>, z.ZodNullable<z.ZodNumber>>;
    glucides: z.ZodPipe<z.ZodTransform<{} | null, unknown>, z.ZodNullable<z.ZodNumber>>;
    sel: z.ZodPipe<z.ZodTransform<{} | null, unknown>, z.ZodNullable<z.ZodNumber>>;
    sucres: z.ZodPipe<z.ZodTransform<{} | null, unknown>, z.ZodNullable<z.ZodNumber>>;
    zeroPoint: z.ZodBoolean;
    id: z.ZodNumber;
}, z.core.$strict>;
export declare const alimentsRecentsFiltreSchema: z.ZodObject<{
    uti_id: z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>;
    date_debut: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    date_fin: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
}, z.core.$strict>;
export declare const alimentRecentSchema: z.ZodObject<{
    aliment: z.ZodObject<{
        nom: z.ZodString;
        quantite: z.ZodNumber;
        unite: z.ZodString;
        points: z.ZodNumber;
        categorie: z.ZodObject<{
            nom: z.ZodString;
            id: z.ZodNumber;
        }, z.core.$strict>;
        calories: z.ZodPipe<z.ZodTransform<{} | null, unknown>, z.ZodNullable<z.ZodNumber>>;
        fibres: z.ZodPipe<z.ZodTransform<{} | null, unknown>, z.ZodNullable<z.ZodNumber>>;
        proteines: z.ZodPipe<z.ZodTransform<{} | null, unknown>, z.ZodNullable<z.ZodNumber>>;
        acideGrasSature: z.ZodPipe<z.ZodTransform<{} | null, unknown>, z.ZodNullable<z.ZodNumber>>;
        matieresGrasses: z.ZodPipe<z.ZodTransform<{} | null, unknown>, z.ZodNullable<z.ZodNumber>>;
        glucides: z.ZodPipe<z.ZodTransform<{} | null, unknown>, z.ZodNullable<z.ZodNumber>>;
        sel: z.ZodPipe<z.ZodTransform<{} | null, unknown>, z.ZodNullable<z.ZodNumber>>;
        sucres: z.ZodPipe<z.ZodTransform<{} | null, unknown>, z.ZodNullable<z.ZodNumber>>;
        zeroPoint: z.ZodBoolean;
        id: z.ZodNumber;
    }, z.core.$strict>;
    date: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
}, z.core.$strict>;
