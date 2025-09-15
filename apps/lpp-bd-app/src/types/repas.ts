// Reprensation en base pour la création
export interface RepasDataRow {
  nom: string;
  icone: string;
  ordre: number;
}
// Représentation en base de la modification
export interface RepasRow extends RepasDataRow {
  id: number;
}