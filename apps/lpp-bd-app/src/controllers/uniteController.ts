import {
   Request,
   Response,
   NextFunction
} from 'express';
import {
   Unite,
   uniteFiltreSchema,
   logConsole
} from "@ww/reference";

import * as uniteService from '../services/uniteService.js';

// ==================================================
// Constant pour les logs
//===================================================
const viewLog: boolean = true;
const emoji = "🔖​";
const fichier: string  = "uniteController";

export const getUnites = async (req : Request, res : Response, next : NextFunction) => {

   try {

      // Vérification des paramètres
      logConsole(viewLog, emoji, fichier + '/getUnites','req.query',req.query);

      const parseResultQuery = uniteFiltreSchema.safeParse(req.query) ;
      logConsole(viewLog, emoji, fichier + '/getUnites','parseResultQuery',parseResultQuery);

      if (!parseResultQuery.success) {
         logConsole(viewLog, emoji, fichier + '/getUnites','Erreur query',parseResultQuery.error?.format()); 
         throw parseResultQuery.error ;
      }

      const nom = parseResultQuery.data.unite;

      const rows = await uniteService.liste(nom) ;
      logConsole(viewLog, emoji, fichier + '/getUnites',"NB row",rows.length);

      res.status(200).json(rows);
   
   } catch (err) {
      next(err) ;
   }
}


