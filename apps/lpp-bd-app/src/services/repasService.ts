import { RepasRow, RepasDataRow } from "../types/repas";
import pool from "../bd/db";
import { logConsole } from "@lpp/communs";

// ==================================================
// Constant pour les logs
//===================================================
const viewLog: boolean = true;
const emoji = "​";
const fichier: string  = "repasService";

/**
 * Remonte la liste des repas. Elle peut être filtrée
 * @returns - les lignes de repas
 */
export async function liste () : Promise<RepasRow[]>{

	let query : string ;
	let params : (string)[]= [];

	query = `
		SELECT 	id,
					nom,
					icone,
					ordre
			FROM type_repas
			WHERE 1 = 1` ;

	query += ` ORDER BY ordre` ;

	logConsole(viewLog, emoji, fichier + `/liste`,`query`,query);
	logConsole(viewLog, emoji, fichier + `/liste`,`params`,params);

	try {
		const res = await pool.query<RepasRow>(query,params) ;
		return res.rows ;

	} catch (err) {
		logConsole(viewLog, emoji, fichier + `/liste`, `Erreur lors de la lecture des données`, err);
		throw err ;
	} 
}

/**
 * Remonte la liste des repas par rappot à une liste d`identifiant
 * @param ids 
 * @returns Les lignes de repas
 */
export async function listeParIds(ids: number[]): Promise<RepasRow[]> {

	logConsole(viewLog, emoji, fichier + `/listeParIds`, `ids`, ids);
	
	if (!ids.length) return [];	

	let query : string ;
	
	const placeholders = ids.map((_,i) => `$${i+1}`).join(`, `);

	query = `
		SELECT 	id,
					nom,
					icone,
					ordre
		FROM type_repas
		WHERE id IN (${placeholders})`
	
	try {
		const res = await pool.query<RepasRow>(query,ids) ;			 
		return res.rows ;

	} catch (err) {
		logConsole(viewLog, emoji, fichier + `/listeParIds`, `Erreur lors la récupération des repas par ID`, err);
		throw err ;	
	} 
}

/**
 * Permet d`ajouter un type de repas
 * @param repas - Donnée du type de repas
 * @returns - Identifiant du type de repas
 */
export async function ajouter (repas : RepasDataRow) : Promise<number | undefined> {


	let params : (string | number)[];

    let query = `
	 	INSERT INTO type_repas (
			nom,
			icone,
			ordre)
		VALUES ($1, $2, $3)
		RETURNING id` ;

	params = [repas.nom.trim(),repas.icone.trim(),repas.ordre];

	logConsole(viewLog, emoji, fichier + `/liste`,`query`,query);
	logConsole(viewLog, emoji, fichier + `/liste`,`params`,params);

	try {
		const res = await pool.query<{id : number}> (query,params);
		return res.rows[0].id;

	} catch (err) {
		logConsole(viewLog, emoji, fichier + `/ajouter`, `Erreur lors de l\`ajout.`, err);
		throw err ;
	} 
}

/**
 * Permet de modifier un type de repas
 * @param categorie - Type de repas à modifier
 * @returns - Le type de repas modifié
 */
export async function modifier (id : number , repas : RepasDataRow) : Promise <RepasRow | null> {

	logConsole(viewLog, emoji, fichier + `/Modifier`,`id`,id) ;

   let query = `
		UPDATE type_repas SET 
			nom = $1, 
			icone = $2,
			ordre = $3
		WHERE id = $4
		RETURNING *`;
	
	const params = [
		repas.nom.trim(),
		repas.icone.trim(),
		repas.ordre,
		id] ;

	logConsole(viewLog, emoji, fichier + `/Modifier`,`query`,query) ;
	logConsole(viewLog, emoji, fichier + `/Modifier`,`params`,params) ;

	try {
		const res = await pool.query (query,params);

		if (!res.rows.length || res.rowCount === 0) {
			return null ;
		};

		logConsole(viewLog, emoji, fichier + `/modifier`,`row`,res.rows[0]);
		return res.rows[0];

	} catch (err) {
		logConsole(viewLog, emoji, fichier + `/modifier`, `Erreur lors modification`, err);
		throw err ;
	} 
}

export async function supprimer (id : number) : Promise<number> {
	try {

		const res = await pool.query (`DELETE FROM type_repas WHERE id = $1`,[id]);
		return res.rowCount|| 0 ;

	} catch (err) {
		logConsole(viewLog, emoji, fichier + `/supprimer`, `Erreur lors modification`, err);
		throw err ;
	} 
}