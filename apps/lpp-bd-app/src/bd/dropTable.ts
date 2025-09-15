import pool from "./db";
import { PgError } from "./db";
import pkg from 'pg';


export async function supprimerTables () {
   console.log('Base de données : ' , pool);

   try {
      console.log('-------------------------------------------------------');
      console.log('SUPPRESSION DES TABLES                                 ');
      console.log('-------------------------------------------------------');

      await pool.query('DROP TABLE IF EXISTS journal_poids') ;
      console.log('Table "journal_poids" supprimée.');
      
      await pool.query('DROP TABLE IF EXISTS journal_alimentaire') ;
      console.log('Table "journal_alimentaire" supprimée.');
   
      await pool.query('DROP TABLE IF EXISTS suivi_hebdo') ;
      console.log('Table "suivi_hebdo" supprimée.');
      
      await pool.query('DROP TABLE IF EXISTS refresh_tokens') ;
      console.log('Table "refresh_tokens" supprimée.');
      
      await pool.query('DROP TABLE IF EXISTS utilisateur') ;
      console.log('Table "utilisateur" supprimée.');
      
      await pool.query('DROP TABLE IF EXISTS type_repas') ;
      console.log('Table "type_repas" supprimée.');
      
      await pool.query('DROP TABLE IF EXISTS aliment');
      console.log('Table "aliments" supprimée.');

      await pool.query('DROP TABLE IF EXISTS categorie');
      console.log('Table \'categories\' supprimée.');
      
      await pool.query('DROP TABLE IF EXISTS unite') ;
      console.log('Table "unite" supprimée.');
            
   } catch (err) {
      
      const pgErreur = err as PgError;
      console.error(`❌ [supprimerTables] ${pgErreur.message}`);
   } 
}

supprimerTables();