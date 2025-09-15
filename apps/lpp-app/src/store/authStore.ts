// authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Utilisateur, utilisateurDataSchema } from "@ww/reference";
import { logout, verifierLogin } from '@/api/login';
import { logConsole } from "@ww/reference";

import { CustomAppException, Resultat, isAppError } from '@ww/reference';
import { Authentification } from "@ww/reference";

type User = { id: number; name: string; email: string };

const emoji = "🐰​";
const viewLog = true;
const module = "authStore"; 


type AuthState = {
utilisateur: {
	id: number,
	mail: string,
	nom: string,
	prenom: string,
	sexe: string,
	taille: number,
	point_bonus: number,
	point_jour: number
} | null,
isLoading: boolean;
token: string | null;         // accessToken
refreshToken: string | null;  // nouveau champ
login: (email: string, mdp: string) => Promise<Resultat>;
setAccessToken: (token: string) => void;
setRefreshToken: (token: string) => void;
logout: () => void;
startLoading : () => void;
};

export const useAuthStore = create<AuthState>()(
persist(
	(set) => ({
		utilisateur: null,
		isLoading: true,
		token: null,
		refreshToken: null,
		// ======================================================================
		// Fonction login
		// ======================================================================
		login: async (email, mdp) => {         
			try {
				const resultat = await verifierLogin(email, mdp);
				logConsole(viewLog, emoji, module + '/login', "resultat", resultat);

				if (resultat.success && resultat.donnees) {
					const authentification = resultat.donnees as Authentification;
					set({
						utilisateur: authentification.utilisateur,
						token: authentification.token,
						refreshToken: authentification.refreshToken,
						isLoading: false
					});
				}
	
				return resultat;
			} catch (err: any) {
				// On convertit l’exception en Resultat
				if (err instanceof CustomAppException) {
					const resultat: Resultat = {
						success: err.success,
						message: err.message,
						erreur: err.erreur
					}
					return resultat;
				}
			
				const resultat: Resultat = {
					success: false,
					message: "Erreur inattendue",
					erreur: {
						code: "INCONNU",
						message: err?.message ?? "Erreur inattendue"
					}
				}
				return resultat;
			}

		},
		setAccessToken: (token: string) => set({ token }),
		setRefreshToken: (token: string) => set({ refreshToken: token }),
		// ======================================================================
		// Fonction logout
		// ======================================================================
		logout: async () => {
			try {
				const state = useAuthStore.getState();
				if (state.refreshToken) {
					const resultat = await logout(state.refreshToken);
					logConsole(viewLog, emoji, module + '/logout', "resultat", resultat);
				}
			} catch (e) {
				console.warn("Erreur lors du logout API", e);
			} finally {
				set({ token: null, refreshToken: null, utilisateur: null, isLoading:false });
			}
		},
		// Nouvel état pour le début de la récupération
		startLoading : () => set({ isLoading: true }),
		
	}),
	{ name: "auth-storage" }
)
);
