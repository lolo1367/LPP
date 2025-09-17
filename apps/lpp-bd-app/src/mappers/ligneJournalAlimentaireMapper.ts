import { LigneJournalAlimentaireDataSimple , LigneJournalAlimentaireDataComplet} from '@lpp/communs';
import { LigneJournalAlimentaireDataRow, LigneJournalAlimentaireDataCompletRow } from '../types/ligneJournalalimentaire';
import { format } from "date-fns";

// Transforme un objet "JournalAlimentaire" du frontend vers un format DB
export function mapFromApi (ligne : LigneJournalAlimentaireDataSimple) : LigneJournalAlimentaireDataRow {
  return {
    uti_id:ligne.uti,
    date: ligne.date,
    aliment_id: ligne.alimentId,
    quantite: ligne.quantite,
    type_repas_id: ligne.typeRepasId,
    nombre_point: ligne.points,
    unite: ligne.unite
  };
}

export function mapFromBd(row: LigneJournalAlimentaireDataCompletRow): LigneJournalAlimentaireDataComplet {
  return {
    id: row.id,
    uti_id: row.uti_id,
    date: row.date,
    aliment: {
      id: row.aliment_id,
      nom: row.aliment_nom,
      unite: row.aliment_unite,
      quantite: row.aliment_quantite,
      points: row.aliment_points,
      categorie: {
        id: row.categorie_id,
        nom: row.categorie_nom
      },
      calories: row.aliment_calories,
      glucides: row.aliment_glucides,
      fibres: row.aliment_fibres,
      matieresGrasses: row.aliment_matieres_grasses,
      acideGrasSature: row.aliment_acide_gras_sature,
      proteines: row.aliment_proteines,
      sel: row.aliment_sel,
      sucres: row.aliment_sucres,
      grammes: row.aliment_grammes,
      zeroPoint: row.aliment_zero_point
    },
    repas: {
      id: row.type_repas_id,
      icone: row.type_repas_icone,
      nom: row.type_repas_nom,
      ordre: row.type_repas_ordre
    },
    quantite: row.quantite,
    points: row.nombre_point,
    unite: row.unite

  }
}
