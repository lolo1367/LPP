import { CategorieRow, CategorieDataRow } from "@/types/categorie";
import pool from '../bd/db';
import { logConsole } from "@ww/reference";

// ==================================================
// Constant pour les logs
//===================================================
const viewLog: boolean = true;
const emoji = "​";
const fichier: string  = "categorieService";

/**
 * Remonte la liste des catagories. Elle peut être filtrée
 * @param nom - Filtre sur toute ou partie du nom
 * @returns - les lignes de catégories
 */
export async function liste (nom ? : string) : Promise<CategorieRow[]>{

	logConsole(viewLog, emoji, fichier + `/liste`,`nom`,nom);

	let query : string ;
	let params: (string)[] = [];
	
	query = `
		SELECT 	id,
					nom
			FROM categorie
			WHERE 1 = 1` ;

	if (nom || typeof nom === `string`) {
		params.push (`%${nom.toLowerCase()}%`);
		query += ` AND nom like $${params.length}` ;

	}

	query += ` ORDER BY nom ;` ;

	logConsole(viewLog, emoji, fichier + `/liste`,`query`,query);
	logConsole(viewLog, emoji, fichier + `/liste`,`params`,params);

  	try {

	 	const res = await pool.query<CategorieRow>(query,params) ;
	 	return res.rows ;

  	} catch (err) {
		  logConsole(viewLog, emoji, fichier + `/liste`, ` ❌ Erreur lors modification`, err);
		  throw err ;

  	} 
}

/**
 * Remonte la liste de catégories par rappot à une liste d`identifiant
 * @param ids 
 * @returns Les lignes de catégories
 */
export async function listeParIds(ids: number[]): Promise<CategorieRow[]> {

	logConsole(viewLog, emoji, fichier + `/listeParIds`, `ids`, ids);
	
	if (!ids.length) return [];
	
	let query : string ;
	const placeholders = ids.map(() => `?`).join(`, `);

	query = `
		SELECT 	id,
					nom
		FROM categorie
		WHERE id IN (${placeholders})`
	
	try {

		const res = await pool.query<CategorieRow>(query,ids) ;			 
		return res.rows ;

	} catch (err) {
		logConsole(viewLog, emoji, fichier + `/listeParIds`, `❌ Erreur lors la récupération des categories par ID`, err);
		throw err ;	
	} 
}

/**
 * Permet d`ajouter une catégorie
 * @param categorie - Donnée de la categorie
 * @returns - Identifiant de la categorie ajoutée
 */
export async function ajouter (categorie : CategorieDataRow) : Promise<number | undefined> {


	let params: (string | number)[];
	
	let query = `
		INSERT INTO categorie (
			id,
			nom)
		VALUES ($1, $2)
		RETURNING id`;

	try {
		
		// Récupération de l`identifiant
		const res = await pool.query<{ maxid: number }>(`SELECT MAX(id) + 1 AS maxId FROM categorie`);
		const id = res.rows[0].maxid ?? 1;

		params = [id, categorie.nom];		

  		logConsole(viewLog, emoji, fichier + `/liste`,`query`,query);
		logConsole(viewLog, emoji, fichier + `/liste`,`params`,params);
		
		const result = await pool.query<{id: number}> (query,params);
		return result.rows[0].id;

  	} catch (err) {
		logConsole(viewLog, emoji, fichier + `/ajouter`, `❌ Erreur lors de l\`ajout.`, err);
		throw err ;

  	} 
}

/**
 * Permet de modifier une catégorie
 * @param categorie - Catégorie à modifier
 * @returns - La catégorie modifiée
 */
export async function modifier (id : number , categorie : CategorieDataRow) : Promise <CategorieRow | null> {

	logConsole(viewLog, emoji, fichier + `/Modifier`,`id`,id) ;

	let query = `
		UPDATE categorie SET
			nom = $1
	 	WHERE id = $2
		RETURNING *`;

  	const params = [categorie.nom.trim(),id];

	logConsole(viewLog, emoji, fichier + `/Modifier`,`query`,query) ;
	logConsole(viewLog, emoji, fichier + `/Modifier`,`params`,params) ;

  	try {
		
		const res = await pool.query<CategorieRow>(query, params);
		if (!res.rows.length) return null;
			 
		logConsole(viewLog, emoji, fichier + `/modifier`,`row`,res.rows[0]);
		return res.rows[0];

	} catch (err) {
		logConsole(viewLog, emoji, fichier + `/modifier`, `❌ Erreur lors modification`, err);
	 	throw err ;
  	} 
}

export async function supprimer (id : number) : Promise<number> {

  	try {

	 	const res = await pool.query (`DELETE FROM categorie WHERE id = $1`,[id]);
	 	return res.rowCount || 0 ;

  	} catch (err) {
		logConsole(viewLog, emoji, fichier + `/supprimer`, `❌ Erreur lors modification`, err);
		throw err ;

	} 
}