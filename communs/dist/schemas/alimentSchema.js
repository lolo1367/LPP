"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alimentRecentSchema = exports.alimentsRecentsFiltreSchema = exports.alimentSchema = exports.alimentFiltreSchema = exports.urlAlimentIdSchema = exports.alimentDataSchema = void 0;
const zod_1 = require("zod");
const categorieSchema_js_1 = require("./categorieSchema.js");
const commonSchema_js_1 = require("./commonSchema.js");
exports.alimentDataSchema = zod_1.z.object({
    nom: zod_1.z.string().min(1, { message: "Le nom de l'aliment est requis." }),
    quantite: (0, commonSchema_js_1.nonNullablePositifIntegerSchema)("La quantité"),
    unite: zod_1.z.string().min(1, { message: "L'unité est requise." }),
    points: (0, commonSchema_js_1.nonNullablePositifIntegerSchema)("Le nombre de point"),
    categorie: categorieSchema_js_1.categorieSchema,
    calories: (0, commonSchema_js_1.nullablePositifDecimalSchema)("Le nombre de calories", 2),
    fibres: (0, commonSchema_js_1.nullablePositifDecimalSchema)("La quantité de fibres", 2),
    proteines: (0, commonSchema_js_1.nullablePositifDecimalSchema)("La quantité de protéines", 2),
    acideGrasSature: (0, commonSchema_js_1.nullablePositifDecimalSchema)("La quantité d'acide gras saturé", 2),
    matieresGrasses: (0, commonSchema_js_1.nullablePositifDecimalSchema)("La quantité de matières grasses", 2),
    glucides: (0, commonSchema_js_1.nullablePositifDecimalSchema)("La quantité d'acide gras saturé", 2),
    sel: (0, commonSchema_js_1.nullablePositifDecimalSchema)("La quantité de sel", 2),
    sucres: (0, commonSchema_js_1.nullablePositifDecimalSchema)("La quantité de sucre", 2),
    zeroPoint: (0, commonSchema_js_1.nonNullableBooleanSchema)("L'indicateur 'Zero point'")
}).strict();
exports.urlAlimentIdSchema = zod_1.z.object({
    id: (0, commonSchema_js_1.urlIntegerSchema)("L'identifiant de l'aliment")
});
exports.alimentFiltreSchema = zod_1.z.object({
    nom: zod_1.z.string().min(1).optional(),
    categorie_id: (0, commonSchema_js_1.urlIntegerSchema)("L'identifiant de la catégorie").optional()
}).strict();
exports.alimentSchema = exports.alimentDataSchema.extend({ id: (0, commonSchema_js_1.nonNullablePositifStrictIntegerSchema)("L'identifiant de l'aliment") }).strict();
// == Aliments récents
exports.alimentsRecentsFiltreSchema = zod_1.z.object({
    uti_id: (0, commonSchema_js_1.urlIntegerSchema)("L'identifiant de l'utilisateur"),
    date_debut: (0, commonSchema_js_1.dateIsoSchema)("La date de debut "),
    date_fin: (0, commonSchema_js_1.dateIsoSchema)("La date de fin")
}).strict();
exports.alimentRecentSchema = zod_1.z.object({
    aliment: exports.alimentSchema,
    date: (0, commonSchema_js_1.dateIsoSchema)("La date du journal alimentaire")
}).strict();
