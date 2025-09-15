"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniteFiltreSchema = exports.uniteSchema = exports.uniteDataSchema = void 0;
const zod_1 = require("zod");
/**
 * Données de base d'une unite
 */
exports.uniteDataSchema = zod_1.z.object({
    unite: zod_1.z.string().min(1, { message: "Le nom de l'unité est requis." })
}).strict();
exports.uniteSchema = exports.uniteDataSchema.strict();
exports.uniteFiltreSchema = zod_1.z.object({
    unite: zod_1.z.string().min(1).optional(),
}).strict();
