import {
   Request,
   Response,
   NextFunction
} from 'express';
import {
   repasDataSchema,
   urlRepasIdSchema,
   idsQuerySchema,
   logConsole
} from "@lpp/communs";

import {
   mapFromApi,
   mapFromDb
} from "@/mappers/repasMapper";


import {
   RepasDataRow,
   RepasRow
} from "@/types/repas";

import * as repasService from '../services/repasService.js';

// ==================================================
// Constant pour les logs
//===================================================
const viewLog: boolean = true;
const emoji = "​";
const fichier: string  = "repasController";

//===============================================================
// Liste des repas
//===============================================================
export const getRepas = async (req: Request, res: Response, next: NextFunction) => {

   try {
      const rows = await repasService.liste() ;
      logConsole(viewLog, emoji, fichier + '/getRepas',"NB row",rows.length);

      res.status(200).json(rows.map(mapFromDb));
   
   } catch (err) {
      next(err) ;
   }
}

//=======================================================
// Liste des repas par identifiant
//=======================================================
export const getRepasByIds = async (req: Request, res: Response, next: NextFunction) => {
   try {
      logConsole(viewLog, emoji, fichier + '/getRepasByIds','req.query',req.query);
      const parseResultQuery = idsQuerySchema("La liste des identifiants").safeParse(req.query);
      logConsole(viewLog, emoji, fichier + '/getRepasByIds', 'parseResultQuery', parseResultQuery);
      
      if (!parseResultQuery.success) {
         logConsole(viewLog, emoji, fichier + '/getRepasByIds','Erreur format body',parseResultQuery.error?.format()); 
         throw parseResultQuery.error;
      }
      
      const ids = parseResultQuery.data.ids;
      const rows = await repasService.listeParIds(ids);
      logConsole(viewLog, emoji, fichier + '/getRepasByIds', "NB row", rows.length); 
      
      res.status(200).json(rows.map(mapFromDb));

   } catch (err) {
      next(err);
   }
}


//=========================================================
// Ajout d'un repas
//=========================================================
export async function insertRepas(req: Request, res: Response, next: NextFunction) {
   try {

      logConsole(viewLog, emoji, fichier + '/insertRepas','req.body',req.body);
      const parseResultBody = repasDataSchema.safeParse(req.body);
      logConsole(viewLog, emoji, fichier + '/insertRepas', 'parseResultBody', parseResultBody )

      if (!parseResultBody.success) {
         logConsole(viewLog, emoji, fichier + '/insertRepas','Echec du parse du body',parseResultBody);
         throw parseResultBody.error;
      }      
      
      const row: RepasDataRow = mapFromApi(parseResultBody.data);
      const id = await repasService.ajouter(row);
      return res.status(201).json(id); 

   } catch (err) {
      next(err);
   }
}

//==================================================================================
// Modification d'un repas
//==================================================================================
export const updateRepas = async (req: Request, res: Response, next : NextFunction) => {
   try {  
         logConsole(viewLog, emoji, fichier + '/updateRepas','req.body',req.body); 
         logConsole(viewLog, emoji, fichier + '/updateRepas','req.params',req.params);
          
      const parseResultBody = repasDataSchema.safeParse(req.body);
      if (!parseResultBody.success) {
         logConsole(viewLog, emoji, fichier + '/updateRepas','Erreur format body',parseResultBody.error?.format()); 
         throw parseResultBody.error ;
      }

      const parseResultParam = urlRepasIdSchema.safeParse(req.params);
      if (!parseResultParam.success) {
         logConsole(viewLog, emoji, fichier + '/updateRepas','Erreur format body',parseResultParam.error?.format()); 
         throw parseResultParam.error;
      }

      const row : RepasDataRow = mapFromApi(parseResultBody.data) ;
      const id : number = parseResultParam.data.id;

      const retour  = await repasService.modifier(id, row) ;

      if (!retour) {
         return res.status(400).json({Erreur : "Pas de repas mis à jour."});
      } else {
         return res.status(200).json(mapFromDb(retour)) ;
      }

   } catch (err) {
      next(err)
   }
};


// ======================================================
// Suppression d'un repas
// ======================================================

export const deleteRepas = async (req : Request, res : Response, next : NextFunction) => {

   try {
      logConsole(viewLog, emoji, fichier + '/deleteRepas','req.params',req.params); 
      const parseResultParam = urlRepasIdSchema.safeParse(req.params);

      if (!parseResultParam.success) {
         logConsole(viewLog, emoji, fichier + '/deleteRepas','Erreur format body',parseResultParam.error?.format()); 
         throw parseResultParam.error ;
      }

      const id : number = parseResultParam.data.id;

      const result = await repasService.supprimer(id);
      logConsole(viewLog, emoji, fichier + '/deleteRepas','result',result); 
      if (result === 0) {
         return res.status(404).json({ Erreur: "Aliment non trouvé" });
      } else {
         return res.status(204).json(result);      }
   } catch (err) {
      next(err) ;
   }
}

