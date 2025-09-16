import { z } from 'zod';
import {
   utilisateurSchema,
   utilisateurDataSchema,
   utilisateurDataUpdateSchema,
   utilisateurDataUpdateMdpSchema
} from "../schemas/utilisateurSchema";

export type UtilisateurData = z.infer<typeof utilisateurDataSchema>;
export type Utilisateur = z.infer<typeof utilisateurSchema>;
export type UtilisateurDataUpdate = z.infer<typeof utilisateurDataUpdateSchema>;
export type UtilisateurDataUpdateMdp = z.infer<typeof utilisateurDataUpdateMdpSchema>;
