import express from 'express';
import { authenticateToken } from "./authMiddleware";
import * as JournalPoids from '../controllers/journalPoidsController';

const router = express.Router();

router.put('/:id', authenticateToken, JournalPoids.updateLigne);
router.get('/', authenticateToken, JournalPoids.getLigne);
router.post('/', authenticateToken, JournalPoids.insertLigne);
router.delete('/:id', authenticateToken, JournalPoids.deleteLigne);

export default router;