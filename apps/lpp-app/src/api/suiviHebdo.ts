import api from './api';
import { handleApiError, handleApiCriticalError } from './handleApiError';

import {logConsole} from '@lpp/communs';
import { format } from 'date-fns'
import {
   SuiviHebdo,
   isAppError,
   CustomAppException,
   Resultat
} from '@lpp/communs';

const viewLog = true;
const emoji = "👑​";
const module = "suiviHebdo.ts"

// ===========================================================================
// Fonction de chargement du suivi hebdomadaire
// ===========================================================================
/**
 * Charge le suivi hebomadaire pour une date donnée
 * @param {Date} date - Permet de selectionner la semaine 
 * @returns {Promise<SuiviHebdo[]>} - Promsse données du suivi hebdomadaire
 *
 *@throws Lance une erreur si le chargement des lignes est en erreur
 */
export async function suiviHebdoCharger (utilisateurId: number, date : Date):Promise<SuiviHebdo[]>  {

   logConsole (viewLog, emoji, module + '/suiviHebdoCharger', 'date', date);
   logConsole (viewLog, emoji, module + '/suiviHebdoCharger','format(date,yyyy-MM-dd)',format(date,'yyyy-MM-dd'));

   // Transformation de la date en string 
   const dateStr = format(date, 'yyyy-MM-dd');
   
   const uri = `/suiviHebdo?uti_id=${utilisateurId}&date=${dateStr}`;

   try {
       const response = await api.get(uri);

      return response.data as Promise<SuiviHebdo[]> ;

  } catch (error) {
    handleApiCriticalError(error, "suiviHebdoCharger");
    }
} ;

