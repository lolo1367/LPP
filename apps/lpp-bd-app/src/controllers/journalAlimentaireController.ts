import {
   Request,
   Response,
   NextFunction
} from 'express';

import {
   ligneJournalAlimentaireDataSimpleSchema,
   ligneJournalAlimentaireFiltreSchemas,
   urlLigneJournalAlimentaireIdSchema,
   LigneJournalAlimentaireComplet,
   toDateISO
} from '@lpp/communs';

import { logConsole } from '@lpp/communs';
import { mapFromDb as alimentMapFromDb, mapFromDb} from '@/mappers/alimentMapper';
import { mapFromDb as repasMapFromDb } from '@/mappers/repasMapper';
import { mapFromBd as ligneMapFromDb } from '../mappers/ligneJournalAlimentaireMapper';
import * as JournalAlimmentaireService from '../services/journalAlimentaireService';
import * as AlimentService from '../services/alimentService';
import * as RepasService from '../services/repasService';
import {
   LigneJournalAlimentaireRow,
} from '../types/ligneJournalalimentaire';
import { mapFromApi } from '../mappers/ligneJournalAlimentaireMapper';

// ==================================================
// Constant pour les logs
//===================================================
const viewLog: boolean = true;
const emoji = "​";
const fichier: string  = "journalAlimentaireController";

// export async function enrichirLignes (lignes : LigneJournalAlimentaireRow[]): Promise< LigneJournalAlimentaireComplet[]> {
   
//    // Récupération de la liste des identifiants d'alimement et de type repas
//    const alimentIds = [...new Set(lignes.map(r => r.aliment_id))];
//    const typeRepasIds = [...new Set(lignes.map(r => r.type_repas_id))];
//    logConsole(viewLog, emoji, fichier + '/enrichirLignes', 'alimentIds', alimentIds);
//    logConsole(viewLog, emoji, fichier + '/enrichirLignes', 'typeRepasIds', typeRepasIds);

//    // Appels vers bd-reference pour récupérer les aliments
//    //let queryFiltre = new URLSearchParams();
//    //alimentIds.forEach(id => queryFiltre.append('ids', id.toString()));
//    //const aliments = await AlimentService.listeParIds(queryFiltre.toString());
//    const aliments=  (await AlimentService.listeParIds(alimentIds)).map(alimentMapFromDb);
//    logConsole(viewLog, emoji, fichier + '/enrichirLignes', 'aliments', aliments);

//    // Appels vers bd-reference pour récupérer les repas
//    //queryFiltre = new URLSearchParams();
//    //typeRepasIds.forEach(id => queryFiltre.append('ids', id.toString()));
//    //const typesRepas = await RepasService.listeParIds(queryFiltre.toString());
//    const typesRepas = (await RepasService.listeParIds(typeRepasIds)).map(repasMapFromDb);
//    logConsole(viewLog, emoji, fichier + '/enrichirLignes', 'typesRepas', typesRepas);

//    // Construction de dictionnaire pour accès rapide
//    const alimentMap = new Map(aliments.map(a => [a.id, a]));
//    const repasMap = new Map(typesRepas.map(t => [t.id, t]));
   
//    // Reconstitution des lignes complètes
//    const lignesCompletes: LigneJournalAlimentaireComplet[] = lignes.map(ligne => {
//       const aliment = alimentMap.get(ligne.aliment_id);
//       const repas = repasMap.get(ligne.type_repas_id);

//       if (!aliment || !repas) {
//          const manquants = [];
//          if (!aliment) manquants.push("aliment");
//          if (!repas) manquants.push("repas");
//          throw new Error(
//             `Données manquantes pour la ligne id=${ligne.id} : ${manquants.join(" et ")}`
//          );
//       }
     

//       return {
//          uti_id: ligne.uti_id,
//          id: ligne.id,
//          date: ligne.date,
//          quantite: ligne.quantite,
//          points: ligne.nombre_point,
//          aliment,
//          repas,
//          unite: ligne.unite
//       };
//    });

//    return lignesCompletes;
// }

export const getLigne = async (req : Request, res : Response, next : NextFunction) => {

   try {

      console.group(fichier + '/getLigne');
      logConsole(viewLog, emoji, fichier + '/getLigne', 'req.query', req.query);
      
      // Vérification des paramètres de la requette
      const parseResultQuery = ligneJournalAlimentaireFiltreSchemas.safeParse(req.query) ;
      logConsole(viewLog, emoji, fichier + '/getLigne','parseResultQuery',parseResultQuery);

      if (!parseResultQuery.success) {
            logConsole(viewLog, emoji, fichier + '/getLigne','Erreur format body',parseResultQuery.error?.format()); 
            throw parseResultQuery.error
      }

      let date; 

      // Vérification de la date
      if (parseResultQuery.data.date) {
         date = toDateISO(parseResultQuery.data.date);
         logConsole(viewLog, emoji, fichier + '/getLigne', 'date fournie', date);
      } else {
         date = undefined;
         logConsole(viewLog, emoji, fichier + '/getLigne', 'aucune date fournie', ' date undefined');
      }

      let dateFin; 

      // Vérification de la date
      if (parseResultQuery.data.date_fin) {
         dateFin = toDateISO(parseResultQuery.data.date_fin);
         logConsole(viewLog, emoji, fichier + '/getLigne', 'date fournie', date);
      } else {
         dateFin = undefined;
         logConsole(viewLog, emoji, fichier + '/getLigne', 'aucune date fournie', ' date undefined');
      }


      const lignes = await JournalAlimmentaireService.liste(parseResultQuery.data.uti_id,date, dateFin, parseResultQuery.data.type_repas_id, parseResultQuery.data.ligne_id);
      logConsole(viewLog, emoji, fichier + '/getLigne', 'NB row', lignes.length);  
      //logConsole(viewLog, emoji, fichier + '/getLigne', 'lignes', lignes);  

      if (lignes.length === 0) {
         res.status(200).json([]);
         
      } else {

         const lignesCompletes = lignes.map(ligneMapFromDb);
         logConsole(viewLog, emoji, fichier + '/getLignes', 'NB lignesComplete',lignesCompletes.length );
         //logConsole(viewLog, emoji, fichier + '/getLignes', 'lignesCompletes',lignesCompletes );
         res.status(200).json(lignesCompletes);
      }
   } catch (err) {
      next(err) ;
   } finally {
      console.groupEnd();
   }
}

export const insertLigne = async (req : Request, res : Response, next :NextFunction) => {

   try {

      logConsole(viewLog, emoji, fichier + '/insertLigne','req.body',req.body);
      const parseResultBody = ligneJournalAlimentaireDataSimpleSchema.safeParse(req.body);
      logConsole(viewLog, emoji, fichier + '/insertLigne', 'parseResultBody', parseResultBody )

      if (!parseResultBody.success) {
         logConsole(viewLog, emoji, fichier + '/insertLigne','Erreur parse body',parseResultBody.error);
         throw parseResultBody.error;
      }

      const row = mapFromApi(parseResultBody.data) ;

      const id = await JournalAlimmentaireService.ajouter(row) ;

      return res.status(201).json(id); 
   } catch (err) {
      next (err) ;
   }
}

export const updateLigne = async (req: Request, res: Response, next : NextFunction) => {

   try {
  
      logConsole(viewLog, emoji, fichier + '/updateLigne','req.body',req.body); 
      const parseResultBody = ligneJournalAlimentaireDataSimpleSchema.safeParse(req.body);
      if (!parseResultBody.success) {
         logConsole(viewLog, emoji, fichier + '/updateLigne','Erreur format body',parseResultBody.error?.format()); 
         throw parseResultBody.error ;
      }

      logConsole(viewLog, emoji, fichier + '/updateLigne','req.params',req.params); 
      const parseResultParam = urlLigneJournalAlimentaireIdSchema.safeParse(req.params);
      if (!parseResultParam.success) {
         logConsole(viewLog, emoji, fichier + '/updateLigne',"Erreur de l'id",parseResultParam.error?.format()); 
         throw parseResultParam.error ;
      }

      const row = mapFromApi(parseResultBody.data) ;
      const id : number = parseResultParam.data.id;

      const ligne = await JournalAlimmentaireService.modifier(id, row);
      logConsole(viewLog, emoji, fichier + '/updateLigne',"retour",ligne); 
      
      if (!ligne) {
         return res.status(400).json({Erreur : "Pas d\'aliment mis à jour."});
      } else {
         
         const ligneMaj = ligneMapFromDb(ligne)

         logConsole(viewLog, emoji, fichier + '/getLigne', 'ligneMaj', ligneMaj);  

         res.status(200).json(ligneMaj);         
      }

   } catch (err) {
      next(err)
   }
};

export const deleteLigne = async (req : Request, res : Response, next : NextFunction) => {

   try {
      logConsole(viewLog, emoji, fichier + '/deleteLigne','req.params',req.params); 
      const parseResultParam = urlLigneJournalAlimentaireIdSchema.safeParse(req.params);

      if (!parseResultParam.success) {
         logConsole(viewLog, emoji, fichier + '/deleteLigne','Erreur format body',parseResultParam.error?.format()); 
         throw parseResultParam.error ;
      }

      const id : number = parseResultParam.data.id;

      const result = await JournalAlimmentaireService.supprimer(id);
      
      if (result === 0) {
         return res.status(404).json({ Erreur: "Aliment non trouvé" });
      } else {
         return res.status(204).json(result);
      }
      
   } catch (err) {
      next(err) ;
   }
}