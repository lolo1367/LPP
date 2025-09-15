import { z } from 'zod';
import { suiviHebdoDataSchema } from '../schemas/suiviHebdoSchema';
export type SuiviHebdoData = z.infer<typeof suiviHebdoDataSchema>;
export type SuiviHebdo = SuiviHebdoData & {
    id: number;
};
