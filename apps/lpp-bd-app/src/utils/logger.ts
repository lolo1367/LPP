import path from "path";
import * as Logger from '@ww/reference';

export function trace(fullPath: string, fonction: string, prompt: string, valeur: any) {
	const fichier = path.basename(fullPath);
	Logger.log('bd-app', fichier, fonction, prompt, valeur);
  }

export function traceErreur (fullPath : string , fonction : string , prompt : string , valeur : any ) {
	const fichier = path.basename(fullPath) ;
	Logger.logErreur('bd-app', fichier, fonction, prompt, valeur);
}

export function traceInformation (fullPath : string , fonction : string , prompt : string , valeur : any ) {
   const fichier = path.basename(fullPath) ;
	Logger.logInformation('bd-app', fichier, fonction, prompt, valeur);
}

export function traceDebut (fullPath : string , fonction : string ) {
   const fichier = path.basename(fullPath) ;
	Logger.logDebut('bd-app', fichier, fonction);
}


