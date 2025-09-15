"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.utilisateurSchema = exports.urlUtilisateurIdSchema = exports.utilisateurTokenSchema = exports.utilisateurLoginSchema = exports.utilisateurFiltreSchema = exports.utilisateurDataSchema = void 0;
const zod_1 = require("zod");
const commonSchema_js_1 = require("./commonSchema.js");
exports.utilisateurDataSchema = zod_1.z.object({
    nom: zod_1.z.string().min(1, { message: "Le nom de l'utilisateur est requis." }),
    prenom: zod_1.z.string().min(1, { message: "Le prénom de l'utilisateur est requis." }),
    sexe: zod_1.z.string().min(1, { message: "Le sexe de l'utilisateur est requis." }),
    email: zod_1.z.string().min(1, { message: "Le courrier de l'utilisateur est requis." }),
    mdp: zod_1.z.string().min(1, { message: "Le mot de passe de l'utilisateur est requis." }),
    taille: (0, commonSchema_js_1.nonNullablePositifIntegerSchema)("La taille"),
    point_bonus: (0, commonSchema_js_1.nonNullablePositifIntegerSchema)("Le nombre de point bonus hebdomadaire"),
    point_jour: (0, commonSchema_js_1.nonNullablePositifIntegerSchema)("Le nombre de point par jour")
}).strict();
exports.utilisateurFiltreSchema = zod_1.z.object({
    nom: zod_1.z.string().min(1).optional(),
    uti_id: (0, commonSchema_js_1.urlIntegerSchema)("L'identifiant de l'utilisateur").optional()
}).strict();
exports.utilisateurLoginSchema = zod_1.z.object({
    email: zod_1.z.string(),
    mdp: zod_1.z.string()
}).strict();
exports.utilisateurTokenSchema = zod_1.z.object({
    token: zod_1.z.string()
}).strict();
exports.urlUtilisateurIdSchema = zod_1.z.object({
    id: (0, commonSchema_js_1.urlIntegerSchema)("L'identifiant de l'utilisateur")
});
exports.utilisateurSchema = exports.utilisateurDataSchema.extend({ id: (0, commonSchema_js_1.nonNullablePositifStrictIntegerSchema)("L'identifiant de l'utilisateur") }).strict();
