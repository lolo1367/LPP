"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ligneJournalAlimentaireFiltreSchemas = exports.ligneJournalAlimentaireCompletSchema = exports.ligneJournalAlimentaireSimpleSchema = exports.urlLigneJournalAlimentaireIdSchema = exports.ligneJournalAlimentaireDataCompletSchema = exports.ligneJournalAlimentaireDataSimpleSchema = void 0;
const zod_1 = require("zod");
const commonSchema_js_1 = require("./commonSchema.js");
const repasSchema_js_1 = require("./repasSchema.js");
const alimentSchema_js_1 = require("./alimentSchema.js");
exports.ligneJournalAlimentaireDataSimpleSchema = zod_1.z.object({
    uti: (0, commonSchema_js_1.nonNullablePositifStrictIntegerSchema)("L'identifiant de l'utilisateur"),
    date: (0, commonSchema_js_1.dateIsoSchema)("La date du journal alimentaire"),
    alimentId: (0, commonSchema_js_1.nonNullablePositifStrictIntegerSchema)("L'identifiant de l'aliment"),
    typeRepasId: (0, commonSchema_js_1.nonNullablePositifStrictIntegerSchema)("L'identifiant du type de repas"),
    quantite: (0, commonSchema_js_1.nonNullablePositifDecimalSchema)("Le nombre de portion", 2),
    points: (0, commonSchema_js_1.nonNullablePositifIntegerSchema)("Le nombre de point"),
    unite: zod_1.z.string().min(1, { message: "L'unité est requise." })
});
exports.ligneJournalAlimentaireDataCompletSchema = zod_1.z.object({
    id: (0, commonSchema_js_1.nonNullablePositifStrictIntegerSchema)("L'identifiant de la ligne du journal alimentaire"),
    uti_id: (0, commonSchema_js_1.nonNullablePositifStrictIntegerSchema)("L'identifiant de l'utilisateur"),
    date: (0, commonSchema_js_1.dateIsoSchema)("La date du journal alimentaire"),
    aliment: alimentSchema_js_1.alimentSchema,
    repas: repasSchema_js_1.repasSchema,
    quantite: (0, commonSchema_js_1.nonNullablePositifDecimalSchema)("Le nombre de portion", 2),
    points: (0, commonSchema_js_1.nonNullablePositifIntegerSchema)("Le nombre de point"),
    unite: zod_1.z.string().min(1, { message: "L'unité est requise." })
});
exports.urlLigneJournalAlimentaireIdSchema = zod_1.z.object({
    id: (0, commonSchema_js_1.urlIntegerSchema)("L'identifiant de la ligne de journal alimentaire")
});
exports.ligneJournalAlimentaireSimpleSchema = exports.ligneJournalAlimentaireDataSimpleSchema.extend({ id: (0, commonSchema_js_1.nonNullablePositifStrictIntegerSchema)("L'identifiant de la ligne de journal alimentaire") }).strict();
exports.ligneJournalAlimentaireCompletSchema = exports.ligneJournalAlimentaireDataCompletSchema.extend({ id: (0, commonSchema_js_1.nonNullablePositifStrictIntegerSchema)("L'identifiant de la ligne de journal alimentaire") }).strict();
exports.ligneJournalAlimentaireFiltreSchemas = zod_1.z.object({
    uti_id: (0, commonSchema_js_1.urlIntegerSchema)("L'identifiant de l'utilisateur"),
    date: (0, commonSchema_js_1.dateIsoSchema)("La date ").optional(),
    date_fin: (0, commonSchema_js_1.dateIsoSchema)("La date de fin").optional(),
    type_repas_id: (0, commonSchema_js_1.urlIntegerSchema)("L'identifiant du type de repas").optional(),
    ligne_id: (0, commonSchema_js_1.urlIntegerSchema)("L'identifiant de la ligne").optional()
}).strict();
