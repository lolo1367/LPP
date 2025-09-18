import {
	Request,
	Response,
	NextFunction
} from 'express';

import {
	alimentDataSchema,
	alimentFiltreSchema,
	urlAlimentIdSchema,
	idsQuerySchema,
	alimentsRecentsFiltreSchema,
   logConsole,
   DateISO,
   toDateISO
} from "@lpp/communs";

import {
	mapFromDb,
   mapFromApi,
   mapAlimentRecentFromDb
} from "@/mappers/alimentMapper";

import {
	AlimentDataRow,
} from "@/types/aliment";

import * as alimentService from '../services/alimentService';
import * as journalAlimentaireService from '@/services/journalAlimentaireService';
import * as journalAlimentaireController from '@/controllers/journalAlimentaireController';

// ==================================================
// Constant pour les logs
//===================================================
const viewLog: boolean = true;
const emoji = "​";
const fichier: string  = "alimentController";

//================================================================================
// Liste des aliments
//================================================================================
export const getAliment = async (req : Request, res : Response, next : NextFunction) => {

   try {
      
      logConsole(viewLog, emoji, fichier + '/getAliment','req.query',req.query);
      const parseResultQuery = alimentFiltreSchema.safeParse(req.query) ;
      logConsole(viewLog, emoji, fichier + '/getAliment','parseResultQuery',parseResultQuery);

      if (!parseResultQuery.success) {
			logConsole(viewLog, emoji, fichier + '/getAliment','Erreur format body',parseResultQuery.error?.format()); 
			throw parseResultQuery.error
      }

      const categorieId = parseResultQuery.data.categorie_id;
      const nom = parseResultQuery.data.nom;

      const rows = await alimentService.liste(nom,categorieId) ;
		logConsole(viewLog, emoji, fichier + '/getAliment', "NB row", rows.length);
		
		const rowsComplets = rows.map(mapFromDb);
		res.status(200).json(rowsComplets);
		
   } catch (err) {
      next(err) ;
   }
}

//================================================================================
// Liste des aliments par ids
//================================================================================
export const getAlimentByIds = async (req: Request, res: Response, next: NextFunction) => {
   try {
      
      logConsole(viewLog, emoji, fichier + '/getAlimentByIds','req.query',req.query);
      const parseResultQuery = idsQuerySchema("Les identifiants").safeParse(req.query);
      logConsole(viewLog, emoji, fichier + '/getAlimentByIds', 'parseResultQuery', parseResultQuery);
      
      if (!parseResultQuery.success) {
         logConsole(viewLog, emoji, fichier + '/getAlimentByIds','Erreur format body',parseResultQuery.error?.format()); 
         throw parseResultQuery.error;
		}
		
		const ids = parseResultQuery.data.ids;
      const rows = await alimentService.listeParIds(ids);
		logConsole(viewLog, emoji, fichier + '/getAlimentByIds', "NB row", rows.length);
		
		const rowsComplets = rows.map(mapFromDb);
      res.status(200).json(rowsComplets);

   } catch (err) {
      next(err);
   }
}

//================================================================================
// Ajout d'un aliment
//================================================================================
export const insertAliment = async (req : Request, res : Response, next :NextFunction) => {

   try {

      logConsole(viewLog, emoji, fichier + '/insertAmiment','req.body',req.body);
      const parseResultBody = alimentDataSchema.safeParse(req.body);
      logConsole(viewLog, emoji, fichier + '/insertAliment', 'parseResultBody', parseResultBody )

      if (!parseResultBody.success) {
         logConsole(viewLog, emoji, fichier + '/insert','Step 1','-');
         throw parseResultBody.error;
      }

      const row : AlimentDataRow = mapFromApi(parseResultBody.data) ;

      const id = await alimentService.ajouter(row) ;

      return res.status(201).json(id); 
   } catch (err) {
      next (err) ;
   }
}

//================================================================================
// Modification d'un aliment
//================================================================================
export const updateAliment = async (req: Request, res: Response, next : NextFunction) => {

   try {
      logConsole(viewLog, emoji, fichier + '/modifierAliment','body',req.body); 
      
      const parseResultBody = alimentDataSchema.safeParse(req.body);
      logConsole(viewLog, emoji, fichier + '/modifierAliment','body',req.body); 

      if (!parseResultBody.success) {
         logConsole(viewLog, emoji, fichier + '/modifierAliment','Erreur format body',parseResultBody.error?.format()); 
         throw parseResultBody.error ;
      }

      const parseResultParam = urlAlimentIdSchema.safeParse(req.params);
      if (!parseResultParam.success) {
         logConsole(viewLog, emoji, fichier + '/modifierAliment','Erreur format body',parseResultParam.error?.format()); 
         throw parseResultParam.error ;
      }

      const row : AlimentDataRow = mapFromApi(parseResultBody.data) ;
      const id: number = parseResultParam.data.id;

      const retour  = await alimentService.modifier(id, row) ;

      if (!retour) {
         return res.status(400).json({Erreur : "Pas d\'aliment mis à jour."});
      } else {
         return res.status(200).json(mapFromDb(retour)) ;
      }

	} catch (err) {
   	next(err)
	}
};


//=================================================================================
// Suppression d'un aliment
//=================================================================================
export const deleteAliment = async (req : Request, res : Response, next : NextFunction) => {

   try {
      logConsole(viewLog, emoji, fichier + '/supprimerAliment','req.params',req.params); 
      const parseResultParam = urlAlimentIdSchema.safeParse(req.params);

      if (!parseResultParam.success) {
         logConsole(viewLog, emoji, fichier + '/supprimerAliment','Erreur format body',parseResultParam.error?.format()); 
         throw parseResultParam.error ;
      }

      const id : number = parseResultParam.data.id;

      const result = await alimentService.supprimer(id);
      
      if (result === 0) {
         return res.status(404).json({ Erreur: "Aliment non trouvé" });
      } else {
         return res.status(204).json(result);
      }
      
   } catch (err) {
      next(err) ;
   }
}

//==========================================================================
// Liste des aliments récents d'un utilisteur
//==========================================================================
export const getAlimentsRecents = async (req : Request, res : Response, next : NextFunction) => {

   try {

		// Vérification des paramètres de la requete
      logConsole(viewLog, emoji, fichier + '/getAlimentsRecents', 'req.query', req.query);
      const parseResultQuery = alimentsRecentsFiltreSchema.safeParse(req.query) ;
      logConsole(viewLog, emoji, fichier + '/getAlimentsRecents','parseResultQuery',parseResultQuery);

      if (!parseResultQuery.success) {
            logConsole(viewLog, emoji, fichier + '/getAlimentsRecents','Erreur format body',parseResultQuery.error?.format()); 
            throw parseResultQuery.error
      }

      // Récupération des paramères
      const dateDebut = toDateISO(parseResultQuery.data.date_debut);
		const dateFin = toDateISO(parseResultQuery.data.date_fin);
		const utiId = parseResultQuery.data.uti_id;

		logConsole(viewLog, emoji, fichier + '/getAlimentsRecents', 'Date debut', dateDebut);
		logConsole(viewLog, emoji, fichier + '/getAlimentsRecents', 'Date fin', dateFin);

      const alimentsRecentsRows = await journalAlimentaireService.getAlimentParPeriode(utiId, dateDebut, dateFin);
      
      const alimentsRecents = alimentsRecentsRows.map(mapAlimentRecentFromDb);
      
      logConsole(viewLog, emoji, fichier + '/getAlimentsRecents', 'NB row', alimentsRecents.length);  
      //logConsole(viewLog, emoji, fichier + '/getAlimentsRecents', 'lignes', alimentsRecents);  

      if (alimentsRecents.length === 0) {
         res.status(200).json([]);
      } else {
         res.status(200).json(alimentsRecents);
      }
   } catch (err) {
      next(err) ;
   }
}