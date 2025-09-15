"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ligneJournalPoidsSchema = exports.urlLigneJournalPoidsIdSchema = exports.ligneJournalPoidsDataSchema = exports.ligneJournalPoidsFiltreSchemas = void 0;
const zod_1 = require("zod");
const commonSchema_js_1 = require("./commonSchema.js");
exports.ligneJournalPoidsFiltreSchemas = zod_1.z.object({
    uti_id: (0, commonSchema_js_1.urlIntegerSchema)("L'identifiant de l'utilisateur"),
    date_debut: (0, commonSchema_js_1.dateIsoSchema)("La date de début de la pésée").optional(),
    date_fin: (0, commonSchema_js_1.dateIsoSchema)("La date de fin de la pésée").optional(),
    ligne_id: (0, commonSchema_js_1.urlIntegerSchema)("L'identifiant de la ligne de journal du poids").optional()
}).strict();
exports.ligneJournalPoidsDataSchema = zod_1.z.object({
    uti_id: (0, commonSchema_js_1.nonNullablePositifStrictIntegerSchema)("L'identifiant de l'utilisateur"),
    date: (0, commonSchema_js_1.dateIsoSchema)("La date de la pésée"),
    poids: (0, commonSchema_js_1.nonNullablePositifDecimalSchema)("Le poids", 2),
});
exports.urlLigneJournalPoidsIdSchema = zod_1.z.object({
    id: (0, commonSchema_js_1.urlIntegerSchema)("L'identifiant de la ligne de journal du poids")
});
exports.ligneJournalPoidsSchema = exports.ligneJournalPoidsDataSchema.extend({ id: (0, commonSchema_js_1.nonNullablePositifStrictIntegerSchema)("L'identifiant de la ligne de journal du poids") }).strict();
