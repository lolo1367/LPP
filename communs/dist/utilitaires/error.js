"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomAppException = exports.HttpException = exports.ContraintBaseReferenceError = exports.ApiCodeErreur = void 0;
exports.isAppError = isAppError;
exports.formatAppError = formatAppError;
exports.handleError = handleError;
const zod_1 = require("zod");
const logger_js_1 = require("./logger.js");
// == TYPE, ENUM, INTERFACE  =======================================================================
var ApiCodeErreur;
(function (ApiCodeErreur) {
    ApiCodeErreur["parsing"] = "PARSING SQL";
    ApiCodeErreur["param"] = "PARAMETRES";
    ApiCodeErreur["contrainte"] = "CONTRAINTE";
    ApiCodeErreur["inconnu"] = "INCONNU";
    ApiCodeErreur["bdReference"] = "BASE DE REFERENCE";
    ApiCodeErreur["reqInvalide"] = "REQUETE INVALIDE";
    ApiCodeErreur["urlInconnue"] = "URL INCONNUE";
    ApiCodeErreur["authentification"] = "ERREUR AUTHENTIFICATION";
})(ApiCodeErreur || (exports.ApiCodeErreur = ApiCodeErreur = {}));
class ContraintBaseReferenceError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ContraintBaseReferenceError';
        this.statusCode = 400;
    }
}
exports.ContraintBaseReferenceError = ContraintBaseReferenceError;
// HttpException.ts
class HttpException extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.message = message;
    }
}
exports.HttpException = HttpException;
// Classe d'erreur personnalisée
class CustomAppException extends Error {
    constructor(resultat) {
        super(resultat.message); // Appelle le constructeur de la classe Error avec le message
        this.name = 'CustomAppException'; // Nom de l'erreur pour un meilleur débogage
        this.success = resultat.success;
        this.erreur = resultat.erreur;
        // Le code ci-dessous est important pour maintenir une trace de pile (stack trace)
        // correcte, surtout dans les environnements comme Node.js et les navigateurs modernes.
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomAppException);
        }
    }
}
exports.CustomAppException = CustomAppException;
// == DECLARATION     ==============================================================================
const emoji = "🍔​";
const viewLog = true;
const fichier = 'ww-package/utilitaires/error';
// == FONCTION        ==============================================================================
// Fonction de garde de type pour vérifier si un objet est de type AppError
function isAppError(obj) {
    // Vérifie si l'objet n'est pas nul et est bien un objet
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }
    // Vérifie si les propriétés 'code' et 'message' sont présentes et de type string
    const hasCodeAndMessage = 'code' in obj && typeof obj.code === 'string' &&
        'message' in obj && typeof obj.message === 'string';
    // Vérifie si la propriété 'details' est optionnelle et de type string[] si elle existe
    const hasOptionalDetails = !('details' in obj) ||
        (Array.isArray(obj.details) &&
            obj.details.every((detail) => typeof detail === 'string')); // <--- CORRECTION ICI
    return hasCodeAndMessage && hasOptionalDetails;
}
// Fonction format AppError
function formatAppError(error, useHtml = false) {
    const separator = useHtml ? '<br>' : '\n';
    const bullet = useHtml ? '• ' : '- '; // Vous pouvez utiliser '• ' pour un point ou '- ' pour un tiret
    let result = error.message;
    if (error.details && error.details.length > 0) {
        // Préfixe chaque détail avec la puce avant de les joindre
        const detailsWithBullets = error.details.map(detail => `${bullet}${detail}`);
        const detailsString = detailsWithBullets.join(separator);
        result += `${separator}${detailsString}`;
    }
    return result;
}
// Fonction handleError
function handleError(err, req, res, next) {
    (0, logger_js_1.logConsole)(viewLog, emoji, module + '/handleError', 'Début', '-');
    // ✅ Cas 0 : Erreur HttpException personnalisée
    if (err instanceof HttpException) {
        (0, logger_js_1.logConsole)(viewLog, emoji, module + '/handleError', 'Erreur HttpException : err', err);
        return res.status(err.status).json({
            code: ApiCodeErreur.authentification,
            message: err.message
        });
    }
    // ✅ Cas 1 : Erreur de parsing JSON
    if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
        const erreurs = {
            code: ApiCodeErreur.parsing,
            message: "Erreur de syntaxe JSON dans la requête.",
            details: [err.message]
        };
        return res.status(400).json(erreurs);
    }
    // ✅ Cas 2 : Erreur validation Zod
    if (err instanceof zod_1.ZodError) {
        (0, logger_js_1.logConsole)(viewLog, emoji, module + '/handleError', 'Erreur de validation Zod : err', err);
        const details = err.issues.map(e => (e.message));
        const erreurs = {
            code: ApiCodeErreur.param,
            message: "Paramètres invalides",
            details: details
        };
        return res.status(400).json(erreurs);
    }
    // ✅ Cas 3 : Erreur de validation des données du dictionnaire de référence
    if (err instanceof ContraintBaseReferenceError) {
        const erreurs = {
            code: ApiCodeErreur.bdReference,
            message: "Erreur dans les données fournies du dictionnaire de référence",
            details: [err.message]
        };
        return res.status(err.statusCode).json(erreurs);
    }
    // ✅ Cas 4 : Erreurs generique
    if (err instanceof Error) {
        (0, logger_js_1.logConsole)(viewLog, emoji, module + '/handleError', "Cas ou l'erreur est de type ERROR", err.message);
        let status = err?.status;
        // Si status est undefined, null, 0 ou autre "falsy", on force à 500
        if (!status || typeof status !== 'number' || status < 100 || status > 599) {
            status = 500;
        }
        (0, logger_js_1.logConsole)(viewLog, emoji, module + '/handleError', "- statut", status);
        // Erreur constrainte SQL
        if (status === 'SQLITE_CONSTRAINT') {
            return res.status(409).json({
                code: ApiCodeErreur.contrainte,
                message: "Conflit : cet élément existe déjà."
            });
        }
        if (status === 400) {
            const erreurs = {
                code: ApiCodeErreur.reqInvalide,
                message: "Requête invalide.",
                details: [err.message]
            };
            return res.status(400).json(erreurs);
        }
        if (status === 401) {
            const erreurs = {
                code: ApiCodeErreur.authentification,
                message: "Erreur lors de la vérification de l'authentification",
                details: [err.message]
            };
            return res.status(401).json(erreurs);
        }
        if (status === 404) {
            const erreurs = {
                code: ApiCodeErreur.urlInconnue,
                message: "URL Inconnue.",
                details: [err.message]
            };
            return res.status(404).json(erreurs);
        }
        const erreurs = {
            code: ApiCodeErreur.inconnu,
            message: "Erreur interne du serveur.",
            details: [err.message]
        };
        return res.status(status).json(erreurs);
    }
    // ✅ Cas 5 : Erreur générique non prévue
    (0, logger_js_1.logConsole)(viewLog, emoji, module + '/handleError', 'Erreur non prévue', err);
    const erreurs = {
        code: ApiCodeErreur.inconnu,
        message: "Erreur interne du serveur.",
        details: [String(err)]
    };
    return res.status(500).json(erreurs);
}
