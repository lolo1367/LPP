import { z } from "zod";
export declare const ligneJournalAlimentaireDataSimpleSchema: z.ZodObject<{
    uti: z.ZodNumber;
    date: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    alimentId: z.ZodNumber;
    typeRepasId: z.ZodNumber;
    quantite: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
    points: z.ZodNumber;
    unite: z.ZodString;
}, z.core.$strip>;
export declare const ligneJournalAlimentaireDataCompletSchema: z.ZodObject<{
    id: z.ZodNumber;
    uti_id: z.ZodNumber;
    date: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
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
        grammes: z.ZodPipe<z.ZodTransform<{} | null, unknown>, z.ZodNullable<z.ZodNumber>>;
        zeroPoint: z.ZodBoolean;
        id: z.ZodNumber;
    }, z.core.$strict>;
    repas: z.ZodObject<{
        nom: z.ZodString;
        icone: z.ZodString;
        ordre: z.ZodNumber;
        id: z.ZodNumber;
    }, z.core.$strict>;
    quantite: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
    points: z.ZodNumber;
    unite: z.ZodString;
}, z.core.$strip>;
export declare const urlLigneJournalAlimentaireIdSchema: z.ZodObject<{
    id: z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>;
}, z.core.$strip>;
export declare const ligneJournalAlimentaireSimpleSchema: z.ZodObject<{
    uti: z.ZodNumber;
    date: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    alimentId: z.ZodNumber;
    typeRepasId: z.ZodNumber;
    quantite: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
    points: z.ZodNumber;
    unite: z.ZodString;
    id: z.ZodNumber;
}, z.core.$strict>;
export declare const ligneJournalAlimentaireCompletSchema: z.ZodObject<{
    uti_id: z.ZodNumber;
    date: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
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
        grammes: z.ZodPipe<z.ZodTransform<{} | null, unknown>, z.ZodNullable<z.ZodNumber>>;
        zeroPoint: z.ZodBoolean;
        id: z.ZodNumber;
    }, z.core.$strict>;
    repas: z.ZodObject<{
        nom: z.ZodString;
        icone: z.ZodString;
        ordre: z.ZodNumber;
        id: z.ZodNumber;
    }, z.core.$strict>;
    quantite: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
    points: z.ZodNumber;
    unite: z.ZodString;
    id: z.ZodNumber;
}, z.core.$strict>;
export declare const ligneJournalAlimentaireFiltreSchemas: z.ZodObject<{
    uti_id: z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>;
    date: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>>;
    date_fin: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>>;
    type_repas_id: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
    ligne_id: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
}, z.core.$strict>;
