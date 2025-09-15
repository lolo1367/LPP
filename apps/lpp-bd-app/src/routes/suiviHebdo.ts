import express from 'express';
import { authenticateToken } from "./authMiddleware";
import * as SuiviHebdoController from '../controllers/suiviHebdoController';

const router = express.Router();

router.get('/', authenticateToken, SuiviHebdoController.getSuiviHebdo);

export default router;