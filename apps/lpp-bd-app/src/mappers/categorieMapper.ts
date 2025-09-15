import type {CategorieData, Categorie} from '@ww/reference';
import { CategorieDataRow, CategorieRow } from '../types/categorie';
import { categorieDataSchema } from '@ww/reference';
import { z } from 'zod' ;

// Transforme un résultat SQL en objet "Categorie" pour le frontend
export function mapFromDb(row : CategorieRow) : Categorie {
   return {
      id: row.id,
      nom: row.nom
   } ;
}

export function mapFromApi (apiData : unknown) : CategorieDataRow {
   const parsed = categorieDataSchema.parse(apiData);
   return {
      nom :parsed.nom
   } ;
}