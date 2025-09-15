import type { RepasData, Repas} from  '@ww/reference';
import { RepasDataRow, RepasRow } from '../types/repas';
import { repasDataSchema } from '@ww/reference';
import { z } from 'zod' ;


// Transforme un résultat SQL en objet "Repas" pour le frontend
export function mapFromDb(row: RepasRow) : Repas {
   return {
      id: row.id,
      nom: row.nom,
      icone: row.icone,
      ordre: row.ordre
   };
}

export function mapFromApi (apiData : unknown) : RepasDataRow {
   const parsed = repasDataSchema.parse(apiData);
   return {
      nom :parsed.nom,
      icone: parsed.icone,
      ordre:parsed.ordre
   } ;
}