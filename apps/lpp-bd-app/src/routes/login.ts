import express from 'express';
import { authenticateToken } from "./authMiddleware";
import * as LoginController from '../controllers/loginController';

const router = express.Router();


router.post('/login', LoginController.verifierLogin);
router.post('/refresh', LoginController.refreshToken);
router.post('/logout', authenticateToken, LoginController.logout);


export default router;