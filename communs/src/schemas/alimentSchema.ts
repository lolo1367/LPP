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


export const alimentDataSchema = z.object({
	nom: z.string().min(1, { message: "Le nom de l'aliment est requis." }),

	quantite: nonNullablePositifIntegerSchema("La quantité"),

	unite: z.string().min(1, { message: "L'unité est requise." }),

	points: nonNullablePositifIntegerSchema("Le nombre de point"),

	categorie: categorieSchema,

	calories: nullablePositifDecimalSchema("Le nombre de calories",2),
	
	fibres: nullablePositifDecimalSchema("La quantité de fibres",2),

	proteines: nullablePositifDecimalSchema("La quantité de protéines",2),
	
	acideGrasSature: nullablePositifDecimalSchema("La quantité d'acide gras saturé",2),
	
	matieresGrasses: nullablePositifDecimalSchema("La quantité de matières grasses",2),

	glucides: nullablePositifDecimalSchema("La quantité d'acide gras saturé", 2),
	sel: nullablePositifDecimalSchema("La quantité de sel", 2),
	sucres: nullablePositifDecimalSchema("La quantité de sucre", 2),
	grammes: nullablePositifDecimalSchema("Le nombre de grammes", 2),

	zeroPoint: nonNullableBooleanSchema("L'indicateur 'Zero point'")
}).strict();

export const urlAlimentIdSchema = z.object({
  id : urlIntegerSchema("L'identifiant de l'aliment")
});

export const alimentFiltreSchema = z.object({
	nom: z.string().min(1).optional(),
	categorie_id : urlIntegerSchema("L'identifiant de la catégorie").optional()
}).strict();

export const alimentSchema = alimentDataSchema.extend({ id: nonNullablePositifStrictIntegerSchema("L'identifiant de l'aliment") }).strict(); 	

// == Aliments récents
export const alimentsRecentsFiltreSchema = z.object({
	uti_id: urlIntegerSchema("L'identifiant de l'utilisateur"),
	date_debut: dateIsoSchema("La date de debut "),
	date_fin: dateIsoSchema("La date de fin")
}).strict();

export const alimentRecentSchema = z.object({
	aliment: alimentSchema,
	date: dateIsoSchema("La date du journal alimentaire")
}).strict();