"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repasSchema = exports.urlRepasIdSchema = exports.repasDataSchema = void 0;
const zod_1 = require("zod");
const commonSchema_js_1 = require("./commonSchema.js");
/**
 * Données de base d'une categorie
 */
exports.repasDataSchema = zod_1.z.object({
    nom: zod_1.z.string().min(1, { message: "Le nom du type de repas est requis." }),
    icone: zod_1.z.string().min(1, { message: "Le nom de l'icone est requis." }),
    ordre: (0, commonSchema_js_1.nonNullablePositifStrictIntegerSchema)("Le numero d'ordre"),
}).strict();
exports.urlRepasIdSchema = zod_1.z.object({
    id: (0, commonSchema_js_1.urlIntegerSchema)("L'identifiant du repas")
});
exports.repasSchema = exports.repasDataSchema.extend({ id: (0, commonSchema_js_1.nonNullablePositifStrictIntegerSchema)("L'identifiant du type de repas") }).strict();
