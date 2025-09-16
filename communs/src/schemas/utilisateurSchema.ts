import {string, z} from 'zod' ;
import { categorieSchema } from './categorieSchema.js';
import { repasSchema } from './repasSchema.js';
import {
	dateIsoSchema,
	nonNullablePositifStrictIntegerSchema,
	nonNullablePositifIntegerSchema,
	nullablePositifDecimalSchema,
	nullablePositifIntegerSchema,
	urlIntegerSchema,
	nonNullableBooleanSchema
} from './commonSchema.js';


export const utilisateurDataSchema = z.object({
   nom: z.string().min(1, { message: "Le nom de l'utilisateur est requis." }),
	prenom: z.string().min(1, { message: "Le prénom de l'utilisateur est requis." }),
	sexe:z.string().min(1, { message: "Le sexe de l'utilisateur est requis." }),
   email: z.string().min(1, { message: "Le courrier de l'utilisateur est requis." }),
   mdp: z.string().min(1, { message: "Le mot de passe de l'utilisateur est requis." }),
	taille: nonNullablePositifIntegerSchema("La taille"),
	point_bonus: nonNullablePositifIntegerSchema("Le nombre de point bonus hebdomadaire"),
	point_jour: nonNullablePositifIntegerSchema("Le nombre de point par jour")
}).strict();

export const utilisateurFiltreSchema = z.object({
	nom: z.string().min(1).optional(),
	uti_id : urlIntegerSchema("L'identifiant de l'utilisateur").optional()
}).strict();

export const utilisateurLoginSchema = z.object({
	email: z.string(),
	mdp: z.string()
}).strict();

export const utilisateurTokenSchema = z.object({
	token: z.string()	
}).strict();

export const urlUtilisateurIdSchema = z.object({
   id : urlIntegerSchema("L'identifiant de l'utilisateur")
});
 
export const utilisateurSchema = utilisateurDataSchema.extend({ id: nonNullablePositifStrictIntegerSchema("L'identifiant de l'utilisateur") }).strict(); 
export const utilisateurDataUpdateSchema = utilisateurDataSchema.omit({	
  mdp : true}
);

export const utilisateurDataUpdateMdpSchema = z.object({
	actuelMdp :z.string().min(1, { message: "Le mot de passe actuel de l'utilisateur est requis." }),
   nouveauMdp: z.string().min(1, { message: "Le nouveau mot de passe de l'utilisateur est requis." }),
});