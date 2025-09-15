// Représentation en base de données
export interface CategorieDataRow {
  nom: string;
}

export interface CategorieRow extends CategorieDataRow {  
   id: number;
}