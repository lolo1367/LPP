

export function logConsole(
	needLog: boolean,
	emoji: string,
	module: string,
	prompt: string,
	valeur: any) {
	
	if (!needLog) return;

	let message = `${emoji} [${module}] -- ${prompt} : `;

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

