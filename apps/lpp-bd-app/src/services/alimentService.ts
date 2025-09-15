// import { promises } from "dns";
import { AlimentRow, AlimentDataRow} from "../types/aliment" ;
import pool from '../bd/db' ;
import { logConsole } from "@ww/reference";

// ==================================================
// Constant pour les logs
//===================================================
const viewLog: boolean = true;
const emoji = "​";
const fichier: string  = "alimentService";

/**
 * Remonte la liste des aliments. Elle peut être filtrée
 * @param nom - Filtre sur toute ou partie du nom
 * @param categorieId - Filtre sur la catégorie de l`aliment. On passe ici l`identifiant de la catégorie
 * @returns - les lignes d`aliment`
 */
export async function liste (nom ? : string, categorieId ? : number) : Promise<AlimentRow[]>{ 

	logConsole(viewLog, emoji, fichier + `/liste`,`nom`,nom);
	logConsole(viewLog, emoji, fichier + `/liste`,`categorie_id`,categorieId);


	let query : string ;
  	let params : (string | number )[]= [];

	query =`
		SELECT	aliment.id, 
					aliment.nom,  
					aliment.points, 
					aliment.quantite,
					aliment.unite,
					aliment.calories,
          		aliment.fibres,
          		aliment.proteines,
         		aliment.matieres_grasses,
          		aliment.acide_gras_sature,
          		aliment.glucides,
					aliment.sucres,
					aliment.sel,
					categorie.id AS categorie_id,
					categorie.nom AS categorie,
					aliment.zero_point
		FROM aliment
			LEFT JOIN categorie ON aliment.categorie_id = categorie.id 
			WHERE 1 = 1`;

	if (nom) {
		params.push (`%${nom.toLowerCase()}%`);
		query += ` AND LOWER(aliment.nom) LIKE $${params.length}` ;
	}

	if (categorieId) {
		params.push (categorieId);
		query += ` AND aliment.categorie_id = $${params.length}` ;
	}

	query += ` ORDER BY aliment.nom` ;

	logConsole(viewLog, emoji, fichier + `/liste`,`query`,query);
  	logConsole(viewLog, emoji, fichier + `/liste`,`params`,params);
	
	try {

	
		const res = await pool.query<AlimentRow> (query,params) ;			 
		return res.rows ;

	} catch (err) {
 		logConsole(viewLog, emoji, fichier + `/liste`, `❌ Erreur lors récupération des aliments`, err);
 		throw err ;
	}
}

/**
 * Remonte la liste des aliments par rappot à une liste d`identifiant
 * @param ids 
 * @returns Les lignes d`aliment
 */
export async function listeParIds(ids: number[]): Promise<AlimentRow[]> {

logConsole(viewLog, emoji, fichier + `/listeParIds`, `ids`, ids);
	
	if (!ids.length) return [];
	

	let query : string ;
	const placeholders = ids.map((_,i) => `$${i+1}`).join(`, `);

	query = `
		SELECT	aliment.id, 
					aliment.nom,  
					aliment.points, 
					aliment.quantite,
					aliment.unite,
					aliment.calories,
          		aliment.fibres,
          		aliment.proteines,
         		aliment.matieres_grasses,
          		aliment.acide_gras_sature,
          		aliment.glucides,
					aliment.sucres,
					aliment.sel,
					categorie.id AS categorie_id,
					categorie.nom AS categorie,
					aliment.zero_point
		FROM aliment
			LEFT JOIN categorie ON aliment.categorie_id = categorie.id 
		WHERE aliment.id IN (${placeholders})`
	
	logConsole(viewLog, emoji, module + '/listeById', 'query', query);
	
	try {
	
		const res = await pool.query<AlimentRow>(query,ids);	
		return res.rows ;

	} catch (err) {
 		logConsole(viewLog, emoji, fichier + `/listeParIds`, `Erreur lors la récupération des aliments par ID`, err);
 		throw err ;	
	} 
}


/**
 * Permet d`ajouter un aliment 
 * @param aliment - Donnée de l`aliment
 * @returns - Identifiant de l`aliment ajouté
 */
export async function ajouter (aliment : AlimentDataRow) : Promise<number | undefined> {


	let params : (string | number | boolean | null)[];		 
	let query = `
			INSERT INTO aliment (
		  		id,
				nom,
				points,
				quantite,
				unite,
				calories,
				fibres,
				proteines,
				matieres_grasses,
				acide_gras_sature,
				glucides,
				sucres,
				sel,
				categorie_id,
				zero_point)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
			RETURNING id
			`;
	
	try {

		// Calculer le prochain ID
		const res = await pool.query<{ maxid: number }>(`SELECT MAX(id) + 1 AS maxid FROM aliment`);
		const id = res.rows[0].maxid ?? 1; // si table vide, commencer à 1

		logConsole(viewLog, emoji, fichier + `/ajouter`,`maxId`,id);
		
		params = [
			id,
			aliment.nom.trim(),
			aliment.points,
			aliment.quantite,
			aliment.unite.trim(),
			aliment.calories,
			aliment.fibres,
			aliment.proteines,
			aliment.matieres_grasses,
			aliment.acide_gras_sature,
			aliment.glucides,
			aliment.sucres,
			aliment.sel,
			aliment.categorie_id,
			aliment.zero_point];

		logConsole(viewLog, emoji, fichier + `/ajouter`,`query`,query);
  		logConsole(viewLog, emoji, fichier + `/ajouter`,`params`,params);

		const resultat = await pool.query<{ id: number }>(query,params);
		return resultat.rows[0].id;

	} catch (err) {	
 		logConsole(viewLog, emoji, fichier + `/ajouter`, `❌ Erreur lors modification`, err);
		throw err ;
	} 
}

/**
 * Permet de modifier un aliment
 * @param aliment - Aliment à modifier
 * @returns - L`aliment modifié
 */
export async function modifier (id : number , aliment : AlimentDataRow) : Promise <AlimentRow | null> {

	logConsole(viewLog, emoji, fichier + `/Modifier`,`id`,id) ;

	let query = `
	 	UPDATE aliment SET 
			nom = $1, 
			points = $2, 
			quantite = $3,
			unite = $4, 
			calories = $5,
			fibres = $6,
			proteines = $7,
			matieres_grasses = $8,
			acide_gras_sature = $9,
			glucides = $10,
			sucres = $11,
			sel = $12,
			categorie_id= $13,
			zero_point=$14
		WHERE id = $15
		RETURNING * ;`;

	const params = [
		aliment.nom.trim(),
		aliment.points,
		aliment.quantite,
		aliment.unite.trim(),
		aliment.calories,
		aliment.fibres,
		aliment.proteines,
		aliment.matieres_grasses,
		aliment.acide_gras_sature,
		aliment.glucides,		
		aliment.sucres,
		aliment.sel,
		aliment.categorie_id,
		aliment.zero_point,
		id];

   logConsole(viewLog, emoji, fichier + `/Modifier`,`query`,query) ;
   logConsole(viewLog, emoji, fichier + `/Modifier`,`params`,params) ;

	try {
		
		const res = await pool.query<AlimentRow>(query, params);

		if (!res.rows.length) {
			logConsole(viewLog, emoji, fichier + `/modifier`,"Pas de ligne modifiée","");
			return null;
		}
	 
		query = `
		SELECT	aliment.id, 
					aliment.nom,  
					aliment.points, 
					aliment.quantite,
					aliment.unite,
					aliment.calories,
          		aliment.fibres,
          		aliment.proteines,
         		aliment.matieres_grasses,
          		aliment.acide_gras_sature,
          		aliment.glucides,
					aliment.sucres,
					aliment.sel,
					categorie.id AS categorie_id,
					categorie.nom AS categorie,
					aliment.zero_point
			FROM aliment
				LEFT JOIN categorie ON aliment.categorie_id = categorie.id 
			WHERE aliment.id = $1;`;
		
		logConsole(viewLog, emoji, fichier + `/modifier`,`query select`,query);
		logConsole(viewLog, emoji, fichier + `/modifier`,`id`,id);

		const resultat = await pool.query<AlimentRow>(query,[id]);

		logConsole(viewLog, emoji, fichier + `/modifier`, `row`, resultat.rows);
		
		if (!resultat.rows.length) {
			return null;
		} else {
			return resultat.rows[0];
		}

	} catch (err) {
		logConsole(viewLog, emoji, fichier + `/modifier`, `❌ Erreur lors modification`, err);
		throw err ;
	} 
}

export async function supprimer (id : number) : Promise<number> {



	try {
		const res = await pool.query (`DELETE FROM aliment WHERE id = $1`,[id]);
		return res.rowCount  || 0;

	} catch (err) {
 		logConsole(viewLog, emoji, fichier + `/supprimer`, `❌ Erreur lors modification`, err);
		throw err ;
	} 
}
