export function startOfDay(date: Date): Date {
   return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

// Début de la semaine (lundi) à minuit
export function startOfWeek(date: Date): Date {
   const day = date.getDay(); // 0 = dimanche, 1 = lundi ...
   // Décalage pour que lundi = 0
   const diff = (day + 6) % 7; // si lundi=1 → diff=0, dimanche=0 → diff=6
   return new Date(date.getFullYear(), date.getMonth(), date.getDate() - diff, 0, 0, 0, 0);
}

// Début du mois à minuit
export function startOfMonth(date: Date): Date {
   return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

// Début de l'année à minuit
export function startOfYear(date: Date): Date {
   return new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0);
}