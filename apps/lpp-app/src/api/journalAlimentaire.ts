import api from './api';
import { handleApiError, handleApiCriticalError } from './handleApiError';
import {DateISO, logConsole} from '@lpp/communs';

import { format } from 'date-fns'
import {
	LigneJournalAlimentaireComplet,
	LigneJournalAlimentaireDataSimple,
	Resultat
} from '@lpp/communs';

const emoji = "📝​";
const viewLog = false;
const module = "api/journalAlimentaire";


function bodyJournalAlimentaire (ligne : LigneJournalAlimentaireDataSimple ) {
	return {
		date: format (ligne.date,'yyyy-MM-dd'), // Format YYYY-MM-DD
		type_repas_id: ligne.typeRepasId,
		aliment_id: ligne.alimentId,
		quantite: ligne.quantite,
		nombre_point: ligne.points
	} ;
}

// ===========================================================================
// Fonction de chargement des lignes
// ===========================================================================
async function journalAlimentaireCharger(
	utilisateurId:number,
	date : DateISO
): Promise<LigneJournalAlimentaireComplet[]>  {
		
	logConsole(viewLog, emoji, module + '/journalAlimentaireCharger', 'date', date);
	logConsole (viewLog, emoji, module + '/journalAlimentaireCharger', 'utilisateurId', utilisateurId);
	logConsole (viewLog, emoji, module + '/journalAlimentaireCharger','format(date,yyyy-MM-dd)',format(date,'yyyy-MM-dd'));

	// Transformation de la date en string au format ISO
	const dateStr = format(date, 'yyyy-MM-dd');

	const uri = `/journalAlimentaire?uti_id=${utilisateurId}&date=${dateStr}`;
	logConsole(viewLog, emoji, module + '/journalAlimentaireCharger', 'uri', uri); 

	try {
		const response = await api.get(uri);
		return response.data as Promise<LigneJournalAlimentaireComplet[]>;

	} catch (error) {
		handleApiCriticalError(error, "journalAlimentaireCharger");
	}
};
	
// ===========================================================================
// Fonction d'ajout d'une ligne
// ===========================================================================
async function journalAlimentaireAjouter(
	ligne: LigneJournalAlimentaireDataSimple
): Promise<Resultat> {
	
	logConsole(viewLog, emoji, module + '/journalAlimentaireAjouter', 'Début', '-');
	logConsole(viewLog, emoji, module + '/journalAlimentaireAjouter', 'ligne', ligne);

	const uri = `/journalAlimentaire`;
	logConsole(viewLog, emoji, module + '/journalAlimentaireAjouter', 'uri', uri);

	try {
		const response = await api.post(uri, ligne);
		return { success: true, donnees: response.data as number };

	} catch (error) {
		const erreur = handleApiError(error, "journalAlimentaireAjouter");
		return erreur;
	}
}
	
// ===========================================================================
// Fonction de modification d'une ligne
// ===========================================================================
async function  journalAlimentaireModifier (
		ligneId: number,
		body: LigneJournalAlimentaireDataSimple,
		
):Promise<Resultat> {
		
	logConsole (viewLog, emoji, module + '/journalAlimentaireAjouter','Début','-');

	try {

		const uri = `/journalAlimentaire/${ligneId}`;
		logConsole(viewLog, emoji, module + '/journalAlimentaireModifer', 'uri', uri);
	

		const response = await api.put(uri, body);		
		return { success: true, donnees: response.data };
	} catch (error) {
		const erreur = handleApiError(error, "journalAlimentaireAjouter");
		return erreur;
	}
}

// ===========================================================================
// Fonction de suppression d'une ligne
// ===========================================================================

async function  journalAlimentaireSupprimer (
		id : number
):Promise<Resultat> {
	
	logConsole (viewLog, emoji, module + '/journalAlimentaireSupprimer','Début','-');
	logConsole (viewLog, emoji, module + '/journalAlimentaireSupprimer','id',id);

	try {

		const uri = `/journalAlimentaire/${id}`;
		logConsole(viewLog, emoji, module + '/journalAlimentaireSupprimer', 'uri', uri);
		const response = await api.delete(uri);
		logConsole(viewLog, emoji, module + '/journalAlimentaireSupprimer', 'response', response);
		return { success: true };
		
	} catch (error) {
		const erreur = handleApiError(error, "journalAlimentaireSupprimer");
		return erreur;
	}

}

export {
	journalAlimentaireCharger,
	journalAlimentaireAjouter,
	journalAlimentaireModifier,
	journalAlimentaireSupprimer
};