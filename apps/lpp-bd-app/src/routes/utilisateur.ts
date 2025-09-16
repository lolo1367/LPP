import express from 'express';
import { authenticateToken } from "./authMiddleware";
import * as UtilisateurController from '../controllers/utilisateurController';

const router = express.Router();

router.put('/:id', authenticateToken, UtilisateurController.updateUtilisateur);
router.put('/mdp/:id', authenticateToken, UtilisateurController.updateMdpUtilisateur);
router.get('/', authenticateToken, UtilisateurController.getUtilisateurs);
router.post('/', authenticateToken, UtilisateurController.insertUtilisateur);
router.delete('/:id', authenticateToken, UtilisateurController.deleteUtilisateur);

export default router;