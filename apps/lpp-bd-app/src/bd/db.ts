// src/bd/db.ts
import 'dotenv/config';
import { Pool } from 'pg';
import { URL } from 'url';
import { logConsole } from '@lpp/communs';

const rawEnv = (process.env.DATABASE_URL || '').trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');

if (!rawEnv) {
  console.error('DATABASE_URL absente ou vide. Vérifie ton .env');
  throw new Error('DATABASE_URL missing');
}

let pool: Pool;

try {
  const u = new URL(rawEnv);
  const dbUser = decodeURIComponent(u.username);
  const dbPass = decodeURIComponent(u.password);
  const dbHost = u.hostname;
  const dbPort = u.port ? parseInt(u.port, 10) : 5432;
  const dbName = u.pathname && u.pathname.length > 1 ? u.pathname.slice(1) : undefined;

  pool = new Pool({
    user: dbUser,
    password: dbPass,
    host: dbHost,
    port: dbPort,
    database: dbName,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  pool.on('connect', () => {
    logConsole(true, '', 'db.ts', 'Connecté à la base PostgreSQL', '');
  });

  pool.on('error', (err: Error) => {
    logConsole(true, '', 'db.ts', `Erreur pool PostgreSQL : ${err.message}`, '');
  });
} catch (err) {
  console.error('Erreur parsing DATABASE_URL, fallback -> connectionString:', err);
  pool = new Pool({
    connectionString: rawEnv,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });
}

export default pool;

export interface PgError extends Error {
  code?: string;
  detail?: string;
  constraint?: string;
}
