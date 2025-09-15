

import express from 'express';
import * as dns from 'dns';
import { createPool } from '../bd/createPool'; // ou createPool.ts si tu l’as séparé
import pool from '@/bd/db';

const router = express.Router();

router.get('/test-db', async (req, res) => {
  try {

    

    // Test connexion DB

    const result = await pool.query('SELECT NOW()');

    res.json({
      success: true,
      now: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

