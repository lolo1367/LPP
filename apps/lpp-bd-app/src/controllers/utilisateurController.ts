import {
	Request,
	Response,
	NextFunction
} from 'express';
import {
	utilisateurDataSchema,
	utilisateurFiltreSchema,
	urlUtilisateurIdSchema
} from "@lpp/communs";
import {
   logConsole
} from '@lpp/communs';

import * as utilisateurService from '../services/utilisateurService';

// ==================================================
// Constant pour les logs
//===================================================
const viewLog: boolean = false;
const emoji = "👩‍🦰​​";
const fichier: string  = "utilisateurController";

export async function getUtilisateurs(req: Request, res: Response, next: NextFunction) {
	try {

		logConsole (viewLog, emoji, fichier + '/getUtilisateurs', 'Début','');
      
		const parseResultQuery = utilisateurFiltreSchema.safeParse(req.query);

      if (!parseResultQuery.success) {
			throw parseResultQuery.error;
		}
		
		const { nom, uti_id } = parseResultQuery.data;

		const filtres = {
			nom,
			uti_id: uti_id !== undefined ? String(uti_id) : undefined,
		};
		
		const result = await utilisateurService.liste(nom, uti_id);
		res.json(result);

  	} catch (err) {
    	next(err);
	} 	
}

export async function insertUtilisateur(req: Request, res: Response, next: NextFunction) {
	try {

		logConsole (viewLog, emoji, fichier + '/insertUtilisateur','req.body',req.body);
		const parseResultBody = utilisateurDataSchema.safeParse(req.body);
		logConsole (viewLog, emoji, fichier + '/insertUtilisateur', 'parseResultBody', parseResultBody )

		if (!parseResultBody.success) {
			logConsole (viewLog, emoji, fichier + '/insertUtilisateur','❌ Echec du parse du body',parseResultBody);
			throw parseResultBody.error;
		}

		const data = parseResultBody.data;				
		const row = await utilisateurService.ajouter(data);
		res.json(row);

	} catch (err) {
		next(err);
	}	
}

export async function updateUtilisateur(req: Request, res: Response, next: NextFunction) {
	try {

		logConsole (viewLog, emoji, fichier + '/updateUtilisateur','req.body',req.body);
		const parseResultBody = utilisateurDataSchema.safeParse(req.body);
		logConsole (viewLog, emoji, fichier + '/updateUtilisateur', 'parseResultBody', parseResultBody)
		
		if (!parseResultBody.success) {
				throw parseResultBody.error;
		}

	   const parseResultParam = urlUtilisateurIdSchema.safeParse(req.params);
      if (!parseResultParam.success) {
         logConsole (viewLog, emoji, fichier + '/updateUtilisateur','Erreur format body',parseResultParam.error?.format()); 
         throw parseResultParam.error ;
		}	

		const data = parseResultBody.data;
		const id = Number(parseResultParam.data.id);

		const row = await utilisateurService.modifier(id, data);
		res.json(row);
				

 	} catch (err) {
		next(err);
	}
}

export async function deleteUtilisateur(req: Request, res: Response, next: NextFunction) {
	try {

		const parseResultParam = urlUtilisateurIdSchema.safeParse(req.params);
		if (!parseResultParam.success) {
			logConsole (viewLog, emoji, fichier + '/modifierUtilisateur','Erreur format body',parseResultParam.error?.format()); 
			throw parseResultParam.error ;
		}	

		const id = Number(parseResultParam.data.id);

		const resultat = await utilisateurService.supprimer(id);
		res.status(204).send();
				

	} catch (err) {
		next(err);
	}
}

