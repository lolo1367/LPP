import { LigneJournalPoidsData } from '@lpp/communs';
import { LigneJournalPoidsDataRow } from '../types/ligneJournalPoids';
import { format } from "date-fns";

// Transforme un objet "JournalPoids" du frontend vers un format DB
export function mapFromApi (ligne : LigneJournalPoidsData) : LigneJournalPoidsDataRow {
  return {
    uti_id: ligne.uti_id,
    date: ligne.date ,
    poids: ligne.poids
  };
}