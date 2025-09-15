"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.suiviHebdoFiltreSchemas = exports.suiviHebdoDataSchema = void 0;
const zod_1 = require("zod");
const commonSchema_js_1 = require("./commonSchema.js");
exports.suiviHebdoDataSchema = zod_1.z.object({
    uti_id: (0, commonSchema_js_1.nonNullablePositifStrictIntegerSchema)("L'identifiant de l'utilisateur"),
    semaine: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
    point_bonus_initial: zod_1.z.number().int(),
    point_bonus_restant: zod_1.z.number().int().nonnegative(),
    point_journalier: zod_1.z.number().int().nonnegative(),
    point_lundi_utilise: zod_1.z.number().int().nonnegative(),
    point_mardi_utilise: zod_1.z.number().int().nonnegative(),
    point_mercredi_utilise: zod_1.z.number().int().nonnegative(),
    point_jeudi_utilise: zod_1.z.number().int().nonnegative(),
    point_vendredi_utilise: zod_1.z.number().int().nonnegative(),
    point_samedi_utilise: zod_1.z.number().int().nonnegative(),
    point_dimanche_utilise: zod_1.z.number().int().nonnegative(),
    point_total_initial: zod_1.z.number().int().nonnegative(),
    point_total_utilise: zod_1.z.number().int().nonnegative(),
    derniere_mise_a_jour: zod_1.z.string().optional() // format ISO retourné par SQLite
});
exports.suiviHebdoFiltreSchemas = zod_1.z.object({
    uti_id: (0, commonSchema_js_1.urlIntegerSchema)("L'identifiant de l'utilisateur"),
    date: zod_1.z.preprocess((val) => {
        if (typeof val !== 'string' || val.trim() === '')
            return undefined;
        // Validation manuelle format AAAA-MM-JJ
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(val)) {
            throw new Error("Le format de la date doit être AAAA-MM-JJ.");
        }
        const date = new Date(val);
        if (isNaN(date.getTime()) || !date.toISOString().startsWith(val)) {
            throw new Error("La date n'est pas valide (ex. 2025-02-30 est invalide).");
        }
        return date;
    }, zod_1.z.date())
}).strict();
