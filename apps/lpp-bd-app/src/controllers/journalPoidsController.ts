import {
   Request,
   Response,
   NextFunction
} from 'express';
import {
   ligneJournalPoidsDataSchema,
   ligneJournalPoidsFiltreSchemas,
   urlLigneJournalPoidsIdSchema
} from '@lpp/communs';
import {logConsole} from '@lpp/communs';
import * as JournalPoidsService from '../services/journalPoidsService';

import { mapFromApi } from '../mappers/ligneJournalPoidsMapper';

const viewlog = false;
const emoji = "";
const fichier = "journalPoidsController";

export const getLigne = async (req : Request, res : Response, next : NextFunction) => {   

   try {
      logConsole (viewlog, emoji,fichier + 'getLigne','Début','');
      logConsole (viewlog, emoji,fichier + 'getLigne', 'req.query', req.query);
      
      // Vérification des paramètres de la requette
      const parseResultQuery = ligneJournalPoidsFiltreSchemas.safeParse(req.query) ;
      logConsole (viewlog, emoji,fichier + 'getLigne','parseResultQuery',parseResultQuery);

      if (!parseResultQuery.success) {
            logConsole (viewlog, emoji,fichier + 'getLigne','Erreur format body',parseResultQuery.error?.format()); 
            throw parseResultQuery.error
      }

      let dateDebut: Date | undefined = undefined;
      let dateFin: Date | undefined = undefined;

      if (parseResultQuery.data.date_debut) {
         dateDebut = new Date(parseResultQuery.data.date_debut);
         logConsole (viewlog, emoji,fichier + 'getLigne', 'date debut fournie', dateDebut);
      } else {
         logConsole (viewlog, emoji,fichier + 'getLigne', 'aucune date de début fournie', ' date undefined');
      }

      if (parseResultQuery.data.date_fin) {
         dateFin = new Date(parseResultQuery.data.date_fin);
         logConsole (viewlog, emoji,fichier + 'getLigne', 'date fin fournie', dateFin);
      } else {
         logConsole (viewlog, emoji,fichier + 'getLigne', 'aucune date de fin fournie', ' date undefined');
      }
      
      const lignes = await JournalPoidsService.liste(parseResultQuery.data.uti_id,dateDebut,dateFin,parseResultQuery.data.ligne_id);
      logConsole (viewlog, emoji,fichier + 'getLigne', 'NB row', lignes.length);  
      logConsole (viewlog, emoji,fichier + 'getLigne', 'lignes', lignes);  

      res.status(200).json(lignes);
      
   } catch (err) {
      next(err) ;
   }
}

export const insertLigne = async (req : Request, res : Response, next :NextFunction) => {

   try {

      logConsole (viewlog, emoji,fichier + 'insertLigne','Début','');
      logConsole (viewlog, emoji,fichier + 'insertLigne','req.body',req.body);
      const parseResultBody = ligneJournalPoidsDataSchema.safeParse(req.body);
      logConsole (viewlog, emoji,fichier + 'insertLigne', 'parseResultBody', parseResultBody )

      if (!parseResultBody.success) {
         logConsole (viewlog, emoji,fichier + 'insertLigne','Erreur parse body',parseResultBody.error);
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
         logConsole (viewlog, emoji,fichier + 'updateLigne','Erreur format body',parseResultBody.error?.format()); 
         throw parseResultBody.error ;
      }

      const parseResultParam = urlLigneJournalPoidsIdSchema.safeParse(req.params);
      if (!parseResultParam.success) {
         logConsole (viewlog, emoji,fichier + 'updateLigne',"Erreur de l'id",parseResultParam.error?.format()); 
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
         logConsole (viewlog, emoji,fichier + 'getLigne', 'Lignes remontées par le select', lignes.length);  
         logConsole (viewlog, emoji,fichier + 'getLigne', 'lignes', lignes);  


         res.status(200).json(lignes);
      }

   } catch (err) {
      next(err)
   }
};

export const deleteLigne = async (req : Request, res : Response, next : NextFunction) => {

   try {
      logConsole (viewlog, emoji,fichier + 'deleteLigne','req.params',req.params); 
      const parseResultParam = urlLigneJournalPoidsIdSchema.safeParse(req.params);

      if (!parseResultParam.success) {
         logConsole (viewlog, emoji,fichier + 'deleteLigne','Erreur format body',parseResultParam.error?.format()); 
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