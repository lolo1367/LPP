import { useEffect, useState } from 'react';
import { getDay, subDays } from 'date-fns';
import { logConsole } from '@lpp/communs';
import { CustomAppException, formatAppError } from '@lpp/communs';
import { useAuthStore } from '@/store/authStore';

import {
	suiviHebdoCharger,
	journalAlimentaireCharger,
	alimentChargerRecent
} from '@/api';	

// Import de la déclaration des entités
import {
	LigneJournalAlimentaireComplet,
	SuiviHebdo,
	AlimentRecent
} from '@lpp/communs';

export function useSaisieQuotidienneData(
	utilisateurId: number,
	dateSelectionnee: Date,
	nombreModification: number) {
	
	const viewLog = true;
	const emoji = "🍜​";
	const module = "useSaisieQuotidienneData";
	


	const [suiviHebdoData, setSuiviHebdoData] = useState<SuiviHebdo | null>(null);
	const [journalLines, setJournalLines] = useState<LigneJournalAlimentaireComplet[]>([]);
	const [alimentsRecents,setAlimentsRecents] = useState<AlimentRecent[]>([]);
	const [pointsConsumedToday, setPointsConsumedToday] = useState<number>(0);
	const [pointsJour, setPointsJours] = useState<number>(0);	
	const [pointsBonus, setPointsBonus] = useState<number>(0);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	logConsole(viewLog, emoji, module, "Date", dateSelectionnee);
	logConsole(viewLog, emoji, module, "Compteur", nombreModification);
	const utilisateur = useAuthStore(state => state.utilisateur);

	// ==================================================================================
	// Chargement des types de repas, des unites et de la liste des aliments
	// Le chargement se fait une fois à l'ouverture de la page
	// ==================================================================================		
	
	useEffect(() => {

		logConsole(viewLog, emoji, module, "=== INITIAL ===", "");
	
		// Déclaration de la fonction de chargement des données statiques
		const loadStaticData = async () => {
			try {
				// Date du jour
				const aujourdhui = new Date();

				// Récupération des données de base de l'utilisateur

				if (utilisateur) {
					setPointsBonus(utilisateur.point_bonus);
					setPointsJours(utilisateur.point_jour);
				}
				
				// Chargement des données
				const [recents] = await Promise.all([
					alimentChargerRecent(utilisateurId, subDays(aujourdhui,15),aujourdhui)
				]);	

				logConsole(viewLog, emoji, module, "recents", recents);
				// Mise à jours des états
				setAlimentsRecents(recents);

			} catch (e) {
				let msg = "Erreur lors du chargement initial (aliments récents)";

				if (e instanceof CustomAppException) {
					logConsole(viewLog,emoji,module, "erreur",e.erreur);
					msg = (e.erreur ? formatAppError(e.erreur) : msg);
				}

				logConsole(viewLog,emoji,module, "e",e);
				setError(msg);
			}
		};

		// Appel de la fonction
		loadStaticData();
	}, []); // Une seule fois (pas d'élément déclencheur)

	// ==================================================================================
	// Chargement du suivi hebdo et des lignes de journal alimentaire
	// Le chargement doit être fait quand :
	// * La date sélectionnée change => Fait
	// * Une ligne du journal est ajoutée, supprimer ou modifier => PAS ENCORE IMPLEMENTE
	// ==================================================================================

	useEffect(() => {

		logConsole(viewLog, emoji, module, "================= DATE ====================", "");


		// Déclaration de la fonction des données dynamiques
		const loadDynamicData = async () => {
			setLoading(true);
			setError(null);

			try {
				const [suivi, journal] = await Promise.all([
					suiviHebdoCharger(utilisateurId,dateSelectionnee),
					journalAlimentaireCharger(utilisateurId, dateSelectionnee)
				]);
			
				setSuiviHebdoData(suivi?.[0] || null);
				setJournalLines(journal);
				logConsole(viewLog, emoji, module, "== Lignes du journal :", journalLines.length);
			
			} catch (e) {
				setError("Erreur lors du chargement des données pour la date");
				setSuiviHebdoData(null);
				setJournalLines([]);
			} finally {
				setLoading(false);
			}
		};

		// Appel de la fonction
		loadDynamicData();
		
	}, [dateSelectionnee,nombreModification]); // Quand la date est modifiée


	// ==================================================================================
	// Calcul des valeurs à transmettre au récapitulatif des points
	// Le chargement doit être fait quand :
	// * Les lignes du journal alimentaires sont chargées
	// ==================================================================================
	
	useEffect(() => {

		if (!suiviHebdoData || journalLines.length === 0) {
			setPointsConsumedToday(0);
		  return;
		}
	 
		const dayIndex = getDay(dateSelectionnee); // 0 = dimanche, etc.
		const pointsParJour = [
		  suiviHebdoData.point_dimanche_utilise,
		  suiviHebdoData.point_lundi_utilise,
		  suiviHebdoData.point_mardi_utilise,
		  suiviHebdoData.point_mercredi_utilise,
		  suiviHebdoData.point_jeudi_utilise,
		  suiviHebdoData.point_vendredi_utilise,
		  suiviHebdoData.point_samedi_utilise
		];
	 
		setPointsConsumedToday(pointsParJour[dayIndex] ?? 0);
	 }, [journalLines]); // Déclenché lorsque les lignes du journal changent

	return {
		suiviHebdoData,
		journalLines,
		alimentsRecents,
		loading,
		error,
		bonusPoints: suiviHebdoData?.point_bonus_restant ?? pointsBonus,
		dailyPointsTotal: suiviHebdoData?.point_journalier ?? pointsJour,
		pointsConsumedToday,
		pointsRemainingDaily: (suiviHebdoData?.point_journalier ?? pointsJour) - pointsConsumedToday
	};
}
