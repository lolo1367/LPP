import pool from "../bd/db";
import { logConsole } from "@ww/reference";
import { SuiviHebdoDataRow, SuiviHebdoRow } from "../types/suiviHebdo.js";
import * as JournalAlimentaireService from "../services/journalAlimentaireService";
import * as UtilisateurService from "../services/utilisateurService";
import { startOfWeek, addDays, format} from "date-fns";

type Resultat = {
   date: string;
   pointsAutorises: number;
   pointsConsommes: number;
   bonusUilise: number;
   bonusRestant: number;
}

export type Retour = {
   success: boolean;
   message: string;
   resultats : {
      semaine: string;
      recap: Resultat[];
      pointJour: number;
      bonusInitial: number;
      bonusRestant: number;
   }
}

const viewLog = true;
const emoji = "🦕​​";
const file = "suiviHebdoService" ;

export async function calculerSuiviHebdo(uti_id: number, date: Date): Promise<Retour> {

   logConsole(viewLog, emoji, file + `/calculerSuiviHebdo`, `date`, date);
   logConsole(viewLog, emoji, file + `/calculerSuiviHebdo`, `uti_id`, uti_id);
   
   try {

      const lundi = startOfWeek(date, { weekStartsOn: 1 });
      const dimanche = addDays(lundi, 6);
      logConsole(viewLog, emoji, file + `/calculerSuiviHebdo`, `lundi`, format(lundi, `yyyy-MM-dd`));
      logConsole(viewLog, emoji, file + `/calculerSuiviHebdo`, `dimanche`, format(dimanche, `yyyy-MM-dd`));
      
      const lignes = await JournalAlimentaireService.liste(uti_id, lundi, dimanche);
      const utilisateur = await UtilisateurService.liste(undefined, uti_id);
      
      if (utilisateur.length === 0) {

         const retour: Retour = {
            success: false,
            message: `Utilisateur inconnu`,
            resultats: {
               semaine: format(lundi, "yyyy-MM-dd"),
               recap: [],
               pointJour: 0,
               bonusInitial: 0,
               bonusRestant: 0
            }
         }
         return retour;
      }
      logConsole(viewLog, emoji, file + `/calculerSuiviHebdo`, `utilisateur`, utilisateur);
      const point_bonus = utilisateur[0].point_bonus;
      const point_jour = utilisateur[0].point_jour;

      let resultats: Resultat[] = [];
      let bonusRestant = point_bonus;

      for (let i = 0; i < 7; i++) {
         const jour = addDays(lundi, i);
         const jourStr = format(jour, "yyyy-MM-dd");

         const lignesJour = lignes.filter(l => l.date === jourStr);
         const pointConsommes = lignesJour.reduce((total: number, ligne) => total + ligne.nombre_point, 0);
         
         let depassement = pointConsommes - point_jour;

         if (depassement < 0) depassement = 0;

         const bonusUtilise = Math.min(depassement, bonusRestant);

         bonusRestant -= bonusUtilise;

         resultats.push({
            date: jourStr,
            pointsAutorises: point_jour,
            pointsConsommes: pointConsommes,
            bonusUilise: bonusUtilise,
            bonusRestant: bonusRestant
         });
      }

      return {
   
         success: true,
         message: ``,
         resultats: {
            semaine: format(lundi, "yyyy-MM-dd"),
            recap: resultats,
            pointJour: point_jour,
            bonusInitial: point_bonus,
            bonusRestant: bonusRestant
         }
      }
   } catch (err) {
      throw err;
   }
};
   

export async function liste (uti_id: number, date: Date): Promise<SuiviHebdoRow[]> {

   logConsole (viewLog,emoji, file +`/liste`, `date`, date);

   const lundi = startOfWeek (date, {weekStartsOn : 1});
   logConsole (viewLog,emoji, file +`/liste`, `lundi`, format(lundi, "yyyy-MM-dd"));

   const dateStr = format(lundi, "yyyy-MM-dd");
   logConsole (viewLog,emoji, file +`/liste`, `dateStr`, dateStr);

   let query : string ;
   let params: (string | number)[] = [];

   query = `
      SELECT
         uti_id,
         semaine,
         point_bonus_initial,
         point_bonus_restant,
         point_journalier,         
         point_lundi_utilise,
         point_mardi_utilise,
         point_mercredi_utilise,
         point_jeudi_utilise,
         point_vendredi_utilise,
         point_samedi_utilise,
         point_dimanche_utilise,
         point_total_initial,
         point_total_utilise,
         derniere_mise_a_jour
      FROM 
         suivi_hebdo
      WHERE uti_id = $1 ` ;

   params.push(uti_id);

   if (dateStr) {
      query += ` AND semaine = $2::date` ;
      params.push (dateStr);
   }
   
   query += ` ORDER BY semaine ;`
   
   try {   

      const res = await pool.query<SuiviHebdoRow>(query, params);
      return res.rows ;

   } catch (err) {
      logConsole (viewLog,emoji, file +`/liste`, `❌​Erreur lors de la récupération du suivi hebdomadaire.`, err);
      throw err ;   
   }       
}

export async function ajouterModifierSuiviHebdo(suivi: SuiviHebdoDataRow): Promise<SuiviHebdoRow[] | null> {

   
   logConsole (viewLog,emoji, file +`/ajouterModifierSuiviHebdo`, `suivi`, suivi);
   let query : string ;
   let params: (string | number)[] = [];

   query = `
      INSERT INTO suivi_hebdo (
         uti_id,
         semaine,
         point_bonus_initial,
         point_bonus_restant,
         point_journalier,
         point_lundi_utilise,
         point_mardi_utilise,
         point_mercredi_utilise,
         point_jeudi_utilise,
         point_vendredi_utilise,
         point_samedi_utilise,
         point_dimanche_utilise,
         point_total_initial,
         point_total_utilise,
         derniere_mise_a_jour
      ) VALUES ($1 ,$2 , $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13 , $14, CURRENT_TIMESTAMP)
      ON CONFLICT(semaine) DO UPDATE SET
         uti_id = excluded.uti_id,
         point_bonus_initial = excluded.point_bonus_initial,
         point_bonus_restant = excluded.point_bonus_restant,
         point_journalier = excluded.point_journalier,
         point_lundi_utilise = excluded.point_lundi_utilise,
         point_mardi_utilise = excluded.point_mardi_utilise,
         point_mercredi_utilise = excluded.point_mercredi_utilise,
         point_jeudi_utilise = excluded.point_jeudi_utilise,
         point_vendredi_utilise = excluded.point_vendredi_utilise,
         point_samedi_utilise = excluded.point_samedi_utilise,
         point_dimanche_utilise = excluded.point_dimanche_utilise,
         point_total_initial = excluded.point_total_initial,
         point_total_utilise = excluded.point_total_utilise,
         derniere_mise_a_jour = CURRENT_TIMESTAMP
         RETURNING *;` ;
         
   params = [
      suivi.uti_id,
      suivi.semaine,
      suivi.point_bonus_initial,
      suivi.point_bonus_restant,
      suivi.point_journalier,
      suivi.point_lundi_utilise,
      suivi.point_mardi_utilise,
      suivi.point_mercredi_utilise,
      suivi.point_jeudi_utilise,
      suivi.point_vendredi_utilise,
      suivi.point_samedi_utilise,
      suivi.point_dimanche_utilise,
      suivi.point_total_initial,
      suivi.point_total_utilise];

   logConsole (viewLog,emoji, file +`/ajouterModifierSuiviHebdo`, `query`,query) ;
   logConsole (viewLog,emoji, file +`/ajouterModifierSuiviHebdo`, `params`, params);

   try {
      const res = await pool.query(query, params);

      // Si aucune données mise à jour
      if (!res.rows.length || res.rows.length === 0) {
         logConsole (viewLog,emoji, file +`/ajouterModifierSuiviHebdo`, `❌​ Pas de ligne modifiée`,"");
         return null ;
      };

      return res.rows[0];

   } catch (err) {
      logConsole (viewLog, emoji, file + `/ajouterModifierSuiviHebdo`, " ❌​ Erreur lors de la modification du suivi hebdomadaire.", err);
      throw err;
   } 
}

export async function majApresModification(uti_id: number,date: Date) {


   logConsole (viewLog,emoji, file +`/majApresModification`, `date`, date);

   const retour = await calculerSuiviHebdo(uti_id, date);
   
   if (!retour.success) {
      return;
   }

   logConsole (viewLog,emoji, file +`/majApresModification`, `recap.semaine`, retour.resultats.semaine);

   // On mappe les jours vers les bons champs
   const pointsParJour: Record<string, number> = {
      lundi: 0,
      mardi: 0,
      mercredi: 0,
      jeudi: 0,
      vendredi: 0,
      samedi: 0,
      dimanche: 0,
   };

   const joursOrdre: (keyof typeof pointsParJour)[] = [
      "lundi",
      "mardi",
      "mercredi",
      "jeudi",
      "vendredi",
      "samedi",
      "dimanche",
   ];

   // Remplissage des points utilisés par jour
   retour.resultats.recap.forEach((jour, index) => {
      const nomJour = joursOrdre[index];
      pointsParJour[nomJour] = jour.pointsConsommes;
   });
   
   return await ajouterModifierSuiviHebdo({
      uti_id: uti_id,
      semaine: retour.resultats?.semaine,
      point_bonus_initial: retour.resultats.bonusInitial,
      point_bonus_restant: retour.resultats.bonusRestant,
      point_journalier: retour.resultats.pointJour,
      point_lundi_utilise: pointsParJour.lundi,
      point_mardi_utilise: pointsParJour.mardi,
      point_mercredi_utilise: pointsParJour.mercredi,
      point_jeudi_utilise: pointsParJour.jeudi,
      point_vendredi_utilise: pointsParJour.vendredi,
      point_samedi_utilise: pointsParJour.samedi,
      point_dimanche_utilise: pointsParJour.dimanche,
      point_total_initial: retour.resultats.pointJour * 7,
      point_total_utilise: retour.resultats.recap.reduce((sum, jour) => sum + jour.pointsConsommes, 0),
   });
}

