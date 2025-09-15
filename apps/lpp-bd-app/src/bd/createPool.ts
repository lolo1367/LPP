// src/bd/db.ts
import 'dotenv/config';
import { Pool } from 'pg';
import { URL } from 'url';
import dns from 'dns';
import { logConsole } from '@ww/reference';

const rawEnv = (process.env.DATABASE_URL || '')
  .trim()
  .replace(/^"(.*)"$/, '$1')
  .replace(/^'(.*)'$/, '$1');

if (!rawEnv) {
  console.error('DATABASE_URL absente ou vide. Vérifie ton .env');
  throw new Error('DATABASE_URL missing');
}

// Fonction pour créer le pool (async pour gérer DNS)
export async function createPool(): Promise<Pool> {
  try {
    const u = new URL(rawEnv);

    const dbUser = u.username ? decodeURIComponent(u.username) : undefined;
    const dbPass = u.password ? decodeURIComponent(u.password) : undefined;
    const dbPort = u.port ? parseInt(u.port, 10) : 5432;
    const dbName = u.pathname && u.pathname.length > 1 ? u.pathname.slice(1) : undefined;

    // Résolution IPv4 forcée
    const host = await new Promise<string>((resolve, reject) => {
      dns.lookup(u.hostname, { family: 4 }, (err, address) => {
        if (err) reject(err);
        else resolve(address);
      });
    });

    let pool: Pool;

    if (typeof dbPass !== 'string' || dbPass.length === 0) {
      console.warn('Mot de passe vide ou non string, fallback sur connectionString brute.');
      pool = new Pool({
        connectionString: rawEnv,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      });
    } else {
      pool = new Pool({
        user: dbUser,
        password: dbPass,
        host,
        port: dbPort,
        database: dbName,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      });
    }

    pool.on('connect', () => {
      logConsole(true, '', 'db.ts', 'Connecté à la base PostgreSQL', '');
    });

    pool.on('error', (err: Error) => {
      logConsole(true, '', 'db.ts', `Erreur pool PostgreSQL : ${err.message}`, '');
    });

    return pool;
  } catch (err) {
    console.error('Erreur parsing DATABASE_URL ou DNS, fallback -> connectionString:', err);
    return new Pool({
      connectionString: rawEnv,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
  }
}

// Exemple d'utilisation dans un service :
// const pool = await createPool();

export interface PgError extends Error {
  code?: string;
  detail?: string;
  constraint?: string;
}
