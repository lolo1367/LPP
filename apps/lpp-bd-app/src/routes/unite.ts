import express from 'express';
import { authenticateToken } from "./authMiddleware";
import * as UniteController from '../controllers/uniteController';

const router = express.Router();


router.get('/', authenticateToken, UniteController.getUnites);


export default router;