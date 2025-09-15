import {
  logConsole,
  Unite
} from "@ww/reference";
import pool from "../bd/db";

// ==================================================
// Constant pour les logs
//===================================================
const viewLog=  true;
const emoji= ``;
const fichier = `uniteService`;

/**
 * Remonte la liste des unités. Elle peut être filtrée
 * @param nom - Filtre sur toute ou partie du nom
 * @returns - les lignes d`unité
 */
export async function liste (nom ? : string) : Promise<Unite[]>{

	logConsole(viewLog, emoji, fichier + `/liste`,`nom`,nom);

	let query : string ;
	let params: (string)[] = [];
	
	query = `
		SELECT 	unite
			FROM unite
			WHERE 1 = 1` ;

	if (nom || typeof nom === `string`) {
		params.push (`%${nom.toLowerCase()}%`);
		query += ` AND unite like $${params.length}` ;
	}

	query += ` ORDER BY unite` ;

	logConsole(viewLog, emoji, fichier + `/liste`,`query`,query);
	logConsole(viewLog, emoji, fichier + `/liste`,`params`,params);

  	try {
	 	const res = await pool.query<Unite>(query,params) ;
	 	return res.rows ;

  	} catch (err) {
	   logConsole(viewLog, emoji, fichier + `/liste`, ` ❌ Erreur lors modification`, err);
		throw err ;

  	} 
}