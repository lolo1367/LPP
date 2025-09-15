
/**
 * Permet de mettre en majuscule la première lettre d'une chaine de caractères
 * @param string 
 * @returns 
 */
export const capitalise = (string: string) => {
   if (!string) return '';
   return string.charAt(0).toUpperCase() + string.slice(1);
 };