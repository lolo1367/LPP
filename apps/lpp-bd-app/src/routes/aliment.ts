import express from 'express';
import { authenticateToken } from "./authMiddleware";
import * as AlimentController from '../controllers/alimentController';

const router = express.Router();

router.put('/:id', authenticateToken, AlimentController.updateAliment);
router.get('/byIds', authenticateToken, AlimentController.getAlimentByIds);
router.get('/recents', authenticateToken, AlimentController.getAlimentsRecents);  
router.get('/', authenticateToken, AlimentController.getAliment);
router.post('/', authenticateToken, AlimentController.insertAliment);
router.delete('/:id', authenticateToken, AlimentController.deleteAliment);



export default router;