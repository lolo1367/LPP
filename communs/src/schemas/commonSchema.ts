	import {z} from 'zod' ;
import { issue } from 'zod/v4/core/util.cjs';
import { format } from "date-fns";


/* ======================================================================= */
/* Contrôle des données passées via URL : ! Ceux sont toujours des string  */
/* ======================================================================= */

export const urlnullableIntegerSchema = (fieldName: string) => {
	return z.string().transform<number | null>((val, ctx) => {
		if (val.trim() === '') return null;

		const parsed = Number(val);
		if (!Number.isInteger(parsed)) {
			ctx.addIssue({
				code: "custom",
				message: `${fieldName} doit être un nombre entier.`
			});
			return z.NEVER;
		}
		return parsed;
	});
};
	
export const urlIntegerSchema = (fieldName: string) => {
	return z.string().transform<number>((val, ctx) => {
	
		if (val.trim() === '') {
			ctx.addIssue({
				code: "custom",
				message: `${fieldName} doit être renseigné et c'est un nombre entier ${val}.`
			});
			return z.NEVER;
		}
	  
		const parsed = Number(val);
		if (!Number.isInteger(parsed)) {
			ctx.addIssue({
				code: "custom",
				message: `${fieldName} doit être un nombre entier.`
			});
			return z.NEVER;
		}
	  
		return parsed;
	});
};

/* ======================================================================= */
/* Contrôle des données passées par le body : Les données sont bien typées */
/* ======================================================================= */

/************************* */
/* NOMBRE                  */
/************************* */

export const nonNullableNumberSchema = (fieldName: string) => {
	return z.number({
		error: (issue) => {
			if (issue.code === "invalid_type" && issue.received === 'null') {
				return `${fieldName} est un nombre et il doit être valorisé(e).`;
			}
			if (issue.code === "invalid_type") {
				return `${fieldName} doit être un nombre.`;
			}
			return issue.message; // Retourne le message par défaut de Zod pour d'autres types d'erreurs
		}
	})
};

export const nullableNumberSchema = (fieldName: string) => {
	return nonNullableNumberSchema (fieldName)
		.nullable()
};


/************************* */
/* NOMBRE ENTIER           */
/************************* */

export const nonNullableIntegerSchema = (fieldName: string) => {
	return nonNullableNumberSchema(fieldName)
		.int(`${fieldName} doit être un nombre entier.`) // Assure que c'est un entier
};

export const nullableIntegerSchema = (fieldName: string) => {
	return z.number({
		error: (issue) => {
			if (issue.code === "invalid_type") {
			return `${fieldName} doit être un nombre entier.`;
			}
			return issue.message; // Retourne le message par défaut de Zod pour d'autres types d'erreurs
		}
	})
	.int(`${fieldName} doit être un nombre entier.`) // Assure que c'est un entier
	.nullable()
};


/******************************** */
/* NOMBRE ENTIER POSITIF STRICT   */
/******************************** */

export const nonNullablePositifStrictIntegerSchema = (fieldName: string) => {
	return nonNullableIntegerSchema(fieldName)
		.positive(`${fieldName} doit être un nombre positif (supérieur à 0).`) // Assure que c'est > 0 et non nul
	};

export const nullablePositifStrictIntegerSchema = (fieldName: string) => {
	return z.number({
		
		error: (issue) => {
			if (issue.code === "invalid_type") {
			return `${fieldName} doit être un nombre.`;
			}
			return issue.message; // Retourne le message par défaut de Zod pour d'autres types d'erreurs
		}
	})
	.positive(`${fieldName} doit être un nombre positif (supérieur à 0).`) // Assure que c'est > 0 et non nul
	.int(`${fieldName} doit être un nombre entier.`) // Assure que c'est un entier
	.nullable()
};

/******************************** */
/* NOMBRE ENTIER POSITIF          */
/******************************** */

export const nonNullablePositifIntegerSchema = (fieldName: string) =>
	z.number()
		.int({ message: `${fieldName} doit être un entier.` })
		.min(0, { message: `${fieldName} doit être positif ou égal à 0.` });
 
 

 
 
 export const nullablePositifIntegerSchema = (fieldName: string) =>
	z.number()
	  .int({ message: `${fieldName} doit être un entier.` })
	  .min(0, { message: `${fieldName} doit être positif ou égal à 0.` })
		.nullable();

 

 
/************************* */
/* NOMBRE A (N) DECIMALES */
/************************* */

export const nonNullableDecimalSchema = (fieldName: string, maxDecimal:number ) => {
	return nonNullableNumberSchema (fieldName)
	.refine(val => {
		const multiplier = Math.pow(10, maxDecimal);
		if (val === null) return true;
			return Number((val * multiplier).toFixed(0)) === val * multiplier;
		}, `${fieldName} peut avoir au maximum ${maxDecimal} décimale(s).`);
};

/* Base nullable */
// export const nullableDecimalSchema = (fieldName: string, maxDecimal:number ) => {
// 	return z.number({
// 		error: (issue) => {
// 			if (issue.code === "invalid_type") {
// 				return `${fieldName} doit être un nombre.`;
// 			}
// 			return issue.message; // Retourne le message par défaut de Zod pour d'autres types d'erreurs
// 		}
// 	})
// 	.refine(val => {
// 		const multiplier = Math.pow(10, maxDecimal);
// 		if (val === null) return true;
// 			return Number((val * multiplier).toFixed(0)) === val * multiplier;
// 		}, `${fieldName} peut avoir au maximum ${maxDecimal} décimale(s).`);
// };

/* Base nullable */
export const nullableDecimalSchema = (fieldName: string, maxDecimal: number) => {
  const regex = new RegExp(`^\\d+(\\.\\d{1,${maxDecimal}})?$`);

  return z.number({
    error: (issue) => {
      if (issue.code === "invalid_type") {
        return `${fieldName} doit être un nombre.`;
      }
      return issue.message; 
    }
  })
  .nullable() // Important pour gérer les valeurs nulles
  .refine(val => {
    // Si la valeur est null, elle est valide
    if (val === null) return true;

    // Convertissez le nombre en chaîne pour la validation
    const stringVal = String(val);

    // Vérifiez la valeur en utilisant la regex
    return regex.test(stringVal);
  }, `${fieldName} peut avoir au maximum ${maxDecimal} décimale(s).`);
};

/**************************************** */
/* NOMBRE A (N) DECIMALES POSITIF STRICT */
/**************************************** */

export const nonNullablePositifStrictDecimalSchema = (fieldName: string, maxDecimal: number) => {
	const multiplier = Math.pow(10, maxDecimal);
 
	return z.preprocess((val) => {
	  if (typeof val === 'string') return parseFloat(val);
	  return val; // si c'est déjà un number
	},
	  z.number()
		 .refine(val => Number((val * multiplier).toFixed(0)) === val * multiplier,
			`${fieldName} peut avoir au maximum ${maxDecimal} décimale(s).`
		 )
		 .refine(val => val > 0,
			`${fieldName} doit être un nombre positif (supérieur à 0).`
		 )
	);
 };
 

/* Base nullable */
export const nullablePositifStrictDecimalSchema = (fieldName: string, maxDecimal: number) => {
	const multiplier = Math.pow(10, maxDecimal);
 
	return z.preprocess((val) => {
	  if (val === null || val === undefined) return null;
	  if (typeof val === 'string') return parseFloat(val);
	  return val;
	},
	  z.number()
		 .nullable()
		 .refine(val => {
			if (val === null) return true;
			// Vérifie le nombre de décimales
			return Number((val * multiplier).toFixed(0)) === val * multiplier;
		 }, `${fieldName} peut avoir au maximum ${maxDecimal} décimale(s).`)
		 .refine(val => val === null || val > 0, `${fieldName} doit être un nombre positif (supérieur à 0).`)
	);
 };
 

/********************************** */
/* NOMBRE A (N) DECIMALES POSITIF   */
/********************************** */

export const nonNullablePositifDecimalSchema = (fieldName: string, maxDecimal: number) => {
	const regex = new RegExp(`^\\d+(\\.\\d{1,${maxDecimal}})?$`);
 
	return z.preprocess((val) => {
	  if (typeof val === 'string') return parseFloat(val);
	  return val; // si c'est déjà un number
	},
	z.number()
	  .min(0, `${fieldName} doit être un nombre positif ou égal à 0.`)
	  .refine(val => regex.test(String(val)),
		 `${fieldName} peut avoir au maximum ${maxDecimal} décimale(s).`
	  )
	);
 };



export const nullablePositifDecimalSchema = (fieldName: string, maxDecimal: number) => {
	const regex = new RegExp(`^\\d+(\\.\\d{1,${maxDecimal}})?$`);
 
	return z.preprocess((val) => {
	  if (val === null || val === undefined) return null;
	  if (typeof val === 'string') return parseFloat(val);
	  return val; // si c'est déjà un number
	},
	z.number()
	  .min(0, `${fieldName} doit être un nombre positif ou égal à 0.`)
	  .nullable()
	  .refine(val => {
		 if (val === null) return true;
		 return regex.test(String(val));
	  }, `${fieldName} peut avoir au maximum ${maxDecimal} décimale(s).`)
	);
 };
 

/********************************** */
/* BOOLEEN                          */
/********************************** */

export const nonNullableBooleanSchema = (fieldName: string) => {
return z.boolean({
		error: (issue) => {
		if (issue.code === "invalid_type" && issue.received === 'null') {
			return `${fieldName} ne peut pas être nul (null).`;
		}
		if (issue.code === "invalid_type") {
			return `${fieldName} doit être un booléen (true/false | vrai/faux).`;
		}
		return issue.message; // Retourne le message par défaut de Zod pour d'autres types d'erreurs
		}
	})
};

export const idsQuerySchema = (fieldName: string) => {
	return z.object({
		ids: z
			.union([z.string(), z.array(z.string())])
			.transform((val) => Array.isArray(val) ? val : [val])
			.transform((arr) => arr.map((v) => urlIntegerSchema(fieldName).parse(v)))  // applique le schéma unitaire
	});
};

export const undefinedDateIsoSchema = (fieldName: string) => {
	return z.string().transform<string | undefined>((val, ctx) => {
		
		// Le paramètre n'est pas une chaine de caractère
		if (typeof val !== 'string' || val.trim() === "") {
			return undefined;
		} 

		// Le paramètre est une chaine, on vérifie son format AAAA-MM-JJ
		const regex = /^\d{4}-\d{2}-\d{2}$/;
		if (!regex.test(val)) {
			throw new Error(`${fieldName} doit avoir le format AAAA-MM-JJ.`);
		}

		const date = new Date(val);
		if (isNaN(date.getTime()) || !date.toISOString().startsWith(val)) {
			throw new Error(`${fieldName} doit avoir le format AAAA-MM-JJ. (ex. 2025-02-30 est invalide).`);
		}
		
		return format(date, 'yyyy-MM-dd');
	})
}

export const dateIsoSchema = (fieldName: string) => {
	return z.string().transform<string>((val, ctx) => {
		
		console.log(`Val : ${val} `);

		// Le paramètre n'est pas une chaine de caractère
		if (typeof val !== 'string' || val.trim() === "") {
			throw new Error(`${fieldName} doit être renseignée (format AAAA-MM-JJ).`);
		} 

		// Le paramètre est une chaine, on vérifie son format AAAA-MM-JJ
		const regex = /^\d{4}-\d{2}-\d{2}$/;
		if (!regex.test(val)) {
			throw new Error(`${fieldName} doit avoir le format AAAA-MM-JJ.`);
		}

		const date = new Date(val);
		console.log(`date : ${date} `);
		if (isNaN(date.getTime()) || !date.toISOString().startsWith(val)) {
			throw new Error(`${fieldName} doit avoir le format AAAA-MM-JJ. (ex. 2025-02-30 est invalide).`);
		}

		const strDate = format (date,'yyyy-MM-dd');
		console.log(`strDate : ${strDate} `);
		
		return strDate; 
	})
}