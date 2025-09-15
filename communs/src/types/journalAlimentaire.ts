import { z } from 'zod';
import {
  ligneJournalAlimentaireDataSimpleSchema,
  ligneJournalAlimentaireDataCompletSchema,
  ligneJournalAlimentaireSimpleSchema,
  ligneJournalAlimentaireCompletSchema
  
 } from '../schemas/journalAlimentaireSchema';


export type LigneJournalAlimentaireDataSimple = z.infer<typeof ligneJournalAlimentaireDataSimpleSchema>; // Attention date est de type "string"
export type LigneJournalAlimentaireSimple = z.infer<typeof ligneJournalAlimentaireSimpleSchema>;

export type LigneJournalAlimentaireDataComplet = z.infer<typeof ligneJournalAlimentaireDataCompletSchema>; // Attention date est de type "string"
export type LigneJournalAlimentaireComplet = z.infer<typeof ligneJournalAlimentaireCompletSchema>;
