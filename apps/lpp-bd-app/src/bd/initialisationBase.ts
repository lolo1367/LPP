import pool from "./db";
import { importerAlimentsDepuisCsv } from "./initAliment";  // Initialisation des aliments
import { initCategorie }  from './initCategorie';  // Initialisation des catégories
import {initTypeRepas }  from  './initTypeRepas' ;
import { initUnite } from "./initUnite";
import 'dotenv/config';
import { logConsole } from "@lpp/communs";

async function initialisationBase () {

    console.log('-------------------------------------------------------');
    console.log('INITIALISATION DE LA BASE                              ');
	console.log('-------------------------------------------------------');
	
	console.log("DATABASE_URL =", JSON.stringify(process.env.DATABASE_URL));	
	const { rows } = await pool.query('select now()');
	console.log('Connexion OK :', rows[0]);

	
	await initCategorie();
	await initTypeRepas();
	await initUnite();


	// Ouvre la base de données

	try {

		await importerAlimentsDepuisCsv('./src/bd/AlimentZeroPoint.csv');
		console.log ('Aliments importés avec succès.');
		
		const utilisateurs = [
			{
				nom: 'BAILLET',
				prenom: 'Laurence',
				email: 'lcbaillet@hotmail.com',
				sexe: 'F',
				mdp: '$2b$12$rpyzTvq49Nxdgn/iNgoKTOySwRIYLxkFpq4tzlGCo2OkYITR.f0mi',
				taille: 170,
				point_bonus: 35,
				point_jour: 25	
			},
		];  

		for (const util of utilisateurs) {
			await pool.query('INSERT INTO utilisateur (nom,prenom,email,sexe,mdp,taille,point_bonus, point_jour) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
				[util.nom,
				util.prenom,
				util.email,
				util.sexe,
				util.mdp,
				util.taille,
				util.point_bonus,
				util.point_jour]);
		}
		console.log ('Utilisateurs initialisés avec succès.');
	}

	catch (err) {
		console.log ('Erreur lors de l\'initialisation  : ',err);
	}
	
}

initialisationBase() ;