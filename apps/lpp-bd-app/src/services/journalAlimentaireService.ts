import { LigneJournalAlimentaireRow, LigneJournalAlimentaireDataRow, LigneJournalAlimentaireDataCompletRow } from "../types/ligneJournalalimentaire";
import {AlimentRecentRow} from '../types/aliment'
import * as Trace from "../utils/logger";
import pool from "../bd/db";
import * as AlimentService from "../services/alimentService";
import * as TypeRepasService from "../services/repasService";
import { ContraintBaseReferenceError} from "@ww/reference";
import * as SuiviHebdoService from "../services/suiviHebdoService";


async function verifierIdsExistants(alimentId: number, typeRepasId: number) {
   const [aliments, repas] = await Promise.all([
      AlimentService.listeParIds([alimentId]),
      TypeRepasService.listeParIds([typeRepasId])
   ]);

   const erreurs = [];
   if (aliments.length === 0) erreurs.push(`Aucun aliment trouvé dans le dictionnaire avec l'id= ${alimentId}`);
   if (repas.length === 0) erreurs.push(`Aucun type de repas trouvé dans le dictionnaire avec l'id= ${typeRepasId}`);

   if (erreurs.length > 0) {
      throw new ContraintBaseReferenceError (erreurs.join(" / "));
   }
}

export async function getLigneById(id: number): Promise<LigneJournalAlimentaireRow | null> {

   Trace.traceDebut(__filename, `getLigneById`);
   Trace.traceInformation(__filename, `getLigneById`, `id`, id);
   
   const rows = await liste(undefined, undefined, undefined, undefined, id);
   Trace.traceInformation(__filename, `getLigneById`, `Nombre de lignes trouvées`, rows.length);
   
   if (rows.length >= 1) {
      return rows[0];
   } else {
      return null;
   }
} 

export async function liste(uti_id: number|undefined, date: Date | undefined, dateFin : Date | undefined,  typeRepasId?: number, ligneId?: number) : Promise <LigneJournalAlimentaireDataCompletRow[]> {  

   Trace.traceDebut(__filename, `liste`); 
   Trace.traceInformation(__filename, `liste`, `uti`, uti_id); 
   Trace.traceInformation(__filename, `liste`, `date`, date);  
   Trace.traceInformation(__filename, `liste`, `dateFin`, dateFin);  
   Trace.traceInformation(__filename, `liste`, `type_repas_id`, typeRepasId);
   Trace.traceInformation(__filename, `liste`, `ligne_id`, ligneId);

   let query : string ;
   let params: (string | number)[] = [];
  
   query = `
      SELECT
         ja.id as id,
         ja.uti_id as uti_id,
         ja.date as date,
         al.id as aliment_id,
         al.nom as aliment_nom,
         al.quantite as aliment_quantite,
         al.unite as aliment_unite,
         al.points as aliment_points,
         al.categorie_id as categorie,
         al.calories aliment_calories,
         al.fibres as aliment_fibres,
         al.proteines as aliment_proteines,
         al.matieres_grasses as aliment_matieres_grasses,
         al.acide_gras_sature as aliment_acide_gras_sature,
         al.glucides as aliment_glucides,
         al.sel as aliment_sel,
         al.sucres as aliment_sucres,
         al.zero_point as aliment_zero_point,
         ja.quantite as quantite,
         ca.id as categorie_id,
         ca.nom as categorie_nom,
         tr.id as type_repas_id,
         tr.nom as type_repas_nom,
         tr.icone as type_repas_icone,
         tr.ordre as type_repas_ordre,
         ja.nombre_point as nombre_point,
         ja.unite as unite
      FROM journal_alimentaire ja
         INNER JOIN aliment al ON ja.aliment_id = al.id
         INNER JOIN type_repas tr ON ja.type_repas_id = tr.id
         INNER JOIN categorie ca ON ca.id = al.categorie_id
      WHERE 1 = 1 ` ; 
   
   if (uti_id) {
      query += ` AND uti_id = $1`
      params.push(uti_id);
   }

   if (date && dateFin) {
      query += ` AND date BETWEEN $2::date AND $3::date`;
      params.push(
         date.toISOString().split(`T`)[0],
         dateFin.toISOString().split(`T`)[0]
      );
      
   } else if (date) {
      query += ` AND date = $2::date`;
      const dateStr  = date.toISOString().split(`T`)[0];
      params.push (dateStr) ;
   }

   if (typeRepasId) {
      params.push (typeRepasId);
      query += ` AND type_repas_id = $${params.length}` ;
   }

   if (ligneId) {
      params.push (ligneId);
      query += ` AND id = $${params.length}` ;
   }

   query += ` ORDER BY date,type_repas_id ;`

   Trace.traceInformation(__filename,`liste`,`query`, query);
   Trace.traceInformation(__filename,`liste`,`param`, params);
   
   try {
      const res = await pool.query<LigneJournalAlimentaireDataCompletRow>(query, params);
      Trace.traceInformation(__filename,`liste`,`Nombre de lignes trouvées`, res.rows.length);
      return res.rows ;
      
   } catch (err) {
 		Trace.traceErreur(__filename, `liste`, `Erreur lors récupération des lignes du journal alimentaires`, err);
 		throw err ;	
	}  
}

export async function ajouter (ligneJournal: LigneJournalAlimentaireDataRow) : Promise<number | undefined> {
   Trace.traceDebut(__filename, `ajouter`);

   let params : (string | number | Date)[];
    
   let query = `
      INSERT INTO journal_alimentaire (
         uti_id,
         date, 
         aliment_id, 
         type_repas_id,
         quantite, 
         nombre_point,
         unite)
      VALUES ($1, $2::date, $3 , $4 , $5, $6, $7)
      RETURNING id`;

   params = [
      ligneJournal.uti_id,
      ligneJournal.date,
      ligneJournal.aliment_id,
      ligneJournal.type_repas_id,
      ligneJournal.quantite,
      ligneJournal.nombre_point,
      ligneJournal.unite ];
   
   Trace.traceInformation(__filename, `ajouter`, `query`, query);
   Trace.traceInformation(__filename, `ajouter`, `params`, params);

   try {

      const res = await pool.query<{id : number}>(query, params);
      
      // Mise à jour du suivi quotidien
      SuiviHebdoService.majApresModification(ligneJournal.uti_id, new Date (ligneJournal.date));

      return res.rows[0].id;

   } catch (err) {
 		Trace.traceErreur(__filename, `ajouter`, "Erreur lors de l`ajout d`une ligne au journal alimentaire.", err);
      throw err;
      
   } 
}

export async function modifier(id: number, ligneJournal: LigneJournalAlimentaireDataRow): Promise <LigneJournalAlimentaireDataCompletRow | null>{
  
   Trace.traceDebut(__filename, `modifier`);
   Trace.traceInformation (__filename, `Modifier`, `id`, id);

   let query = `
      UPDATE journal_alimentaire SET
         uti_id = $1,
         date = $2::date,
         aliment_id = $3,
         type_repas_id = $4,
         quantite = $5, 
         nombre_point = $6,
         unite = $7  
      WHERE id = $8` ;
    
   const params = [
      ligneJournal.uti_id,
      ligneJournal.date,
      ligneJournal.aliment_id,
      ligneJournal.type_repas_id,
      ligneJournal.quantite,
      ligneJournal.nombre_point,
      ligneJournal.unite,
      id];
   
   Trace.traceInformation (__filename,`Modifier`,`query`,query) ;
   Trace.traceInformation(__filename, `Modifier`, `params`, params);
   
   try {

      const res = await pool.query(query, params);
      Trace.traceInformation( __filename,"modifier","res",res);

      // Si aucune données mise à jour
		if (res.rowCount === 0) {
			Trace.traceInformation( __filename,"modifier","Pas de ligne modifiée","");
			return null ;
		};

      // Mise à jour du suivi quotidien
      SuiviHebdoService.majApresModification(ligneJournal.uti_id, new Date(ligneJournal.date));
      
      // Si des données sont mises à jour on les retourne
      const rows =  await liste(undefined, undefined, undefined, undefined, id);
      
      return rows[0];

   } catch (err) {
 		Trace.traceErreur(__filename, `modifier`, "Erreur lors de la modification d`une ligne au journal alimentaire.", err);
      throw err;
   } 
  }

export async function supprimer(id: number): Promise<number> {

   Trace.traceDebut(__dirname, `supprimer`);
   
	try {

      // Vérification de l`existance de la ligne - On doit récupéré la date avant la suppression
      const row = await getLigneById(id);

      if (!row) {
         return 0;
      }
      
      const res = await pool.query(`DELETE FROM journal_alimentaire WHERE id = $1`, [id]);
      
      // Mise à jour du suivi quotidien
      SuiviHebdoService.majApresModification(row.uti_id,new Date(row.date));
      return res.rowCount || 0;

	} catch (err) {
 		Trace.traceErreur (__filename, `supprimer`, `Erreur lors modification`, err);
		throw err ;
	} 
}   

export async function getAlimentParPeriode(uti_id: number, dateDebut: Date, dateFin: Date): Promise<AlimentRecentRow[]> {

   Trace.traceDebut(__filename, `getAlimentParPeriode`);
   Trace.traceInformation(__filename, `getAlimentParPeriode`, `uti_id`, uti_id);
   Trace.traceInformation(__filename, `getAlimentParPeriode`, `dateDebut`, dateDebut);
   Trace.traceInformation(__filename, `getAlimentParPeriode`, `dateFin`, dateFin);

   let query: string;
   let params: (string | number)[] = [];
  
   query = `
      SELECT
         al.id,
         al.nom,
		   al.categorie_id,
		   ca.nom as "categorie",
		   T1.quantite,
         T1.nombre_point as "points",
         T1.unite,
		   al.calories,
		   al.fibres,
		   al.proteines,
		   al.matieres_grasses,
		   al.acide_gras_sature,
		   al.glucides,
		   al.sel,
		   al.sucres,
		   al.zero_point,
         max(T1.date) as "date"
      FROM 
         journal_alimentaire as t1
            INNER JOIN aliment as al on t1.aliment_id = al.id
			INNER JOIN categorie as ca ON ca.id = al.categorie_id
            INNER JOIN (SELECT
                     uti_id,
                     aliment_id,
                     MAX(date) AS max_date
                  FROM
                     journal_alimentaire
                  WHERE
                     uti_id= $1 AND
                     date BETWEEN $2 AND $3
                  GROUP BY
                     aliment_id,
                     uti_id) AS t2
                  ON 
                     t1.uti_id = t2.uti_id AND 
                     t1.aliment_id = t2.aliment_id AND 
                     t1.date=t2.max_date
      GROUP BY 
         al.id,
         al.nom,
         al.categorie_id,
		   ca.nom,
         T1.quantite,
         T1.nombre_point,
         T1.date,
         T1.id,
         T1.unite,
         al.calories,
		   al.fibres,
		   al.proteines,
		   al.matieres_grasses,
		   al.acide_gras_sature,
		   al.glucides,
		   al.sel,
		   al.sucres,
		   al.zero_point
      ORDER BY
         t1.date DESC;`;
   
   params.push(
      uti_id,
      dateDebut.toISOString().split(`T`)[0],
      dateFin.toISOString().split(`T`)[0]
   );
   Trace.traceInformation(__filename, `getAlimentParPeriode`, `query`, query);
   Trace.traceInformation(__filename, `getAlimentParPeriode`, `params`, params);
   
   try {

      const res = await pool.query<AlimentRecentRow>(query, params);
      Trace.traceInformation(__filename, `getAlimentParPeriode`, `Nombre de lignes trouvées`, res.rows.length);
      return res.rows;
      
   } catch (err) {
      Trace.traceErreur(__filename, `getAlimentParPeriode`, `Erreur lors récupération des aliments récents du journal alimentaire`, err);
      throw err;
	
   } 
}

