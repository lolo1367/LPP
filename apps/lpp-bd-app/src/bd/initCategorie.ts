
import pool from "./db";
import { logConsole } from "@lpp/communs";

pool.on('connect', () => {
   logConsole(true,"","db.ts","Connecté à la base PostgreSQL","");
 });
 
 pool.on('error', (err) => {
   logConsole(true,"","db.ts",`Erreur pool PostgreSQL :`,err.message);
 });

// Fonction pour insérer des catégories par défaut
export async function initCategorie() {
   
   console.log("DATABASE_URL =", JSON.stringify(process.env.DATABASE_URL));	

   try {
      const categories = [
         { id: 1, nom: 'Soupe'},
         { id: 2, nom: 'Entrée'},
         { id: 3, nom: 'Charcuterie'},
         { id: 4, nom: 'Viande'},
         { id: 5, nom: 'Poisson'},
         { id: 6, nom: 'Patisserie, Dessert'},
         { id: 7, nom: 'Fruit'} ,
         { id: 8, nom: 'Légumes'}, 
         { id: 9, nom: 'Boisson non alcoolisées'},
         { id: 10, nom: 'Boisson alcoolisées'},
         { id: 11, nom: 'Laitages'},
         { id: 12, nom: 'Oeufs'},
         { id: 13, nom: 'Matières grasses' },
         { id: 14, nom: 'Féculents' },
         { id: 15, nom: 'Sauce' },
         { id: 16, nom: 'Soja, végétariens' },
         { id: 17, nom: 'Pain,pain grillé et biscottes' },
         { id: 18, nom: 'Petits déjeuners et collations' },
         { id: 19, nom: 'Fromage' },
         { id: 20, nom: 'Plat cuisiné  ' },



      ];

      for (const categorie of categories) {
         await pool.query ('INSERT INTO categorie (id, nom) VALUES ($1 ,$2) ON CONFLICT (id) DO NOTHING',[categorie.id,categorie.nom]) ;
         }	
      console.log ('Catégories initialisées avec succès.');
   }

   catch (err) {
      console.log ('Erreur lors de l\'initialisation des catégories : ',err);
   }

}

