// types/ErrorResponse.ts
export interface AppError {
   code: number;       // code HTTP
   message: string;    // message lisible
   details?: any;      // infos complémentaires, optionnelles
 }

 function normalizeError(error: any): AppError {
   // Si c’est une réponse Axios/fetch avec .response
   if (error.response) {
     const code = error.response.status;
     const data = error.response.data;
 
     // On essaie de trouver le message quelle que soit la structure
     let message = "Erreur inconnue";
 
     if (typeof data === "string") {
       message = data;
     } else if (data?.message) {
       message = data.message;
     } else if (data?.error) {
       message = data.error;
     }
 
     return {
       code,
       message,
       details: data
     };
   }
 
   // Si c’est une erreur réseau
   if (error.request) {
     return {
       code: 0,
       message: "Aucune réponse du serveur",
     };
   }
 
   // Si c’est une erreur JS interne
   return {
     code: 0,
     message: error.message || "Erreur interne",
   };
 }
 