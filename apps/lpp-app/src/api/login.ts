
import { logConsole } from '../utils/logger';
import api from './api';
import { handleApiError , handleApiCriticalError} from './handleApiError';
import { Utilisateur } from '@ww/reference';
import { CustomAppException, Resultat, isAppError } from '@ww/reference';
import { Authentification } from '@ww/reference';

const emoji = "🥵​";
const viewLog = true;
const module = "api/login"; 


//====================================================================================================
/**
 * Charge tous les aliments disponibles.
 * @returns {Promise<Aliment[]>} - Promesse d'un tableau d'objets Aliment.
 * @throws Lance une erreur si le chargement des types de aliment est en erreur.
 */
async function verifierLogin (email: string, mdp : string): Promise<Resultat> {

	
logConsole(viewLog, emoji, module + '/verifierLogin', 'Début', '-');
   logConsole(viewLog, emoji, module + '/verifierLogin', 'email', email);
   logConsole(viewLog, emoji, module + '/verifierLogin', 'mdp', mdp);


	const uri = `/login/login`;
    logConsole(viewLog, emoji, module + '/verifierLogin', 'uri', uri);
    
    try {
        
        const response = await api.post(uri, {email,mdp});
	    return { success: true, donnees: response.data as Authentification };

    } catch (error) {
        const erreur = handleApiError(error, "login/verifierLogin");
        return erreur;
	}
}


async function logout (token : string): Promise<Resultat> {

	
    logConsole(viewLog, emoji, module + '/logout', 'Début', '-');
    logConsole(viewLog, emoji, module + '/logout', 'token', token);
    
    const uri = `/login/logout`;
    logConsole(viewLog, emoji, module + '/logout', 'uri', uri);
        
    try {
        
        const response = await api.post(uri, { token });
        return { success: true, donnees: response.data};

    } catch (error) {
        const erreur = handleApiError(error, "login/logout");
        return erreur;
    }
}

async function refresh (token : string): Promise<Resultat> {

	
    logConsole(viewLog, emoji, module + '/refresh', 'Début', '-');
    logConsole(viewLog, emoji, module + '/refresh', 'token', token);
    
    const uri = `/login/refresh`;
    logConsole(viewLog, emoji, module + '/refresh', 'uri', uri);
        
    try {
        
        const response = await api.post(uri, { token });
        return { success: true, donnees: response.data};

    } catch (error) {
        const erreur = handleApiError(error, "login/refresh");
        return erreur;
    }
}


export {
    verifierLogin,
    logout,
    refresh
};