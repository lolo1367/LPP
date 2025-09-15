import express from 'express';
import dns from 'dns/promises';
const router = express.Router();

router.get('/test-network', async (req, res) => {
  try {
    const ips = await dns.lookup('db.rciudslrcinkyeyetxsi.supabase.co', { all: true });
    res.json({ success: true, ips });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;