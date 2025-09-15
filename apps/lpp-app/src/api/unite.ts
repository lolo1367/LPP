// src/api/typesRepas.ts
import api from './api';
import { handleApiError ,handleApiCriticalError} from './handleApiError';

import {
    Unite,
    isAppError,
    CustomAppException,
    Resultat,
    logConsole
} from '@lpp/communs'; 

const emoji = "📏​​​";
const viewLog = false;
const module = "api/unite"; 

// ===========================================================================
// Fonction d'ajout d'une ligne de journal de poids
// ===========================================================================
export async function uniteCharger (): Promise<Unite[]> {

   logConsole(viewLog, emoji, module + '/uniteCharger', "DEBUT", "");
   const uri = `/unite`;
   logConsole(viewLog, emoji, module + '/uniteCharger', 'uri', uri); 
   try {
      
      const response = await api.get(uri);
      return response.data as Promise<Unite[]>;


   } catch (error: any) {
      handleApiCriticalError(error, "uniteCharger");
   }
}
