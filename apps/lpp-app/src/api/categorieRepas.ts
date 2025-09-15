// src/api/categorie.ts
import { logConsole } from '@lpp/communs';
import api from './api';
import { handleApiError, handleApiCriticalError } from './handleApiError';

import {
    Categorie,
    isAppError,
    CustomAppException,
    Resultat
} from '@lpp/communs'; 

const emoji = "🥒​​";
const viewLog = false;
const module = "api/categorie"; 

/**
 * Charge tous les categories disponibles.
 * @returns {Promise<Categorie[]>} - Promesse d'un tableau d'objets .
 * @throws Lance une erreur si le chargement des categories est en erreur.
 */
async function categorieCharger (nom?: string): Promise<Categorie[]> {

    logConsole(viewLog, emoji, module + '/categorieCharger', "DEBUT", "");
    
    const uri = `/categorie${(nom) ? "?nom=" + nom : ""}`;
    logConsole(viewLog, emoji, module + '/categorieCharger', 'uri', uri); 

    try {
        const response = await api.get(uri);
        return response.data as Promise<Categorie[]>;

    } catch (error) {
        handleApiCriticalError(error, "categorieCharger");
    }
};

export {
    categorieCharger
};