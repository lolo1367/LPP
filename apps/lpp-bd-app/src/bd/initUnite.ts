
import pool from "./db";

// Fonction pour insérer des unités par défaut
export async function initUnite () {

   try {
      const unite = [
         { nom: 'g'},
         { nom: 'CS'},
         { nom: 'cc'},
         { nom: 'ml'},
         { nom: 'verre' },
         { nom: 'part' },
         { nom: 'portion' },
         { nom: 'pièce(s)' },
         { nom: 'tranche(s)' },
         { nom: 'boite'}
      ]
      for (const value of unite) {
         await pool.query ('INSERT INTO unite (unite) VALUES ($1)',[value.nom]) ;
         }	
      console.log ('Unités initialisées avec succès.');
   }

   catch (err) {
      console.log ('Erreur lors de l\'initialisation des unités : ',err);

   }
}

