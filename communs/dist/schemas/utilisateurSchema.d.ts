import { z } from 'zod';
export declare const utilisateurDataSchema: z.ZodObject<{
    nom: z.ZodString;
    prenom: z.ZodString;
    sexe: z.ZodString;
    email: z.ZodString;
    mdp: z.ZodString;
    taille: z.ZodNumber;
    point_bonus: z.ZodNumber;
    point_jour: z.ZodNumber;
}, z.core.$strict>;
export declare const utilisateurFiltreSchema: z.ZodObject<{
    nom: z.ZodOptional<z.ZodString>;
    uti_id: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
}, z.core.$strict>;
export declare const utilisateurLoginSchema: z.ZodObject<{
    email: z.ZodString;
    mdp: z.ZodString;
}, z.core.$strict>;
export declare const utilisateurTokenSchema: z.ZodObject<{
    token: z.ZodString;
}, z.core.$strict>;
export declare const urlUtilisateurIdSchema: z.ZodObject<{
    id: z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>;
}, z.core.$strip>;
export declare const utilisateurSchema: z.ZodObject<{
    nom: z.ZodString;
    prenom: z.ZodString;
    sexe: z.ZodString;
    email: z.ZodString;
    mdp: z.ZodString;
    taille: z.ZodNumber;
    point_bonus: z.ZodNumber;
    point_jour: z.ZodNumber;
    id: z.ZodNumber;
}, z.core.$strict>;
export declare const utilisateurDataUpdateSchema: z.ZodObject<{
    email: z.ZodString;
    nom: z.ZodString;
    prenom: z.ZodString;
    sexe: z.ZodString;
    taille: z.ZodNumber;
    point_bonus: z.ZodNumber;
    point_jour: z.ZodNumber;
}, z.core.$strict>;
export declare const utilisateurDataUpdateMdpSchema: z.ZodObject<{
    actuelMdp: z.ZodString;
    nouveauMdp: z.ZodString;
}, z.core.$strip>;
