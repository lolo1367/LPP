import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // obligatoire avec Supabase
});

(async () => {
  try {
    const { rows } = await pool.query('select now()');
    console.log('Connexion OK :', rows[0]);
  } catch (err) {
    console.error('Erreur de connexion :', err);
  } finally {
    await pool.end();
  }
})();