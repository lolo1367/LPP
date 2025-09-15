	// ==IMPORT      ==================================================================================
	import { Request, Response, NextFunction } from "express";
	import { ZodError } from "zod";
	import { logConsole } from "./logger.js";

	// == TYPE, ENUM, INTERFACE  =======================================================================
	export enum ApiCodeErreur {
		parsing= "PARSING SQL",
		param = "PARAMETRES",
		contrainte = "CONTRAINTE",
		inconnu = "INCONNU",
		bdReference = "BASE DE REFERENCE",
		reqInvalide = "REQUETE INVALIDE",
		urlInconnue = "URL INCONNUE",
		authentification = "ERREUR AUTHENTIFICATION"
	}
	
	export interface AppError {
		code: string;
		message: string;
		details?: string[];
	}

	export interface Resultat {
		success: boolean;
		message?: string;
		erreur?: AppError;
		donnees?: any 
	}

	export class ContraintBaseReferenceError extends Error {
	statusCode: number;

	constructor(message: string) {
		super(message);
		this.name = 'ContraintBaseReferenceError';
		this.statusCode = 400;
	}
	}

	// HttpException.ts
	export class HttpException extends Error {
		public status: number;
		public message: string;
		
		constructor(status: number, message: string) {
			super(message);
			this.status = status;
			this.message = message;
		}
	}

	// Classe d'erreur personnalisée
	export class CustomAppException extends Error implements Resultat {
		public success: boolean;
		public erreur?: AppError;
	
		constructor(resultat: Resultat) {
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

	// == DECLARATION     ==============================================================================
	const emoji = "🍔​";
	const viewLog = true;
	const module = 'ww-package/utilitaires/error';

	// == FONCTION        ==============================================================================

	// Fonction de garde de type pour vérifier si un objet est de type AppError
	export function isAppError(obj: any): obj is AppError {
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
											obj.details.every((detail: string) => typeof detail === 'string')); // <--- CORRECTION ICI
	
		return hasCodeAndMessage && hasOptionalDetails;
	}
	
	// Fonction format AppError
	export function formatAppError(error: AppError, useHtml = false): string {
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
	export function handleError(err: unknown, req: Request, res: Response, next: NextFunction) {
	logConsole(viewLog, emoji, module + '/handleError', 'Début', '-');

		// ✅ Cas 0 : Erreur HttpException personnalisée
		if (err instanceof HttpException) {
			logConsole(viewLog, emoji, module + '/handleError', 'Erreur HttpException : err', err);
			return res.status(err.status).json({
				code: ApiCodeErreur.authentification,
				message: err.message
			});	
		}
		
		// ✅ Cas 1 : Erreur de parsing JSON
		if (err instanceof SyntaxError && 'status' in err && (err as any).status === 400 && 'body' in err) {
			const erreurs: AppError = {
				code: ApiCodeErreur.parsing,
				message: "Erreur de syntaxe JSON dans la requête.",
				details: [err.message]      
			}
			return res.status(400).json(erreurs);
		} 
	
		// ✅ Cas 2 : Erreur validation Zod
		if (err instanceof ZodError) {
			logConsole(viewLog, emoji, module + '/handleError', 'Erreur de validation Zod : err', err);
			const details:string[]= err.issues.map(e => (e.message));

			const erreurs: AppError = {
				code: ApiCodeErreur.param,
				message: "Paramètres invalides",
				details: details
			}

			return res.status(400).json(erreurs);
		}
		
		// ✅ Cas 3 : Erreur de validation des données du dictionnaire de référence
		if (err instanceof ContraintBaseReferenceError) {
			const erreurs: AppError = {
				code: ApiCodeErreur.bdReference,
				message: "Erreur dans les données fournies du dictionnaire de référence",
				details: [err.message]
			}
			return res.status(err.statusCode).json(erreurs);
		}

	// ✅ Cas 4 : Erreurs generique
		if (err instanceof Error) {	
			logConsole(viewLog, emoji, module + '/handleError',"Cas ou l'erreur est de type ERROR",err.message);

			let status = (err as any)?.status;
	
			// Si status est undefined, null, 0 ou autre "falsy", on force à 500
			if (!status || typeof status !== 'number' || status < 100 || status > 599) {
			status = 500;
			}
			logConsole(viewLog, emoji, module + '/handleError',"- statut",status);
			
			// Erreur constrainte SQL
			if (status === 'SQLITE_CONSTRAINT') {
				return res.status(409).json({
					code: ApiCodeErreur.contrainte,
					message: "Conflit : cet élément existe déjà."
				});
			}
	
			if (status === 400) {
				const erreurs: AppError = {
					code: ApiCodeErreur.reqInvalide,
					message: "Requête invalide.",
					details: [err.message]
				}
			return res.status(400).json(erreurs);
			}

			if (status === 401) {
				const erreurs: AppError = {
					code: ApiCodeErreur.authentification,
					message: "Erreur lors de la vérification de l'authentification",
					details: [err.message]
				}
				return res.status(401).json(erreurs);	
			}

			if (status === 404) {
				const erreurs: AppError = {
					code: ApiCodeErreur.urlInconnue,
					message: "URL Inconnue.",
					details: [err.message]
				}
			return res.status(404).json(erreurs);
			}
	
			const erreurs: AppError = {
				code: ApiCodeErreur.inconnu,
				message: "Erreur interne du serveur.",
				details: [err.message]
			}
			return res.status(status).json(erreurs);
			
		}
		
	// ✅ Cas 5 : Erreur générique non prévue
		logConsole(viewLog, emoji, module + '/handleError', 'Erreur non prévue', err);
		const erreurs: AppError = {
			code: ApiCodeErreur.inconnu,
			message: "Erreur interne du serveur.",
			details: [String(err)]
		}
	return res.status(500).json(erreurs);

	} 
