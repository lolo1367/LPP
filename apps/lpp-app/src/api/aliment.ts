// src/api/aliment.ts
import {logConsole} from '@lpp/communs';
import api from './api';
import { handleApiError, handleApiCriticalError } from './handleApiError';
import { Aliment, AlimentData, Resultat, AlimentRecent } from '@lpp/communs';
import { format } from 'date-fns';

const emoji = "🍓​";
const viewLog = false;
const module = "api/aliment"; 

//====================================================================================================
/**
 * Charge tous les aliments disponibles.
 * @returns {Promise<Aliment[]>} - Promesse d'un tableau d'objets Aliment.
 * @throws Lance une erreur si le chargement des types de aliment est en erreur.
 */
async function alimentCharger (nom?: string): Promise<Aliment[]> {

    logConsole(viewLog, emoji, module + '/alimentCharger', "DEBUT", "");
    
    const uri = `/aliment${(nom) ? "?nom=" + nom : ""}`;
    logConsole(viewLog, emoji, module + '/alimentCharger', 'uri', uri); 

    try {
        
        const response = await api.get(uri);
        return response.data as Aliment[];

    } catch (error: any) {
        logConsole(viewLog, emoji, module + '/alimentCharger', "error", error);
        handleApiCriticalError(error, "alimentCharger");
        return [];
    }
};

// ===========================================================================
// Fonction d'ajout d'un aliment
// ===========================================================================

async function alimentAjouter(
	ligne: AlimentData
): Promise<Resultat> {
	
	logConsole(viewLog, emoji, module + '/alimentAjouter', 'Début', '-');
	logConsole(viewLog, emoji, module + '/alimentAjouter', 'ligne', ligne);

	const uri =`/aliment`;
	logConsole(viewLog, emoji, module + '/alimentAjouter', 'uri', uri);

	try {
        const response = await api.post(uri, ligne); 

		const idAjoute = response.data as number;
        return { success: true, donnees : idAjoute };

    } catch (error) {
        const erreur = handleApiError(error, "alimentAjouter");
        return erreur;
	}
}

// ===========================================================================
// Fonction de modification  d'un aliment
// ===========================================================================

async function  alimentModifier (
    ligneId: number,
    body: AlimentData,
    
):Promise<Resultat> {
    
    logConsole (viewLog, emoji, module + '/alimentModifier','Début','-');

    try {

        const uri =`/aliment/${ligneId}`;
        logConsole(viewLog, emoji, module + '/alimentModifier', 'uri', uri);    

        const response = await api.put(uri, body);        
        return { success: true, donnees: response.data };

    } catch (error) {
        const erreur = handleApiError(error, "alimentModifier");
        return erreur;
    }
}

// ===========================================================================
// Fonction de suppression d'un aliment
// ===========================================================================

async function  alimentSupprimer (
        id : number
):Promise<Resultat> {
    
    logConsole (viewLog, emoji, module + '/alimentSupprimer','Début','-');
    logConsole (viewLog, emoji, module + '/alimentSupprimer','id',id);

    try {

        const uri =`/aliment/${id}`;
        logConsole(viewLog, emoji, module + '/alimentAjouter', 'uri', uri);

        const response = await api.delete(uri);    
        logConsole(viewLog, emoji, module + '/alimentSupprimer', 'response', response);
        return { success: true };
        
    } catch (error) {
        const erreur = handleApiError(error, "alimentSupprimer");
        return erreur;
    }
}

// ===========================================================================
// Fonction de chargement des aliments récents
// ===========================================================================

async function alimentChargerRecent(utiId: number, dateDebut: Date, dateFin: Date): Promise<AlimentRecent[]> {

    logConsole(viewLog, emoji, module + '/alimentChargerRecent', "utiId", utiId);
    logConsole(viewLog, emoji, module + '/alimentChargerRecent', "dateDebut", dateDebut);
    logConsole(viewLog, emoji, module + '/alimentChargerRecent', "dateFin", dateFin);

    	// Transformation de la date en string au format ISO
	const dateDebutStr = format(dateDebut, 'yyyy-MM-dd');
	const dateFinStr = format(dateFin, 'yyyy-MM-dd');
    
    const uri =`/aliment/recents?uti_id=${utiId}&date_debut=${dateDebutStr}&date_fin=${dateFinStr}`;
    logConsole(viewLog, emoji, module + '/alimentChargerRecent', 'uri', uri); 

    try {
        const response = await api.get(uri);
        return response.data as Promise<AlimentRecent[]>;

    } catch (error) {
        handleApiCriticalError(error, "alimentChargerRecent");
    }
}


export {
    alimentCharger,
    alimentChargerRecent,
    alimentAjouter,
    alimentModifier,
    alimentSupprimer
};