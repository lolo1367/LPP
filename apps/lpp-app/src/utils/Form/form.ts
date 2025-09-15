export interface ValidationData {
   isValide: boolean,
   msgErreur: string | null 
};

export const defaultValidationData: ValidationData = {
   isValide: true,
   msgErreur: null
}

export type ErreursFormulaire = {
   [champ: string]: string; // chaque champ peut avoir un message d'erreur
 };
 
export type TouchedFormulaire = {
   [champ: string]: boolean; // chaque champ peut être "touché"
};
