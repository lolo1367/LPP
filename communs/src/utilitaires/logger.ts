export function log (projet: string, fichier: string , fonction: string , prompt: string , valeur: any ) {

   let message = `[${projet}] [${fichier}], [Fonction : ${fonction}], - ${prompt} : `;
   if (typeof valeur === 'object') {
      try {
         message += JSON.stringify(valeur, null, 2);
      } catch {
         message += String(valeur);
      }
   } else {
      message += String(valeur);
   }
   console.log(message);
}
  


export function logErreur (projet: string, fichier: string , fonction: string , prompt: string , valeur: any ) { 

   let message = `[${projet} (e)] [${fichier}] / [Fonction : ${fonction}] , - ${prompt} : `;
   if (typeof valeur === 'object') {
      try {
         message += JSON.stringify(valeur, null, 2);
      }	catch {
         message += String(valeur);
      }
   } else {
      message += String(valeur);
   }
   console.log(message);
}

export function logInformation (projet: string, fichier: string , fonction: string , prompt: string , valeur: any ) { 

   let message = `[${projet} (i)] ${fichier}] / [Fonction : ${fonction}] , - ${prompt} : `;  
   if (typeof valeur === 'object') {
      try {
         message += JSON.stringify(valeur, null, 2);
      } catch {
         message += String(valeur);
      }
      } else {
         message += String(valeur);
      }
   console.log(message);
}

export function logDebut (projet: string, fichier: string , fonction: string ) { 

   let message = `[${projet} (e)] [${fichier}] / [Fonction : ${fonction}] ============ DEBUT =========== `;
   console.log(message);
}

export function logConsole(
	needLog: boolean,
	emoji: string,
	module: string,
	prompt: string,
	valeur: any) {

   let now = new Date();

   // Extrait l'heure, les minutes et les secondes
   let hours = String(now.getHours()).padStart(2, '0');
   let minutes = String(now.getMinutes()).padStart(2, '0');
   let seconds = String(now.getSeconds()).padStart(2, '0');
   
   // Construit la chaîne de l'heure au format HH:MM:SS
   let timeString = `${hours}:${minutes}:${seconds}`;
	
	if (!needLog) return;

	let message = `[${timeString}] - ${emoji} [${module}] - ${prompt} : `;

	if (typeof valeur === 'object') {
		try {
			message += JSON.stringify(valeur, null, 2);
		} catch {
			message += String(valeur);
		}
	} else {
		message += String(valeur);
	}
	console.log(message);
  }


