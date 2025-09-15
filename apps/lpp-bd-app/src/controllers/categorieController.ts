import {
   Request,
   Response,
   NextFunction
} from 'express';
import {
   categorieDataSchema,
   urlCategorieIdSchema,
   idsQuerySchema,
   categorieFiltreSchema,
   logConsole
} from "@lpp/communs";

import {
   mapFromApi,
   mapFromDb
} from "@/mappers/categorieMapper";

import {
   CategorieDataRow,
   CategorieRow
} from "@/types/categorie";

import * as categorieService from '../services/categorieService.js';

// ==================================================
// Constant pour les logs
//===================================================
const viewLog: boolean = true;
const emoji = "​";
const fichier: string  = "categorieController";

//====================================================================
// Liste des categories
//====================================================================
export const getCategorie = async (req : Request, res : Response, next : NextFunction) => {

   try {
      logConsole(viewLog, emoji, fichier + '/getCategorie','req.query',req.query);
      const parseResultQuery = categorieFiltreSchema.safeParse(req.query) ;
      logConsole(viewLog, emoji, fichier + '/getCategorie','parseResultQuery',parseResultQuery);

      if (!parseResultQuery.success) {
         logConsole(viewLog, emoji, fichier + '/getCategorie','Erreur format body',parseResultQuery.error?.format()); 
         throw parseResultQuery.error ;
      }

      const nom = parseResultQuery.data.nom;

      const rows = await categorieService.liste(nom) ;
      logConsole(viewLog, emoji, fichier + '/getCategorie',"NB row",rows.length);

      res.status(200).json(rows.map(mapFromDb));
   
   } catch (err) {
      next(err) ;
   }
}

//====================================================================
// Liste des catégories par ids
//====================================================================

export const getCategorieByIds = async (req: Request, res: Response, next: NextFunction) => {
   try {
      logConsole(viewLog, emoji, fichier + '/getCategorieByIds','req.query',req.query);
      const parseResultQuery = idsQuerySchema("La liste des identifiants").safeParse(req.query);
      logConsole(viewLog, emoji, fichier + '/getAlimentByIds', 'parseResultQuery', parseResultQuery);
      
      if (!parseResultQuery.success) {
         logConsole(viewLog, emoji, fichier + '/getAlimentByIds','Erreur format body',parseResultQuery.error?.format()); 
         throw parseResultQuery.error;
      }
      
      const ids = parseResultQuery.data.ids;
      const rows = await categorieService.listeParIds(ids);
      logConsole(viewLog, emoji, fichier + '/getCategorieByIds', "NB row", rows.length); 
      
      res.status(200).json(rows.map(mapFromDb));

   } catch (err) {
      next(err);
   }
}


//====================================================================
// Ajouter une categorie
//====================================================================
export const insertCategorie = async (req : Request, res : Response, next :NextFunction) => {

   try {

      logConsole(viewLog, emoji, fichier + '/insertCategorie','req.body',req.body);
      const parseResultBody = categorieDataSchema.safeParse(req.body);
      logConsole(viewLog, emoji, fichier + '/insertCategorie', 'parseResultBody', parseResultBody )

      if (!parseResultBody.success) {
          throw parseResultBody.error;
      }

      const row : CategorieDataRow = mapFromApi(parseResultBody.data) ;

      const id = await categorieService.ajouter(row) ;

      return res.status(201).json(id); 
   } catch (err) {
      next (err) ;
   }
}

//====================================================================
// Modification d'une catégorie
//====================================================================
export const updateCategorie = async (req: Request, res: Response, next : NextFunction) => {

   try {
  
      logConsole(viewLog, emoji, fichier + '/updateCategorie','req.body',req.body); 
      logConsole(viewLog, emoji, fichier + '/updateCategorie','req.params',req.params);
          
      const parseResultBody = categorieDataSchema.safeParse(req.body);
      if (!parseResultBody.success) {
         logConsole(viewLog, emoji, fichier + '/updateCategorie','Erreur format body',parseResultBody.error?.format()); 
         throw parseResultBody.error ;
      }

      const parseResultParam = urlCategorieIdSchema.safeParse(req.params);
      if (!parseResultParam.success) {
         logConsole(viewLog, emoji, fichier + '/updateCategorie','Erreur format body',parseResultParam.error?.format()); 
         throw parseResultParam.error;
      }

      const row : CategorieDataRow = mapFromApi(parseResultBody.data) ;
      const id = parseResultParam.data.id;

      const retour  = await categorieService.modifier(id, row) ;

      if (!retour) {
         return res.status(400).json({Erreur : "Pas de catégorie mise à jour."});
      } else {
         return res.status(200).json(mapFromDb(retour)) ;
      }

   } catch (err) {
      next(err)
   }
};

//====================================================================
// Suppression d'une categorie
//====================================================================
export const deleteCategorie = async (req : Request, res : Response, next : NextFunction) => {

   try {
      logConsole(viewLog, emoji, fichier + '/deleteCategorie','req.params',req.params); 
      const parseResultParam = urlCategorieIdSchema.safeParse(req.params);
      if (!parseResultParam.success) {
         logConsole(viewLog, emoji, fichier + '/deleteCategorie','Erreur format body',parseResultParam.error?.format()); 
         throw parseResultParam.error ;
      }

      const id : number = parseResultParam.data.id;

      const result = await categorieService.supprimer (id) ;
      if (result === 0) {
         return res.status(404).json({ Erreur: "Aliment non trouvé" });
      } else {
         return res.status(204).json(result);
      }
   } catch (err) {
      next(err) ;
   }
}






