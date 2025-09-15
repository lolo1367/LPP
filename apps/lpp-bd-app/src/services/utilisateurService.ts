import { Database } from "sqlite";
import { Utilisateur,UtilisateurData } from "@ww/reference";
import {logConsole} from "@ww/reference";
import pool from "../bd/db";
import bcrypt from "bcrypt";
import { V } from "vitest/dist/chunks/reporters.d.BFLkQcL6";

//================================================
// Constantes affichage
//================================================
const viewLog: boolean = true;
const emoji = "🙍‍♀️​";
const fichier: string = "utilisateurService";

// ===============================================
// Fonction de hash du mot de passe
// ===============================================

const saltRounds = 12;

async function hashPassword(plainPassword: string): Promise<string> {
   return await bcrypt.hash(plainPassword, saltRounds);
}

   async function verifyPassword(plainPassword: string, hash: string): Promise<boolean> {

      logConsole(viewLog, emoji, fichier, `mdp`, plainPassword);
      logConsole(viewLog, emoji, fichier, `mdp après hash`, await hashPassword(plainPassword));
      logConsole(viewLog, emoji, fichier, `hash`, hash);


      return await bcrypt.compare(plainPassword, hash);
   } 

// =================================================
// Retour verification login
// =================================================
export type Retour = {
   success: boolean;
   message: `` | `Mot de passe incorrect` | `Utilisateur inconnu`;
   utilisateur: Utilisateur | null;
}

export async function liste(nom?: string  , utiId?: number) : Promise <Utilisateur[]> {  

   logConsole (viewLog, emoji, fichier + `/liste`, `nom`, nom); 
   logConsole(viewLog, emoji, fichier + `/liste`, `utiId`, utiId);  
   
   let query : string ;
   let params: (string | number)[] = [];
  
   query = `
      SELECT   id,
               nom,
               prenom,
               email,
               sexe,
               '' as mdp,
               taille,
               point_bonus,
               point_jour
      FROM utilisateur
      WHERE 1 = 1 ` ; 
   
   if (utiId) {
      params.push(utiId);
      query += ` AND id = $${params.length}`

   }

   if (nom) {
      params.push(nom);
      query += ` AND LOWER(nom) like $${params.length}`;
   }
      
   query += ` ORDER BY nom, prenom ;`

   logConsole (viewLog, emoji, fichier + `/liste`,`query`, query);
   logConsole (viewLog, emoji, fichier + `/liste`,`param`, params);
   
   try {
      const res = await pool.query<Utilisateur>(query, params);
      logConsole(viewLog, emoji, fichier + `/liste`, `Nombre de lignes trouvées`, res.rows.length);
      logConsole (viewLog, emoji, fichier + `/liste`,`Nombre de lignes trouvées`, res.rows);
      return res.rows ;
      
   } catch (err) {
 		logConsole (viewLog, emoji, fichier + `/liste`, `❌​ Erreur lors récupération des utilisateurs`, err);
 		throw err ;
	} 
}

export async function ajouter (utilisateur: UtilisateurData) : Promise<number | undefined> {
   logConsole (viewLog, emoji, fichier + `/ajouter`,`Debut`,``);

   let params: (string | number | Date)[];
   
   const mdpHashe = await hashPassword(utilisateur.mdp);
    
   let query = `
      INSERT INTO utilisateur (
         nom, 
         prenom, 
         email,
         sexe,
         '' as mdp, 
         taille,
         point_bonus,
         point_jour)
      VALUES ($1, $2, $3, $4 ,$5 ,$6 ,$7 ,$8)
      RETURNING id`;

   params = [
      utilisateur.nom,
      utilisateur.prenom,
      utilisateur.email,
      utilisateur.sexe,
      mdpHashe,
      utilisateur.taille,
      utilisateur.point_bonus,
      utilisateur.point_jour];
   
   logConsole (viewLog, emoji, fichier + `/ajouter`, `query`, query);
   logConsole (viewLog, emoji, fichier + `/ajouter`, `params`, params);

   try {

      const res = await pool.query<{ id: number }>(query, params);
      
      return res.rows[0].id;

   } catch (err) {
 		logConsole (viewLog, emoji, fichier + `/ajouter`, "Erreur lors de l`ajout d`un utillsateur.", err);
      throw err;
      
   } 
}

export async function modifier(id: number, utilisateur: UtilisateurData): Promise <Utilisateur | null>{
  
   logConsole (viewLog, emoji, fichier + `/modifier`,`Début`,``);
   logConsole(viewLog, emoji, fichier + `/Modifier`, `id`, id);
   
   const mdpHashe = await hashPassword(utilisateur.mdp);
    
   let query = `
      UPDATE utilisateur SET
         nom = $1,
         prenom = $2,
         email = $3,
         sexe = $4,
         mdp = $5,
         taille = $6,
         point_bonus = $7,
         point_hebdo = $8
      WHERE id = $9
      RETURNING *` ;
    
   const params = [
      utilisateur.nom,
      utilisateur.prenom,
      utilisateur.email,
      utilisateur.sexe,
      mdpHashe,
      utilisateur.taille,
      utilisateur.point_bonus,
      utilisateur.point_jour,
      id];
   
   logConsole (viewLog, emoji, fichier + `/Modifier`,`query`,query) ;
   logConsole (viewLog, emoji, fichier + `/Modifier`, `params`, params);
   
   try {
      const res = await pool.query<Utilisateur> (query,params) ;

      // Si aucune données mise à jour
		if (!res.rows.length) {
			logConsole (viewLog, emoji, fichier + `/modifier`,"Pas de ligne modifiée","");
			return null ;
		};

      logConsole (viewLog, emoji, fichier + `/modifier`, `rows`, res.rows);
      
      return res.rows[0];

   } catch (err) {
 		logConsole (viewLog, emoji, fichier + `/modifier`, "Erreur lors de la modification d`une ligne au journal alimentaire.", err);
      throw err;
   } 
}

export async function supprimer(id: number): Promise<number> {

   logConsole (viewLog, emoji, fichier + `/supprimer`,`Début`,``);
   
	try {

      const res = await pool.query(`DELETE FROM utilisateur WHERE id = $1`, [id]);
      
		return res.rowCount || 0;

	} catch (err) {
 		logConsole (viewLog, emoji, fichier + `/supprimer`, ` ❌​ Erreur lors modification`, err);
		throw err ;
	} 
}   

export async function verifierLogin(email: string, mdp: string) : Promise <Retour> {  

   logConsole(viewLog, emoji, fichier + `/verifierLogin`, `email`, email); 
   logConsole(viewLog, emoji, fichier + `/verifierLogin`, 'DATABASE_URL', process.env.DATABASE_URL);

   let query : string ;
   let params: (string )[] = [];
  
   query = `
      SELECT   id,
               nom,
               prenom,
               email,
               sexe,
               mdp,
               taille,
               point_bonus,
               point_jour
      FROM utilisateur
      WHERE
         email = $1 ;` ; 
   
   params.push(email);
   logConsole (viewLog, emoji, fichier + `/getByLogin`,`query`, query);
   logConsole (viewLog, emoji, fichier + `/getByLogin`,`param`, params);
   
   try {
      const res = await pool.query<Utilisateur>(query, params);
      logConsole(viewLog, emoji, fichier + `/getByLogin`, `Nombre de lignes trouvées`, res.rows.length);
      logConsole(viewLog, emoji, fichier + `/getByLogin`, `rows`, res.rows);
      
      // Pas d`utilisateur
      if (0 === res.rows.length) {
         const retour: Retour = {
            success: false,
            message: `Utilisateur inconnu`,
            utilisateur: null
         }
         return retour;
      }

      const utilisateur = res.rows[0];
      const mdpBd =  utilisateur.mdp;

      // Vérification du mot de passe
      const result = await verifyPassword(mdp, utilisateur.mdp);
      if (!result) {
         const retour: Retour = {
            success: false,
            message: `Mot de passe incorrect`,
            utilisateur: null
         }
         return retour;
      }

      utilisateur.mdp = ``;

      const retour: Retour = {
         success: true,
         message: ``,
         utilisateur: utilisateur
      }   

      
      return retour ;
      
   } catch (err) {
 		logConsole (viewLog, emoji, fichier + `/getByLogin`, "❌​ Erreur lors récupération de l`utilisateur via login/mdp", err);
 		throw err ;	
	} 
}


