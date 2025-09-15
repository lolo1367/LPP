// src/api/typesRepas.ts
import { logConsole } from '@ww/reference';
import api from './api';
import { handleApiError, handleApiCriticalError } from './handleApiError';

import {
    Repas,
    isAppError,
    CustomAppException,
    Resultat
} from '@ww/reference'; 

const emoji = "🍱​​";
const viewLog = true;
const module = "api/journalAlimentaire"; 

// ===========================================================================
// Fonction de chargement des types de repas
// ===========================================================================
export async function repasCharger (): Promise<Repas[]> {

   logConsole (viewLog, emoji, module + '/repasCharger',"DEBUT","");

    const uri = `/typeRepas`;
    logConsole (viewLog, emoji, module + '/repasCharger','uri', uri); 

    try {
        const response = await api.get(uri);
        return response.data as Promise<Repas[]>;

    } catch (error) {
        handleApiCriticalError(error, "repasCharger");
    }
};
