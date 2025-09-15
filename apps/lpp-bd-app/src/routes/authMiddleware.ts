// middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;

// Étendre Request pour TypeScript
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
      };
    }
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(401).json({ error: "Token manquant" });

  try {
    const payload = jwt.verify(token, ACCESS_SECRET) as { id: number; email: string; iat: number; exp: number };

    // On stocke les infos utilisateur pour les routes
    req.user = {
      id: payload.id,
      email: payload.email,
    };

    next(); // passer à la route suivante
  } catch (err) {
    return res.status(403).json({ error: "Token invalide ou expiré" });
  }
}
