import { z } from 'zod';
import { ligneJournalPoidsDataSchema } from '../schemas/journalPoidsSchema';

type Prettify<T> = {
  [K in keyof T]: T[K];
};

export type LigneJournalPoidsData = z.infer<typeof ligneJournalPoidsDataSchema>;
export type LigneJournalPoids = LigneJournalPoidsData & {
  id: number;
};

