import {
	Request,
	Response,
	NextFunction
} from 'express';
import {
   utilisateurLoginSchema,
   utilisateurTokenSchema,
   Utilisateur
} from "@lpp/communs";

import {
   logConsole
} from '@lpp/communs';

import * as utilisateurService from '../services/utilisateurService';
import * as refreshTokenService from '../services/refreshTokenService';

import jwt from 'jsonwebtoken';
import { HttpException } from '@lpp/communs';

// ==================================================
// Constant pour les logs
//===================================================
const viewLog: boolean = true;
const emoji = "🔖​";
const fichier: string  = "loginController";

export async function verifierLogin(req: Request, res: Response, next: NextFunction) {
	try {

		logConsole (viewLog, emoji, fichier + '/verifierLogin', 'Début','');
      logConsole (viewLog, emoji, fichier + '/verifierLogin', 'req.body',req.body);
      
      const parseResultQuery = utilisateurLoginSchema.safeParse(req.body);
      logConsole (viewLog, emoji, fichier + '/verifierLogin', 'parseResultQuery',parseResultQuery);


      if (!parseResultQuery.success) {
			throw parseResultQuery.error;
		}
		
      const email = parseResultQuery.data.email;
      const mdp = parseResultQuery.data.mdp;

		logConsole (viewLog, emoji, fichier + '/verifierLogin', 'email',email);
		
      const retour = await utilisateurService.verifierLogin(email,mdp);
      logConsole(viewLog, emoji, fichier + '/verifierLogin', 'retour', retour);
      
      // Vérification de la présence de l'utilisateur
      if (retour.message === 'Utilisateur inconnu') {
         return next(new HttpException(401, retour.message));
      }

      // Vérification de la cohérence du mot de passe
      if (retour.message === 'Mot de passe incorrect') {
         return next(new HttpException(401, retour.message));
      }

      if (!retour.utilisateur) {
         return next(new HttpException(401, 'Utilisateur non trouvé !!!! PAS POSSIBLE'));
      }

      const utilisateur = retour.utilisateur;

      // Génération du token d'1h
      const token = jwt.sign(
         { id: utilisateur.id, email: utilisateur.email },
         process.env.JWT_ACCESS_SECRET!,
         { expiresIn: "1h" }
      );
      logConsole(viewLog, emoji, fichier + '/verifierLogin', 'token', token);
      
      // Génération du token de 30j
      const tokenRefresh = jwt.sign(
         { id: utilisateur.id, email: utilisateur.email },
         process.env.JWT_REFRESH_SECRET!,
         { expiresIn: "30d" }
      );
      logConsole(viewLog, emoji, fichier + '/verifierLogin', 'token', token);
      
      // Sauvegarde en base pour pouvoir au cas où l'invalider
      await refreshTokenService.saveRefreshToken(utilisateur.id, tokenRefresh);

      res.json({
         token: token,
         refreshToken: tokenRefresh,
         utilisateur: {
            id: utilisateur.id,
            email: utilisateur.email,
            nom: utilisateur.nom,
            prenom: utilisateur.prenom,
            taille: utilisateur.taille,
            point_bonus: utilisateur.point_bonus,
            point_jour: utilisateur.point_jour
         }
       });

  	} catch (err) {
    	next(err);
	} 	
}

export async function refreshToken(req: Request, res: Response, next: NextFunction) {
	
		logConsole (viewLog, emoji, fichier + '/refreshToken', 'Début','');
      logConsole (viewLog, emoji, fichier + '/refreshToken', 'req.body',req.body);
      
      const parseResultQuery = utilisateurTokenSchema.safeParse(req.body);
      logConsole (viewLog, emoji, fichier + '/refreshToken', 'parseResultQuery',parseResultQuery);


      if (!parseResultQuery.success) {
         throw new HttpException(401, "Refresh token manquant.");
		}
		
      const refreshToken = parseResultQuery.data.token;
      logConsole(viewLog, emoji, fichier + '/refreshToken', 'refreshToken', refreshToken);
      
   try {
         
      // Vérification de la présence du token en base
      const stored = await refreshTokenService.findRefreshToken(refreshToken);
      if (!stored) return res.status(403).json({ "erreur": "Refresh token inconnu." });

      // Vérification de la singautre du token
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
      if (!payload) return res.status(403).json({ "erreur": "Refresh token invalide." });

      // Génération du nouveau refresh token
      const newAccessToken = jwt.sign(
         { id: payload.id, email: payload.email },
         process.env.JWT_ACCESS_SECRET!,
         { expiresIn: "1h" }
      );

      return res.json({ accessToken: newAccessToken });

  	} catch (err) {
    	next(err);
	} 	
}

export async function logout(req: Request, res: Response, next: NextFunction) {
   logConsole(viewLog, emoji, fichier + '/refreshToken', 'body', req.body);

   const { token } = req.body;  
   logConsole(viewLog, emoji, fichier + '/refreshToken', 'token', token);

   try {
      
      if (token) {
         
         await refreshTokenService.deleteRefreshToken(token); // supprime juste ce token
      }
      res.json({ success: true });
      
   } catch (err) {
    next(err);
   
    }
 }
