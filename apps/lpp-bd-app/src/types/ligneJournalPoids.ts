import { DateISO } from '@lpp/communs';

/**
 * Donnée d'une ligne du journal de poids
 */
export interface LigneJournalPoidsDataRow {
   /**
    * Utilisateur
    */
   uti_id: number;
   /**
    * Date de la ligne alimentaire
    */
  date: DateISO ;				
  /**
   * Poids
   */
  poids : number ;
};

export interface LigneJournalPoidsRow extends LigneJournalPoidsDataRow {
   /**
    * Identifiant technique de la ligne
    */
   id : number ;
}