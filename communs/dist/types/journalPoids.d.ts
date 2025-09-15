import { z } from 'zod';
import { ligneJournalPoidsDataSchema } from '../schemas/journalPoidsSchema';
export type LigneJournalPoidsData = z.infer<typeof ligneJournalPoidsDataSchema>;
export type LigneJournalPoids = LigneJournalPoidsData & {
    id: number;
};
