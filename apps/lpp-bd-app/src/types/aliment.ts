import { int } from "zod";

   export interface AlimentDataRow {
      /**
       * Nom de l'aliment
       */
      nom : string ;
      /**
       * Identifiant technique de la catégorie
       */
      categorie_id : number ;
      /**
       * Quantie
       */
      quantite: number  ;
      /**
       * Unite
       */
      unite : string ;
      /**
       * Points
       */
      points: number;
      /**
       * Calories
       */
      calories: number | null;
      /**
       * Fibres
       */
      fibres: number | null;
      /**
       * Protéines
       */
      proteines: number | null,
      /**
       * Acides gras saturés
       */
      matieres_grasses: number | null;
      /**
       * Acides gras non saturés
       */
      acide_gras_sature: number | null;
      /**
       * Glucides
       */
      glucides: number | null;
      /**
       * Sucres
       */
      sucres: number | null;
      /**
       * Sel
       */
      sel: number | null;
      /** 
       * Indicateur 0 point
       */
      zero_point: boolean;
   }

   export interface UpdateAlimentRow extends AlimentDataRow {
      /**
       * Identifiant technique de l'aliment
       */
      id : number ;
   }

   export interface AlimentRow extends AlimentDataRow {
      /**
       * Identifiant technique
       */
      id : number;
      /**
       * Libellé catégorie
       */
      categorie : string;
}
   

export interface AlimentRecentRow extends AlimentRow {
   date: string;
}