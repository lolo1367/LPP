import express from 'express';
import { authenticateToken } from "./authMiddleware";
import * as CategorieController from '../controllers/categorieController.js';

const router = express.Router();

router.put('/:id', authenticateToken, CategorieController.updateCategorie);
router.get('/byIds', authenticateToken, CategorieController.getCategorieByIds);
router.get('/', authenticateToken, CategorieController.getCategorie);
router.post('/', authenticateToken, CategorieController.insertCategorie);
router.delete('/:id', authenticateToken, CategorieController.deleteCategorie);

export default router;