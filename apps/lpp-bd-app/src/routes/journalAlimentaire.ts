import express from 'express';
import { authenticateToken } from "./authMiddleware";
import * as JournalAlimentaire from '../controllers/journalAlimentaireController';

const router = express.Router();

router.put('/:id', authenticateToken, JournalAlimentaire.updateLigne);
router.get('/', authenticateToken, JournalAlimentaire.getLigne);
router.post('/', authenticateToken, JournalAlimentaire.insertLigne);
router.delete('/:id', authenticateToken, JournalAlimentaire.deleteLigne);

export default router;