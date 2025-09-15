import { z } from 'zod';
import { utilisateurSchema, utilisateurDataSchema } from "schemas/utilisateurSchema";

export type UtilisateurData = z.infer<typeof utilisateurDataSchema>;
export type Utilisateur = z.infer<typeof utilisateurSchema>;
