import {
   Request,
   Response,
   NextFunction
} from 'express';
import {
   ligneJournalPoidsDataSchema,
   ligneJournalPoidsFiltreSchemas,
   urlLigneJournalPoidsIdSchema
} from '@ww/reference';
import * as Trace from '../utils/logger';
import * as JournalPoidsService from '../services/journalPoidsService';

import { mapFromApi } from '../mappers/ligneJournalPoidsMapper';

export const getLigne = async (req : Request, res : Response, next : NextFunction) => {   

   try {
      Trace.traceDebut(__filename, 'getLigne');
      Trace.traceInformation(__filename, 'getLigne', 'req.query', req.query);
      
      // Vérification des paramètres de la requette
      const parseResultQuery = ligneJournalPoidsFiltreSchemas.safeParse(req.query) ;
      Trace.traceInformation (__filename,'getLigne','parseResultQuery',parseResultQuery);

      if (!parseResultQuery.success) {
            Trace.traceInformation (__filename,'getLigne','Erreur format body',parseResultQuery.error?.format()); 
            throw parseResultQuery.error
      }

      let dateDebut: Date | undefined = undefined;
      let dateFin: Date | undefined = undefined;

      if (parseResultQuery.data.date_debut) {
         dateDebut = new Date(parseResultQuery.data.date_debut);
         Trace.traceInformation(__filename, 'getLigne', 'date debut fournie', dateDebut);
      } else {
         Trace.traceInformation(__filename, 'getLigne', 'aucune date de début fournie', ' date undefined');
      }

      if (parseResultQuery.data.date_fin) {
         dateFin = new Date(parseResultQuery.data.date_fin);
         Trace.traceInformation(__filename, 'getLigne', 'date fin fournie', dateFin);
      } else {
         Trace.traceInformation(__filename, 'getLigne', 'aucune date de fin fournie', ' date undefined');
      }
      
      const lignes = await JournalPoidsService.liste(parseResultQuery.data.uti_id,dateDebut,dateFin,parseResultQuery.data.ligne_id);
      Trace.traceInformation(__filename, 'getLigne', 'NB row', lignes.length);  
      Trace.traceInformation(__filename, 'getLigne', 'lignes', lignes);  

      res.status(200).json(lignes);
      
   } catch (err) {
      next(err) ;
   }
}

export const insertLigne = async (req : Request, res : Response, next :NextFunction) => {

   try {

      Trace.traceDebut(__filename, 'insertLigne');
      Trace.traceInformation(__filename,'insertLigne','req.body',req.body);
      const parseResultBody = ligneJournalPoidsDataSchema.safeParse(req.body);
      Trace.traceInformation(__filename,'insertLigne', 'parseResultBody', parseResultBody )

      if (!parseResultBody.success) {
         Trace.traceInformation (__filename,'insertLigne','Erreur parse body',parseResultBody.error);
         throw parseResultBody.error;
      }

      const row = mapFromApi(parseResultBody.data);
      const id = await JournalPoidsService.ajouter(row ) ;

         return res.status(201).json(id); 
   } catch (err) {
      next (err) ;
   }
}

export const updateLigne = async (req: Request, res: Response, next : NextFunction) => {

   try {
  
      const parseResultBody = ligneJournalPoidsDataSchema.safeParse(req.body);
      if (!parseResultBody.success) {
         Trace.traceInformation (__filename,'updateLigne','Erreur format body',parseResultBody.error?.format()); 
         throw parseResultBody.error ;
      }

      const parseResultParam = urlLigneJournalPoidsIdSchema.safeParse(req.params);
      if (!parseResultParam.success) {
         Trace.traceInformation (__filename,'updateLigne',"Erreur de l'id",parseResultParam.error?.format()); 
         throw parseResultParam.error ;
      }

      const row = mapFromApi(parseResultBody.data) ;
      const id: number = parseResultParam.data.id;
      const uti_id: number = parseResultBody.data.uti_id;

      const retour  = await JournalPoidsService.modifier ( id, row) ;
      if (!retour) {
         return res.status(400).json({Erreur : "Pas de ligne de poids mis à jour."});
      } else {
         
         const lignes = await JournalPoidsService.liste(uti_id, undefined,undefined, id);
         Trace.traceInformation(__filename, 'getLigne', 'Lignes remontées par le select', lignes.length);  
         Trace.traceInformation(__filename, 'getLigne', 'lignes', lignes);  


         res.status(200).json(lignes);
      }

   } catch (err) {
      next(err)
   }
};

export const deleteLigne = async (req : Request, res : Response, next : NextFunction) => {

   try {
      Trace.traceInformation (__filename,'deleteLigne','req.params',req.params); 
      const parseResultParam = urlLigneJournalPoidsIdSchema.safeParse(req.params);

      if (!parseResultParam.success) {
         Trace.traceInformation (__filename,'deleteLigne','Erreur format body',parseResultParam.error?.format()); 
         throw parseResultParam.error ;
      }

      const id : number = parseResultParam.data.id;

      const result = await JournalPoidsService.supprimer(id);
      
      if (result === 0) {
         return res.status(404).json({ Erreur: "Ligne de poids non trouvée" });
      } else {
         return res.status(204).end();
      }
      
   } catch (err) {
      next(err) ;
   }
}