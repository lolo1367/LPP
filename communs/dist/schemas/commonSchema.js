"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateIsoSchema = exports.undefinedDateIsoSchema = exports.idsQuerySchema = exports.nonNullableBooleanSchema = exports.nullablePositifDecimalSchema = exports.nonNullablePositifDecimalSchema = exports.nullablePositifStrictDecimalSchema = exports.nonNullablePositifStrictDecimalSchema = exports.nullableDecimalSchema = exports.nonNullableDecimalSchema = exports.nullablePositifIntegerSchema = exports.nonNullablePositifIntegerSchema = exports.nullablePositifStrictIntegerSchema = exports.nonNullablePositifStrictIntegerSchema = exports.nullableIntegerSchema = exports.nonNullableIntegerSchema = exports.nullableNumberSchema = exports.nonNullableNumberSchema = exports.urlIntegerSchema = exports.urlnullableIntegerSchema = void 0;
const zod_1 = require("zod");
const date_fns_1 = require("date-fns");
/* ======================================================================= */
/* Contrôle des données passées via URL : ! Ceux sont toujours des string  */
/* ======================================================================= */
const urlnullableIntegerSchema = (fieldName) => {
    return zod_1.z.string().transform((val, ctx) => {
        if (val.trim() === '')
            return null;
        const parsed = Number(val);
        if (!Number.isInteger(parsed)) {
            ctx.addIssue({
                code: "custom",
                message: `${fieldName} doit être un nombre entier.`
            });
            return zod_1.z.NEVER;
        }
        return parsed;
    });
};
exports.urlnullableIntegerSchema = urlnullableIntegerSchema;
const urlIntegerSchema = (fieldName) => {
    return zod_1.z.string().transform((val, ctx) => {
        if (val.trim() === '') {
            ctx.addIssue({
                code: "custom",
                message: `${fieldName} doit être renseigné et c'est un nombre entier ${val}.`
            });
            return zod_1.z.NEVER;
        }
        const parsed = Number(val);
        if (!Number.isInteger(parsed)) {
            ctx.addIssue({
                code: "custom",
                message: `${fieldName} doit être un nombre entier.`
            });
            return zod_1.z.NEVER;
        }
        return parsed;
    });
};
exports.urlIntegerSchema = urlIntegerSchema;
/* ======================================================================= */
/* Contrôle des données passées par le body : Les données sont bien typées */
/* ======================================================================= */
/************************* */
/* NOMBRE                  */
/************************* */
const nonNullableNumberSchema = (fieldName) => {
    return zod_1.z.number({
        error: (issue) => {
            if (issue.code === "invalid_type" && issue.received === 'null') {
                return `${fieldName} est un nombre et il doit être valorisé(e).`;
            }
            if (issue.code === "invalid_type") {
                return `${fieldName} doit être un nombre.`;
            }
            return issue.message; // Retourne le message par défaut de Zod pour d'autres types d'erreurs
        }
    });
};
exports.nonNullableNumberSchema = nonNullableNumberSchema;
const nullableNumberSchema = (fieldName) => {
    return (0, exports.nonNullableNumberSchema)(fieldName)
        .nullable();
};
exports.nullableNumberSchema = nullableNumberSchema;
/************************* */
/* NOMBRE ENTIER           */
/************************* */
const nonNullableIntegerSchema = (fieldName) => {
    return (0, exports.nonNullableNumberSchema)(fieldName)
        .int(`${fieldName} doit être un nombre entier.`); // Assure que c'est un entier
};
exports.nonNullableIntegerSchema = nonNullableIntegerSchema;
const nullableIntegerSchema = (fieldName) => {
    return zod_1.z.number({
        error: (issue) => {
            if (issue.code === "invalid_type") {
                return `${fieldName} doit être un nombre entier.`;
            }
            return issue.message; // Retourne le message par défaut de Zod pour d'autres types d'erreurs
        }
    })
        .int(`${fieldName} doit être un nombre entier.`) // Assure que c'est un entier
        .nullable();
};
exports.nullableIntegerSchema = nullableIntegerSchema;
/******************************** */
/* NOMBRE ENTIER POSITIF STRICT   */
/******************************** */
const nonNullablePositifStrictIntegerSchema = (fieldName) => {
    return (0, exports.nonNullableIntegerSchema)(fieldName)
        .positive(`${fieldName} doit être un nombre positif (supérieur à 0).`); // Assure que c'est > 0 et non nul
};
exports.nonNullablePositifStrictIntegerSchema = nonNullablePositifStrictIntegerSchema;
const nullablePositifStrictIntegerSchema = (fieldName) => {
    return zod_1.z.number({
        error: (issue) => {
            if (issue.code === "invalid_type") {
                return `${fieldName} doit être un nombre.`;
            }
            return issue.message; // Retourne le message par défaut de Zod pour d'autres types d'erreurs
        }
    })
        .positive(`${fieldName} doit être un nombre positif (supérieur à 0).`) // Assure que c'est > 0 et non nul
        .int(`${fieldName} doit être un nombre entier.`) // Assure que c'est un entier
        .nullable();
};
exports.nullablePositifStrictIntegerSchema = nullablePositifStrictIntegerSchema;
/******************************** */
/* NOMBRE ENTIER POSITIF          */
/******************************** */
const nonNullablePositifIntegerSchema = (fieldName) => zod_1.z.number()
    .int({ message: `${fieldName} doit être un entier.` })
    .min(0, { message: `${fieldName} doit être positif ou égal à 0.` });
exports.nonNullablePositifIntegerSchema = nonNullablePositifIntegerSchema;
const nullablePositifIntegerSchema = (fieldName) => zod_1.z.number()
    .int({ message: `${fieldName} doit être un entier.` })
    .min(0, { message: `${fieldName} doit être positif ou égal à 0.` })
    .nullable();
exports.nullablePositifIntegerSchema = nullablePositifIntegerSchema;
/************************* */
/* NOMBRE A (N) DECIMALES */
/************************* */
const nonNullableDecimalSchema = (fieldName, maxDecimal) => {
    return (0, exports.nonNullableNumberSchema)(fieldName)
        .refine(val => {
        const multiplier = Math.pow(10, maxDecimal);
        if (val === null)
            return true;
        return Number((val * multiplier).toFixed(0)) === val * multiplier;
    }, `${fieldName} peut avoir au maximum ${maxDecimal} décimale(s).`);
};
exports.nonNullableDecimalSchema = nonNullableDecimalSchema;
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
const nullableDecimalSchema = (fieldName, maxDecimal) => {
    const regex = new RegExp(`^\\d+(\\.\\d{1,${maxDecimal}})?$`);
    return zod_1.z.number({
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
        if (val === null)
            return true;
        // Convertissez le nombre en chaîne pour la validation
        const stringVal = String(val);
        // Vérifiez la valeur en utilisant la regex
        return regex.test(stringVal);
    }, `${fieldName} peut avoir au maximum ${maxDecimal} décimale(s).`);
};
exports.nullableDecimalSchema = nullableDecimalSchema;
/**************************************** */
/* NOMBRE A (N) DECIMALES POSITIF STRICT */
/**************************************** */
const nonNullablePositifStrictDecimalSchema = (fieldName, maxDecimal) => {
    const multiplier = Math.pow(10, maxDecimal);
    return zod_1.z.preprocess((val) => {
        if (typeof val === 'string')
            return parseFloat(val);
        return val; // si c'est déjà un number
    }, zod_1.z.number()
        .refine(val => Number((val * multiplier).toFixed(0)) === val * multiplier, `${fieldName} peut avoir au maximum ${maxDecimal} décimale(s).`)
        .refine(val => val > 0, `${fieldName} doit être un nombre positif (supérieur à 0).`));
};
exports.nonNullablePositifStrictDecimalSchema = nonNullablePositifStrictDecimalSchema;
/* Base nullable */
const nullablePositifStrictDecimalSchema = (fieldName, maxDecimal) => {
    const multiplier = Math.pow(10, maxDecimal);
    return zod_1.z.preprocess((val) => {
        if (val === null || val === undefined)
            return null;
        if (typeof val === 'string')
            return parseFloat(val);
        return val;
    }, zod_1.z.number()
        .nullable()
        .refine(val => {
        if (val === null)
            return true;
        // Vérifie le nombre de décimales
        return Number((val * multiplier).toFixed(0)) === val * multiplier;
    }, `${fieldName} peut avoir au maximum ${maxDecimal} décimale(s).`)
        .refine(val => val === null || val > 0, `${fieldName} doit être un nombre positif (supérieur à 0).`));
};
exports.nullablePositifStrictDecimalSchema = nullablePositifStrictDecimalSchema;
/********************************** */
/* NOMBRE A (N) DECIMALES POSITIF   */
/********************************** */
const nonNullablePositifDecimalSchema = (fieldName, maxDecimal) => {
    const regex = new RegExp(`^\\d+(\\.\\d{1,${maxDecimal}})?$`);
    return zod_1.z.preprocess((val) => {
        if (typeof val === 'string')
            return parseFloat(val);
        return val; // si c'est déjà un number
    }, zod_1.z.number()
        .min(0, `${fieldName} doit être un nombre positif ou égal à 0.`)
        .refine(val => regex.test(String(val)), `${fieldName} peut avoir au maximum ${maxDecimal} décimale(s).`));
};
exports.nonNullablePositifDecimalSchema = nonNullablePositifDecimalSchema;
const nullablePositifDecimalSchema = (fieldName, maxDecimal) => {
    const regex = new RegExp(`^\\d+(\\.\\d{1,${maxDecimal}})?$`);
    return zod_1.z.preprocess((val) => {
        if (val === null || val === undefined)
            return null;
        if (typeof val === 'string')
            return parseFloat(val);
        return val; // si c'est déjà un number
    }, zod_1.z.number()
        .min(0, `${fieldName} doit être un nombre positif ou égal à 0.`)
        .nullable()
        .refine(val => {
        if (val === null)
            return true;
        return regex.test(String(val));
    }, `${fieldName} peut avoir au maximum ${maxDecimal} décimale(s).`));
};
exports.nullablePositifDecimalSchema = nullablePositifDecimalSchema;
/********************************** */
/* BOOLEEN                          */
/********************************** */
const nonNullableBooleanSchema = (fieldName) => {
    return zod_1.z.boolean({
        error: (issue) => {
            if (issue.code === "invalid_type" && issue.received === 'null') {
                return `${fieldName} ne peut pas être nul (null).`;
            }
            if (issue.code === "invalid_type") {
                return `${fieldName} doit être un booléen (true/false | vrai/faux).`;
            }
            return issue.message; // Retourne le message par défaut de Zod pour d'autres types d'erreurs
        }
    });
};
exports.nonNullableBooleanSchema = nonNullableBooleanSchema;
const idsQuerySchema = (fieldName) => {
    return zod_1.z.object({
        ids: zod_1.z
            .union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())])
            .transform((val) => Array.isArray(val) ? val : [val])
            .transform((arr) => arr.map((v) => (0, exports.urlIntegerSchema)(fieldName).parse(v))) // applique le schéma unitaire
    });
};
exports.idsQuerySchema = idsQuerySchema;
const undefinedDateIsoSchema = (fieldName) => {
    return zod_1.z.string().transform((val, ctx) => {
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
        return (0, date_fns_1.format)(date, 'yyyy-MM-dd');
    });
};
exports.undefinedDateIsoSchema = undefinedDateIsoSchema;
const dateIsoSchema = (fieldName) => {
    return zod_1.z.string().transform((val, ctx) => {
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
        const strDate = (0, date_fns_1.format)(date, 'yyyy-MM-dd');
        console.log(`strDate : ${strDate} `);
        return strDate;
    });
};
exports.dateIsoSchema = dateIsoSchema;
