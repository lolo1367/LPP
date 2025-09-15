import { Request, Response, NextFunction } from "express";
export declare enum ApiCodeErreur {
    parsing = "PARSING SQL",
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
    donnees?: any;
}
export declare class ContraintBaseReferenceError extends Error {
    statusCode: number;
    constructor(message: string);
}
export declare class HttpException extends Error {
    status: number;
    message: string;
    constructor(status: number, message: string);
}
export declare class CustomAppException extends Error implements Resultat {
    success: boolean;
    erreur?: AppError;
    constructor(resultat: Resultat);
}
export declare function isAppError(obj: any): obj is AppError;
export declare function formatAppError(error: AppError, useHtml?: boolean): string;
export declare function handleError(err: unknown, req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>>;
