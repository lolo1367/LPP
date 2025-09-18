// src/api/LigneJournalPoids.ts
import { DateISO, logConsole } from '@lpp/communs';
import api from './api';
import { handleApiError, handleApiCriticalError } from './handleApiError';

import {
   LigneJournalPoids,
   LigneJournalPoidsData,
   isAppError,
   CustomAppException,
   Resultat
} from '@lpp/communs';; 
import { format } from 'date-fns';

const emoji = "⚖️​​";
const viewLog = false;
const module = "api/journalPoids"; 

//====================================================================================================
/**
 * Charge les lignes du journal de poids d'un utilisateur.
 * @returns {Promise<LigneJournalPoids[]>} - Promesse d'un tableau d'objets Ligne de journal de poids.
 * @throws Lance une erreur si le chargement des types de LigneJournalPoids est en erreur.
 */
async function ligneJournalPoidsCharger (utiId: number, dateDebut?:DateISO, dateFin?:DateISO, ligneId?:number): Promise<LigneJournalPoids[]> {

   logConsole(viewLog, emoji, module + '/LigneJournalPoidsCharger', "utiId", utiId);
   logConsole(viewLog, emoji, module + '/LigneJournalPoidsCharger', "dateDebut", dateDebut);
   logConsole(viewLog, emoji, module + '/LigneJournalPoidsCharger', "dateFin", dateFin);
   logConsole(viewLog, emoji, module + '/LigneJournalPoidsCharger', "ligneId", ligneId);

   let uri: string = `/journalPoids?uti_id=${utiId}`;

   if (dateDebut) {
      const dateDebutStr = format(dateDebut, 'yyyy-MM-dd');
      uri += `&date_debut=${dateDebutStr}`;
   }
   if (dateFin) {
      const dateFinStr = format(dateFin, 'yyyy-MM-dd');
      uri += `&date_fin=${dateFinStr}`;
   }

   if (ligneId) {
      uri += `&ligne_id=${ligneId}`;
   }
   
   logConsole(viewLog, emoji, module + '/LigneJournalPoidsCharger', 'uri', uri); 

    try {
        const response = await api.get(uri);
        return response.data as Promise<LigneJournalPoids[]>;

    } catch (error) {
        handleApiCriticalError (error, "LigneJournalPoidsCharger");
    }
};

// ===========================================================================
// Fonction d'ajout d'une ligne de journal de poids
// ===========================================================================
async function ligneJournalPoidsAjouter(
	ligne: LigneJournalPoidsData
): Promise<Resultat> {
	
	logConsole(viewLog, emoji, module + '/LigneJournalPoidsAjouter', 'ligne', ligne);

	const uri = `/journalPoids`;
	logConsole(viewLog, emoji, module + '/LigneJournalPoidsAjouter', 'uri', uri);

    try {
        const response = await api.post(uri, ligne);
		return { success: true, donnees: response.data as number };

    } catch (error) {
        const erreur = handleApiError(error, "LigneJournalPoidsAjouter");
        return erreur;
    }
}

// ===========================================================================
// Fonction de modification d'une ligne de journal de poids
// ===========================================================================
async function  ligneJournalPoidsModifier (
    ligneId: number,
    body: LigneJournalPoidsData,
    
):Promise<Resultat> {
    
    logConsole (viewLog, emoji, module + '/LigneJournalPoidsModifier','Début','-');

    try {

        const uri = `/journalPoids/${ligneId}`;
        logConsole(viewLog, emoji, module + '/LigneJournalPoidsModifier', 'uri', uri);
    

        const response = await api.put(uri, body);  
        return { success: true, donnees: response.data };

    } catch (error) {
        const erreur = handleApiError(error, "LigneJournalPoidsModifier");
        return erreur;
    }
}

// ===========================================================================
// Fonction d'ajout d'une ligne de journal de poids
// ===========================================================================
async function  ligneJournalPoidsSupprimer (
        id : number
):Promise<Resultat> {
    
    logConsole (viewLog, emoji, module + '/LigneJournalPoidsSupprimer','id',id);

    try {

        const uri = `/journalPoids/${id}`;
        logConsole(viewLog, emoji, module + '/LigneJournalPoidsAjouter', 'uri', uri);
        const response = await api.delete(uri);    
        logConsole(viewLog, emoji, module + '/LigneJournalPoidsSupprimer', 'response', response);
        return { success: true };
        
    } catch (error) {
        const erreur = handleApiError(error, "LigneJournalPoidsSupprimer");
        return erreur;
    }
}

export {
    ligneJournalPoidsCharger,
    ligneJournalPoidsAjouter,
    ligneJournalPoidsModifier,
    ligneJournalPoidsSupprimer
};