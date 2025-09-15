import { logConsole } from "@lpp/communs";

const viewlog = false;
const emoji = "";
const fichier = "httpClient";

export interface HttpResponse<T> {
  status: number;
  data?: T;
}

// utils/httpClient.ts
export async function httpGet<T>(url: string): Promise<T> {
	logConsole (viewlog, emoji,fichier + 'httpGet','Début',""); 
	logConsole (viewlog, emoji,fichier + 'httpGet','URL',url	); 

  const response = await fetch(url);
  if (!response.ok) {
	 throw new Error(`GET ${url} failed: ${response.status}`);
  }
  return response.json();
}

export async function httpPost<T, U>(url: string, data: U): Promise<T> {
  const response = await fetch(url, {
	 method: 'POST',
	 headers: { 'Content-Type': 'application/json' },
	 body: JSON.stringify(data)
  });

  if (!response.ok) {
	 let errorMessage = `POST ${url} failed: ${response.status}`;
	 let errorData;

	 try {
		errorData = await response.json(); // on attend la résolution du JSON
		errorMessage = errorData.message || errorMessage;
	 } catch (err ) {
		// Pas de JSON, on garde le message générique
	 }

	 const error = new Error(errorMessage);
	 (error as any).status = response.status;
	 (error as any).data = errorData;

	 throw error;
  }

	
  return response.json();
}

  export async function httpPut<T, U>(url: string, data: U): Promise<T> {
  const response = await fetch(url, {
	 method: 'PUT',
	 headers: { 'Content-Type': 'application/json' },
	 body: JSON.stringify(data)
  });

	logConsole (viewlog, emoji,fichier +  "httpPut", "Début", "");
	  
	// On lit le JSON UNE fois et on le stocke
	let responseData;
	try {
		responseData = await response.json();
	} catch {
		responseData = null; // cas où la réponse n'est pas un JSON valide
	}

	// Traces utiles, responseData est déjà un objet ou null
	logConsole (viewlog, emoji,fichier +  "httpPut", "- Réponse", responseData);

		if (!response.ok) {

			logConsole (viewlog, emoji,fichier +  "httpPut", "- Réponse KO ", "");

			let errorMessage = `PUT ${url} failed: ${response.status}`;
			if (responseData && typeof responseData === 'object' ) {
				errorMessage = responseData.message ?? responseData.Erreur ?? errorMessage;
				logConsole (viewlog, emoji,fichier +  "httpPut", "- Message attendu ", errorMessage);
			}

			const error = new Error(errorMessage);
			(error as any).status = response.status;
			(error as any).data = responseData;

			throw error;
		}

  return responseData;
}

export async function httpDelete<T>(url: string): Promise<HttpResponse<T>> {
  const response = await fetch(url, {
	 method: 'DELETE'
  });
	
	
	logConsole (viewlog, emoji,fichier +  "httpDelete", "Début", "");
	  
	// On lit le JSON UNE fois et on le stocke
  	let responseData;
  	try {
		responseData = await response.json();
  	} catch {
		responseData = null; // cas où la réponse n'est pas un JSON valide
	}
	
	// Traces utiles, responseData est déjà un objet ou null
	logConsole (viewlog, emoji,fichier +  "httpDelete", "- Réponse", responseData);
	logConsole (viewlog, emoji,fichier +  "httpDelete", "- Statut", response.status);
	
	if (!response.ok) {
			
			logConsole (viewlog, emoji,fichier +  "httpDelete", "- Réponse KO ", "");

			let errorMessage = `DELETE ${url} failed: ${response.status}`;
			if (responseData && typeof responseData === 'object' ) {
				errorMessage = responseData.message ?? responseData.Erreur ?? errorMessage;
				logConsole (viewlog, emoji,fichier +  "httpPut", "- Message attendu ", errorMessage);
			}

			const error = new Error(errorMessage);
			(error as any).status = response.status;
			(error as any).data = responseData;

			throw error;
  	} 

	logConsole (viewlog, emoji,fichier +  "httpDelete", "- Réponse OK ", "");

	return {
			status: response.status,
			data: responseData
	};
}

