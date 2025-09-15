import dotenv from 'dotenv';

dotenv.config();

// const REQUIRED_VARS = [
//   'REFERENCE_API_BASE_URL',
//   'REFERENCE_API_URI_ALIMENT',
//   'REFERENCE_API_URI_REPAS',
//   'REFERENCE_API_URI_CATEGORIE',
//   'REFERENCE_API_URI_UNITE'
// ];

// Vérification globale
// for (const v of REQUIRED_VARS) {
//   if (!process.env[v]) {
//     throw new Error(`❌ Missing required environment variable: ${v}`);
//   }
// }

// Export des valeurs typées
// export const config = {
//   REFERENCE_API_BASE_URL: process.env.REFERENCE_API_BASE_URL!,
//   REFERENCE_API_URI_ALIMENT: process.env.REFERENCE_API_URI_ALIMENT!,
//   REFERENCE_API_URI_REPAS: process.env.REFERENCE_API_URI_REPAS!,
//   REFERENCE_API_URI_CATEGORIE: process.env.REFERENCE_API_URI_CATEGORIE!,
//   REFERENCE_API_URI_UNITE: process.env.REFERENCE_API_URI_UNITE!,
//   REFERENCE_UNITE_PORTION: process.env.REFERENCE_UNITE_PORTION!,

// };

export const UNITE_BASE:string = "portion";
