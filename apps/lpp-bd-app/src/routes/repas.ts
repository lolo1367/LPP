import express from 'express';
import { authenticateToken } from "./authMiddleware";
import * as RepasController from '../controllers/repasController';

const router = express.Router();

router.put('/:id', authenticateToken, RepasController.updateRepas);
router.get('/byIds', authenticateToken, RepasController.getRepasByIds);
router.get('/', authenticateToken, RepasController.getRepas);
router.post('/', authenticateToken, RepasController.insertRepas);
router.delete('/:id', authenticateToken, RepasController.deleteRepas);

export default router;