import { boolean } from "zod";

/**
 * Donnée d'une ligne du journal alimentaire
 */
export interface LigneJournalAlimentaireDataRow {
   /**
    * Utilisateru
    */
   uti_id: number;
   /**
    * Date de la ligne alimentaire
    */
  date: string ; // Attention le format doit être "AAAA-MM-JJ"				
  /**
   * Identifiant du type de repas
   */	
  type_repas_id: number ;
  /**
   * Identifiant de l'aliment
   */
  aliment_id: number ;
  /**
   * Quantite
   */
  quantite: number ;
  /**
   * Nombre de points de la ligne
   */
   nombre_point: number;
   /**
    * Unite
    */
   unite: string 
};

export interface LigneJournalAlimentaireRow extends LigneJournalAlimentaireDataRow {
   /**
    * Identifiant technique de la ligne
    */
   id: number
   
}

export interface LigneJournalAlimentaireDataCompletRow extends LigneJournalAlimentaireRow {
   id: number;
   aliment_nom: string;
   aliment_quantite: number;
   aliment_unite: string;
   aliment_points: number;
   aliment_categorie_id: number;
   aliment_calories: number;
   aliment_fibres: number;
   aliment_proteines: number;
   aliment_matieres_grasses: number;
   aliment_acide_gras_sature: number;
   aliment_glucides: number;
   aliment_sel: number;
   aliment_sucres: number;
   aliment_grammes: number;
   aliment_zero_point : boolean,
   categorie_id: number;
   categorie_nom: string;
   type_repas_nom: string;
   type_repas_icone: string;
   type_repas_ordre: number;
}

export interface IdAlimentRecent {
   /**
    * utilisateur
    */
   uti_id: number;
   /**
    * id aliment
    */
   aliment_id : number ;
   /**
    * Identifiant technique de la catégorie
    */
   repas_id: number;
   /**
    * Date
    */
   date: Date;
}