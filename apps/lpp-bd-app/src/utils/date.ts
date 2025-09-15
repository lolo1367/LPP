import { parse, isValid }  from 'date-fns';
import { startOfWeek, format } from "date-fns";
import { logConsole } from "@lpp/communs";

const viewlog = false;
const emoji = "";
const fichier = "date";

/**
 * Vérifie si une chaîne de caractères est une date valide au format yyyy-MM-dd
 * @param {string} input - La date en chaîne (ex : "2025-06-06")
 * @returns {boolean} - true si valide, false sinon
 */
export function isValidISODate(input : string) : boolean{
  if (!input) return false;

  const parsedDate = parse(input, 'yyyy-MM-dd', new Date());
  return isValid(parsedDate);
}

export function getLundiSemaine(date: Date): Date {
  logConsole(viewlog, emoji, fichier + 'getLundiSemaine', 'Début', '');
  const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()); // forcée à minuit local
  const lundi = startOfWeek(localDate, { weekStartsOn: 1 }); // lundi = 1
  return lundi;
}