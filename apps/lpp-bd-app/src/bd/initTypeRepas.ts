
import pool from "./db";

// Fonction pour insérer des catégories par défaut
export async function initTypeRepas () {

   try {
      const typesRepas = [
         { nom: 'Petit-déjeuner', icone: 'MdFreeBreakfast', ordre:1 },
         { nom: 'Déjeuner', icone: 'MdLunchDining', ordre: 2 },
         { nom: 'Collation', icone: 'MdEmojiFoodBeverage',ordre :3 },
         { nom: 'Dîner', icone: 'MdDinnerDining', ordre: 4 }
      ];  

      for (const typeRepas of typesRepas) {
         await pool.query ('INSERT INTO type_repas (nom,icone,ordre) VALUES ($1 , $2 , $3) ON CONFLICT (id) DO NOTHING ',[typeRepas.nom,typeRepas.icone,typeRepas.ordre]) ;
      }
      console.log ('Types de repas initialisés avec succès.');
   }

   catch (err) {
      console.log ('Erreur lors de l\'initialisation des types de repas : ',err);
   }
}