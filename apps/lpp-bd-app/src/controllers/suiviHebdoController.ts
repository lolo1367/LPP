import { Request, Response, NextFunction } from 'express';
import { suiviHebdoDataSchema, suiviHebdoFiltreSchemas } from "@ww/reference";
import * as Trace from "../utils/logger";

import * as SuiviHebdoService from '../services/suiviHebdoService';

export async function getSuiviHebdo(req: Request, res: Response, next: NextFunction) {
   try {

      console.log("[Module : Controller], [Objet : SuiviHebdo],[Fonction : getSuiviHebdo]");
      
      const parseResultQuery = suiviHebdoFiltreSchemas.safeParse(req.query);

      if (!parseResultQuery.success) {
         throw parseResultQuery.error;
      }

      let date: Date ;

      date = new Date(parseResultQuery.data.date);
      const uti_id: number = parseResultQuery.data.uti_id;
           
      const result = await SuiviHebdoService.liste(uti_id,date);
      res.json(result);

   } catch (err) {
      next(err);
   } 	
}
