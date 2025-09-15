import pool from "./db";
import fs from 'fs';
import { parse } from 'csv-parse/sync';

interface AlimentRow {
  [clef: string]: string;
}

export async function importerAlimentsDepuisCsv(cheminFichier: string): Promise<void> {
  // 1️⃣ Lecture du fichier CSV
  const contenuCsv = fs.readFileSync(cheminFichier, 'utf-8');
  const lignes: AlimentRow[] = parse(contenuCsv, {
	  columns: true,
	  delimiter: ';', // ⬅️ Important
    skip_empty_lines: true,
    trim: true,
  });

  if (lignes.length === 0) {
    console.warn("⚠️ Aucun enregistrement à importer.");
    return;
  }


  //2️⃣ Insertion des lignes
  for (const ligne of lignes) {
    const colonnes = Object.keys(ligne);
    const valeurs = colonnes.map((c) => {
      const v = ligne[c];
      if (v === undefined || v === '') return null;
      return v;
    });

    const placeholders = colonnes.map((_,i) => `$${i + 1}`).join(', ');
	  const sql = `INSERT INTO aliment (${colonnes.join(', ')}) VALUES (${placeholders})`;
	  console.info(`${sql} >> ${valeurs}	  `);

    await pool.query(sql,valeurs);
  }

  console.log(`✅ ${lignes.length} aliments importés avec succès.`);
}