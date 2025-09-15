import { LigneJournalPoidsRow,LigneJournalPoidsDataRow } from "../types/ligneJournalPoids";
import * as Trace from "../utils/logger";
import pool from "../bd/db";


export async function liste(uti_id: number, date_debut: Date | undefined, date_fin : Date | undefined, ligne_id?:number) {  
 
   Trace.traceInformation(__filename, `liste`, `uti_id`, uti_id);  
   Trace.traceInformation(__filename, `liste`, `date_debut`, date_debut);
   Trace.traceInformation(__filename, `liste`, `date_fin`, date_fin);
   Trace.traceInformation(__filename, `liste`, `ligneId`, ligne_id);  

   let query : string ;
   let params: (string | number)[] = [];
  
  query = `
      SELECT   id,
               uti_id,
               date,
               poids                
      FROM journal_poids
      WHERE uti_id = $1` ;
   
   params.push(uti_id);

   if (date_debut && date_fin) {
      const dateDebutStr = date_debut.toISOString().split(`T`)[0];
      const dateFinStr = date_fin.toISOString().split(`T`)[0];
      params.push(dateDebutStr);
      params.push(dateFinStr);
      query += ` AND date BETWEEN $2::date AND $3::date`;      
   } else if (date_debut && !date_fin) {
      const dateDebutStr = date_debut.toISOString().split(`T`)[0];
      params.push(dateDebutStr);
      query += ` AND date = $2::date`;
   } 

   if (ligne_id) {
      params.push (ligne_id);
      query += ` AND id = $${params.length}` ;
   }

   query += ` ORDER BY date ;`
   
   try {
      const res = await pool.query<LigneJournalPoidsRow>(query, params);
      return res.rows ;
      
   } catch (err) {
      Trace.traceErreur(__filename, `liste`, `Erreur lors récupération des lignes du journal du poids`, err);
      throw err ;   
   }  
}

export async function ajouter (ligneJournal: LigneJournalPoidsDataRow) : Promise<number | undefined> {
   Trace.traceDebut(__filename, `ajouter`);
   let params : (string | number | Date)[];
    
   let query = `
      INSERT INTO journal_poids (
         uti_id,
         date,
         poids)
      VALUES ($1, $2::date, $3)
      RETURNING id`;

   params = [
      ligneJournal.uti_id,
      ligneJournal.date,
      ligneJournal.poids];
   
   Trace.traceInformation(__filename, `ajouter`, `query`, query);
   Trace.traceInformation(__filename, `ajouter`, `params`, params);

   try {
      const res = await pool.query< {id : number}> (query,params);
      return res.rows[0].id;

   } catch (err) {
      Trace.traceErreur(__filename, `ajouter`, "Erreur lors de l`ajout d`une ligne au journal du poids.", err);
      throw err;      
   } 
}

export async function modifier(id: number, ligneJournal: LigneJournalPoidsDataRow): Promise <LigneJournalPoidsRow | null>{
  
   Trace.traceDebut(__filename, `modifier`);
   Trace.traceInformation (__filename, `Modifier`, `id`, id);
    
   let query = `
      UPDATE journal_poids SET
         uti_id = $1,
         date = $2::date,
         poids = $3  
      WHERE id = $4
      RETURNING *` ;
    
   const params = [
      ligneJournal.uti_id,
      ligneJournal.date,
      ligneJournal.poids,
      id];
   
   Trace.traceInformation (__filename,`Modifier`,`query`,query) ;
   Trace.traceInformation(__filename, `Modifier`, `params`, params);
   
   try {
      const result = await pool.query<LigneJournalPoidsRow>(query, params);

      // Si aucune données mise à jour
      if (!result.rows.length || result.rows.length === 0) {
         Trace.traceInformation( __filename,"modifier","Pas de ligne modifiée","");
         return null ;
      };

      return result.rows[0];

   } catch (err) {
      Trace.traceErreur(__filename, `modifier`, "Erreur lors de la modification d`une ligne au journal du poids.", err);
      throw err;
   } 
  }

export async function supprimer(id: number): Promise<number> {

   Trace.traceDebut(__dirname, `supprimer`);

   try {

      const res = await pool.query (`DELETE FROM journal_poids WHERE id = ?`,[id]);
      return res.rowCount || 0 ;

   } catch (err) {
      Trace.traceErreur (__filename, `supprimer`, `Erreur lors modification`, err);
      throw err ;
   } 
}   
