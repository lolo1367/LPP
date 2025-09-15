// src/api/utilisateur.ts
import {logConsole} from '@lpp/communs';
import api from './api';
import { handleApiError, handleApiCriticalError } from './handleApiError';
import { Utilisateur, UtilisateurData, isAppError, CustomAppException, Resultat } from '@lpp/communs';
import { format } from 'date-fns';

const emoji = "😱​​";
const viewLog = false;
const module = "api/utilisateur"; 

//====================================================================================================
/**
 * Charge tous les utilisateurs disponibles.
 * @returns {Promise<Utilisateur[]>} - Promesse d'un tableau d'objets Utilisateur.
 * @throws Lance une erreur si le chargement des types de utilisateur est en erreur.
 */
async function utilisateurCharger (nom?: string, utiId?: number): Promise<Utilisateur[]> {

   logConsole(viewLog, emoji, module + '/utilisateurCharger', "DEBUT", "");
   
   const params = new URLSearchParams();

   if (nom) params.append("nom", nom);
   if (utiId) params.append("uti_id", String(utiId));
   
   const uri = `/utilisateur${params.toString() ? `?${params.toString()}` : ""}`;
   logConsole(viewLog, emoji, module + '/utilisateurCharger', 'uri', uri); 

    try {
        
        const response = await api.get(uri);
        return response.data as Utilisateur[];

    } catch (error: any) {
        logConsole(viewLog, emoji, module + '/utilisateurCharger', "error", error);
        handleApiCriticalError(error, "utilisateurCharger");
    }
};

// ===========================================================================
// Fonction d'ajout d'un utilisateur
// ===========================================================================

async function utilisateurAjouter(
	ligne: UtilisateurData
): Promise<Resultat> {
	
	logConsole(viewLog, emoji, module + '/utilisateurAjouter', 'Début', '-');
	logConsole(viewLog, emoji, module + '/utilisateurAjouter', 'ligne', ligne);

	const uri =`/utilisateur`;
	logConsole(viewLog, emoji, module + '/utilisateurAjouter', 'uri', uri);

	try {
        const response = await api.post(uri, ligne); 

		const idAjoute = response.data as number;
        return { success: true, donnees : idAjoute };

    } catch (error) {
        const erreur = handleApiError(error, "utilisateurAjouter");
        return erreur;
	}
}

// ===========================================================================
// Fonction de modification  d'un utilisateur
// ===========================================================================

async function  utilisateurModifier (
    ligneId: number,
    body: UtilisateurData,
    
):Promise<Resultat> {
    
    logConsole (viewLog, emoji, module + '/utilisateurModifier','Début','-');

    try {

        const uri =`/utilisateur/${ligneId}`;
        logConsole(viewLog, emoji, module + '/utilisateurModifier', 'uri', uri);    

        const response = await api.put(uri, body);        
        return { success: true, donnees: response.data };

    } catch (error) {
        const erreur = handleApiError(error, "utilisateurModifier");
        return erreur;
    }
}

// ===========================================================================
// Fonction de suppression d'un utilisateur
// ===========================================================================

async function  utilisateurSupprimer (
        id : number
):Promise<Resultat> {
    
    logConsole (viewLog, emoji, module + '/utilisateurSupprimer','Début','-');
    logConsole (viewLog, emoji, module + '/utilisateurSupprimer','id',id);

    try {

        const uri =`/utilisateur/${id}`;
        logConsole(viewLog, emoji, module + '/utilisateurAjouter', 'uri', uri);

        const response = await api.delete(uri);    
        logConsole(viewLog, emoji, module + '/utilisateurSupprimer', 'response', response);
        return { success: true };
        
    } catch (error) {
        const erreur = handleApiError(error, "utilisateurSupprimer");
        return erreur;
    }
}


export {
    utilisateurCharger,
    utilisateurAjouter,
    utilisateurModifier,
    utilisateurSupprimer
};