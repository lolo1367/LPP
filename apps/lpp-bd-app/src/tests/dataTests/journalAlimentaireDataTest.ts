import { LigneJournalAlimentaireRow } from '../../types/ligneJournalalimentaire';
import { UNITE_BASE } from '../../config';

export function lignesLundi(): LigneJournalAlimentaireRow[] {
  return [
    // 20 points
    { id: 1,uti_id:1, date: '2025-07-21', nombre_point: 5, aliment_id: 1, type_repas_id: 1, quantite: 2, unite: UNITE_BASE},
    { id: 2,uti_id:1, date: '2025-07-21', nombre_point: 10, aliment_id: 2, type_repas_id: 2,  quantite: 6, unite: UNITE_BASE},
    { id: 3,uti_id:1, date: '2025-07-21', nombre_point: 5, aliment_id: 3, type_repas_id: 3,  quantite: 5, unite: UNITE_BASE},
  ];
}

export function lignesMardi(): LigneJournalAlimentaireRow[] {
  return [
    // 27 points (-2)
    { id: 1,uti_id:1, date: '2025-07-22', nombre_point: 12, aliment_id: 4, type_repas_id: 1, quantite:  1 , unite: UNITE_BASE},
    { id: 2,uti_id:1, date: '2025-07-22', nombre_point: 15, aliment_id: 5, type_repas_id: 2, quantite: 1 , unite: UNITE_BASE},
  ];
}

export function lignesMercredi (): LigneJournalAlimentaireRow[] {
  return [
    // 37 points (-12)
    { id: 1,uti_id:1, date: '2025-07-23', nombre_point: 10, aliment_id: 4, type_repas_id: 1, quantite:  6 , unite: UNITE_BASE},
    { id: 2,uti_id:1, date: '2025-07-23', nombre_point: 12, aliment_id: 4, type_repas_id: 1, quantite:  1 , unite: UNITE_BASE},
    { id: 3,uti_id:1, date: '2025-07-23', nombre_point: 15, aliment_id: 5, type_repas_id: 2, quantite: 1, unite: UNITE_BASE},
  ];
}

export function lignesJeudi (): LigneJournalAlimentaireRow[] {
  return [
    // 30 points (-5)
    {
      id: 1,uti_id:1, date: '2025-07-24', nombre_point: 3, aliment_id: 4, type_repas_id: 1, quantite: 6, unite: UNITE_BASE},
    { id: 2,uti_id:1, date: '2025-07-24', nombre_point: 12, aliment_id: 4, type_repas_id: 1, quantite:  1 , unite: UNITE_BASE},
    { id: 3,uti_id:1, date: '2025-07-24', nombre_point: 15, aliment_id: 5, type_repas_id: 2, quantite: 1, unite: UNITE_BASE},
  ];
}

export function lignesVendredi (): LigneJournalAlimentaireRow[] {
  return [
    // 40 points (-15)
    { id: 1,uti_id:1, date: '2025-07-25', nombre_point: 10, aliment_id: 4, type_repas_id: 1, quantite:  6 , unite: UNITE_BASE},
    { id: 2,uti_id:1, date: '2025-07-25', nombre_point:  2, aliment_id: 4, type_repas_id: 1, quantite:  1 , unite: UNITE_BASE},
    { id: 3,uti_id:1, date: '2025-07-25', nombre_point: 12, aliment_id: 4, type_repas_id: 1, quantite:  1 , unite: UNITE_BASE},
    { id: 4,uti_id:1, date: '2025-07-25', nombre_point: 12, aliment_id: 4, type_repas_id: 1, quantite:  1 , unite: UNITE_BASE},
    { id: 5,uti_id:1, date: '2025-07-25', nombre_point:  4, aliment_id: 5, type_repas_id: 2, quantite:  1 , unite: UNITE_BASE}
  ];
}

export function lignesSamedi (): LigneJournalAlimentaireRow[] {
  return [
    // 28 points (-3)
    { id: 1,uti_id:1, date: '2025-07-26', nombre_point: 10, aliment_id: 4, type_repas_id: 1, quantite:  6 , unite: UNITE_BASE},
    { id: 2,uti_id:1, date: '2025-07-26', nombre_point:  2, aliment_id: 4, type_repas_id: 1, quantite:  1 , unite: UNITE_BASE},
    { id: 3,uti_id:1, date: '2025-07-26', nombre_point:  6, aliment_id: 4, type_repas_id: 1, quantite:  1 , unite: UNITE_BASE},
    { id: 4,uti_id:1, date: '2025-07-26', nombre_point:  8, aliment_id: 4, type_repas_id: 1, quantite:  1 , unite: UNITE_BASE},
    { id: 5,uti_id:1, date: '2025-07-26', nombre_point:  2, aliment_id: 5, type_repas_id: 2, quantite:  1 , unite: UNITE_BASE}
  ];
}

export function lignesDimanche (): LigneJournalAlimentaireRow[] {
  return [
    // 15 points (0)
    { id: 1,uti_id:1, date: '2025-07-27', nombre_point: 10, aliment_id: 4, type_repas_id: 1, quantite:  6 , unite: UNITE_BASE},
    { id: 2,uti_id:1, date: '2025-07-27', nombre_point:  2, aliment_id: 4, type_repas_id: 1, quantite:  1 , unite: UNITE_BASE},
    { id: 3,uti_id:1, date: '2025-07-27', nombre_point:  3, aliment_id: 5, type_repas_id: 2, quantite:  1 , unite: UNITE_BASE},
  ];
}