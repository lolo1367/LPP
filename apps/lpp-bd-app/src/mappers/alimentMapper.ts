import type { Aliment, AlimentRecent } from  '@ww/reference';
import { AlimentDataRow, AlimentRow, AlimentRecentRow } from '../types/aliment';
import { alimentDataSchema } from '@ww/reference';
import { z } from 'zod' ;

// Transforme un résultat SQL en objet "Aliment" pour le frontend
export function mapFromDb(row : AlimentRow) : Aliment {
   return {
      id: row.id,
      nom: row.nom,
      quantite: row.quantite,
      unite: row.unite,
      points: row.points,
      categorie: {
         id: row.categorie_id,
         nom: row.categorie
      },
      calories: row.calories,
      fibres: row.fibres,
      matieresGrasses: row.acide_gras_sature,
      acideGrasSature: row.matieres_grasses,
      glucides: row.glucides,
      proteines: row.proteines,
      sucres: row.sucres,
      sel: row.sel,
      zeroPoint: row.zero_point

   };
}

export function mapAlimentRecentFromDb(row : AlimentRecentRow) : AlimentRecent {
   return {
      aliment: {
         id: row.id,
         nom: row.nom,
         quantite: row.quantite,
         unite: row.unite,
         points: row.points,
         categorie: {
            id: row.categorie_id,
            nom: row.categorie
         },
         calories: row.calories,
         fibres: row.fibres,
         matieresGrasses: row.acide_gras_sature,
         acideGrasSature: row.matieres_grasses,
         glucides: row.glucides,
         proteines: row.proteines,
         sucres: row.sucres,
         sel: row.sel,
         zeroPoint: row.zero_point
      },
      date: row.date
   };
}

export function mapFromApi (apiData : unknown) : AlimentDataRow {
   const parsed = alimentDataSchema.parse(apiData);
   return {
      nom :parsed.nom,
      quantite: parsed.quantite,
      unite: parsed.unite,
      points : parsed.points,
      categorie_id: parsed.categorie.id,
      calories: parsed.calories,
      proteines: parsed.proteines,
      glucides: parsed.glucides,
      fibres: parsed.fibres,
      acide_gras_sature: parsed.matieresGrasses,
      matieres_grasses: parsed.acideGrasSature,
      sucres: parsed.sucres,
      sel: parsed.sel,
      zero_point: parsed.zeroPoint

   } ;
}
