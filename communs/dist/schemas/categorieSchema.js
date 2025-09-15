"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categorieFiltreSchema = exports.categorieSchema = exports.urlCategorieIdSchema = exports.categorieDataSchema = void 0;
const zod_1 = require("zod");
const commonSchema_js_1 = require("./commonSchema.js");
/**
 * Données de base d'une categorie
 */
exports.categorieDataSchema = zod_1.z.object({
    nom: zod_1.z.string().min(1, { message: "Le nom de la catégorie est requis." })
}).strict();
exports.urlCategorieIdSchema = zod_1.z.object({
    id: (0, commonSchema_js_1.urlIntegerSchema)("L'identifiant de la categorie d'aliment")
});
exports.categorieSchema = exports.categorieDataSchema.extend({ id: (0, commonSchema_js_1.nonNullablePositifStrictIntegerSchema)("L'identifiant de la categorie d'aliment") }).strict();
exports.categorieFiltreSchema = zod_1.z.object({
    nom: zod_1.z.string().min(1).optional(),
}).strict();
