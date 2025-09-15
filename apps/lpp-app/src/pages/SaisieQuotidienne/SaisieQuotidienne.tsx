// ==  Feuille de style ==========================================================================================
import styles from './SaisieQuotidienne.module.css';

// == Import =====================================================================================================

// Import du hook - useEffect propre à ce composant
import { useSaisieQuotidienneData } from '@/hook/useSaisieQuotidienneData';
import { UTI_ID } from '@/config';

import React, { useState } from 'react';
import { useReferenceStore } from '@/store/referenceStore';

// Import de la déclaration des entités
import {
	Aliment,
	Repas,
	LigneJournalAlimentaireComplet,
	LigneJournalAlimentaireDataSimple,
	log
} from '@ww/reference';

// Import des services
import {
	journalAlimentaireAjouter,
	journalAlimentaireModifier,
	journalAlimentaireSupprimer
} from '@/api/journalAlimentaire';

// Import des composants
import SemaineSelector from '@/component/SemaineSelector/SemaineSelector';
import PointSummary from '@/component/PointSummary/PointSummary';
import JournalAlimentaireParRepas from '@/component/JournalAlimentaireParRepas/JournalAlimentaireParRepas';
import AlimentSelector from '@/popin/AlimentSelector/AlimentSelector';
import EnregistrementModify from '@/popin/EnregistrmentModify/EnregistrmentModify';

import Avertissement from '@/basicComponent/Avertissement/Avertissement';

import { format } from "date-fns";
import { logConsole } from '@/utils/logger';
import {
	Resultat,
	formatAppError
 } from '@ww/reference';

 // == PAGE ======================================================================================================
export default function SaisieQuotidienne() {

	const emoji = "🍴​";
	const viewLog = true;
	const module= 'saisieQuotidienne';

	// ========================================================================
	// Gestion des données
	// ========================================================================

	// Données statiques
	const repasTypes = useReferenceStore((s) => s.typesRepas);
	const unites = useReferenceStore((s) => s.unites);
	const alimentsDisponibles = useReferenceStore((s) => s.aliments);

	// Date sélectionnée au niveau du composant semaineSelector
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());

	// Etat de visibilité de la modale de choix d'aliment qui permet l'ajout direct
	const [showAlimentSelector, setShowAlimentSelector] = useState<boolean>(false);

	// Etat de visibilité de la modale de modificaition du journal
	const [showEnregistrementModify, setShowEnregistrementModify] = useState<boolean>(false);

	// Repas sélectionné (soit lors de l'ajout soit lors de la modification)
	const [selectedRepas, setSelectedRepas] = useState<Repas | null>(null);

	// Aliment sélectionné (soit au retour de la sélection, soit lors de la modification)
	const [selectedAliment, setSelectedAliment] = useState<Aliment | null>(null);

	// Ligne du journal sélectionnée (lors de la demande de visualisation du détail)
	const [selectedLigne, setSelectedLigne] = useState<LigneJournalAlimentaireComplet | null>(null);

	// Indicateur journal modifié
	const [modificationCount, setModificationCount] = useState(0);

	// Message d'erreur
	const [messageErreur, setMessageErreur] = useState <string>("");

	// =========================================================================
	// Gestion des données dont la valeur dépend de la date
	// =========================================================================
	
	// Gestion de la valeur de la date (semaineSelector)
	const handleDateChange = (newDate: Date) => {
 		setSelectedDate(newDate);
	};

	const {
		suiviHebdoData,
		journalLines,
		alimentsRecents,
		loading,
		error,
		bonusPoints,
		dailyPointsTotal,
		pointsConsumedToday,
		pointsRemainingDaily
	} = useSaisieQuotidienneData(UTI_ID,selectedDate, modificationCount);
	
	logConsole(viewLog, emoji, module, "unites", unites);

	// Déterminer si l'un des chargements est en cours pour afficher un message global
	const overallLoading = loading;

	// Déterminer si l'une des erreurs s'est produite
	const overallError = error;

	// ===============================================================================
	// Gestion des événements du composant "journalAlimentaireParRepas"
	// ===============================================================================

	// Fonction appelée lors de l'accès au détail d'une ligne du journal 
	const handleLigneEditer = (ligne: LigneJournalAlimentaireComplet) => {
		setSelectedAliment(ligne.aliment);
		setSelectedRepas(ligne.repas);
		setSelectedLigne(ligne);
		logConsole(viewLog, emoji, module, "Accéder aux détails de la ligne :", ligne);
		setShowEnregistrementModify(true); // Ouverture de la modale
	};

	// Fonction appelée lors de la demande de suppression d'une ligne
	const handleLigneSupprimer = async (ligneId: number) => {

		logConsole(viewLog, emoji, module, "=== SUPPRESSION ===", ligneId);


		const resultat = await journalAlimentaireSupprimer(ligneId);

		if (resultat.success) {
			setModificationCount(c => c + 1);;
		} else {
			setMessageErreur(`Erreur lors de l'ajout de l'aliment (${resultat.message} )`);
		}	
	};

	// Fonction appelée lors de la demande d'ajout d'une ligne du journal alimentaire 
	// => Modale de sélection d'un aliment
	const handleLigneDemanderAjout = (repas: Repas) => {
		logConsole(viewLog,emoji,module,"Ajouter une ligne pour le repas :", repas);
		setSelectedRepas(repas); // Stocke le repas pour le passer à la modale
		setShowAlimentSelector(true); // Ouvre la modale de recherche
	};

	// ================================================================================
	// Gestion des événemets de la modale "AlimentSelector"
	// ================================================================================

	// Fonction appelée lorsque la modale transmet l'aliment sélectionné	
	const handleLigneAjouter = async (aliments: Aliment[]) => {

		let ligne: LigneJournalAlimentaireDataSimple;
		let resultat: Resultat;
		let compteurMajKo: number = 0;
		let msgErreur: string = '';

		for (let i = 0; i < aliments.length; i++) {

			logConsole(viewLog, emoji, module, "Ajout aliment n° :", i);

			ligne = {
				uti: UTI_ID,
				date: format(selectedDate, "yyyy-MM-dd"),
				alimentId: aliments[i].id,
				typeRepasId: (selectedRepas?.id ? selectedRepas.id : 1),
				quantite: aliments[i].quantite,
				points: aliments[i].points,
				unite: aliments[i].unite
			};

			resultat = await journalAlimentaireAjouter(ligne);

			if (!resultat.success) {
				
				compteurMajKo = compteurMajKo + 1;
				let msg: string = "";

				if (resultat.erreur) {
					msg = formatAppError(resultat.erreur);
			  } else {
					msg = "Erreur inconnue lors de la création de l'aliment";
				}
				
				if (compteurMajKo > 1) {
					msgErreur += '\n' + msg;
				} else {
					msgErreur += msg ;
				}			   
			}
			
		};

		if (compteurMajKo > 0) {
			logConsole(viewLog, emoji, module + 'handleLigneAjouter', 'erreur', `Erreur : ${(aliments.length - compteurMajKo)} sur ${aliments.length} ajoutés \n ${msgErreur}`);
			setMessageErreur(`Erreur : ${(aliments.length - compteurMajKo)} sur ${aliments.length} ajoutés \n ${msgErreur}`);
		}		
			
		if (compteurMajKo != aliments.length) {
			setModificationCount(c => c + 1);
			logConsole(viewLog, emoji, module, "Après ajout (compteur)", modificationCount);
		}

		setShowAlimentSelector(false);			

	};

	// Fermeture de la modale et réinitialisation des données
	const handleCloseAlimentSelector = () => {
		setShowAlimentSelector(false);
	};


	// ==================================================================================
	// Gestion des événements de la modale "EnregistrementModify"
	// ==================================================================================

	// Modification en base de la ligne
	const handleLigneModifier = async (ligne: LigneJournalAlimentaireComplet | null) => {
		if (ligne) {
			const data: LigneJournalAlimentaireDataSimple = {
				uti: UTI_ID,
				date: format(selectedDate, "yyyy-MM-dd"),
				alimentId: ligne.aliment.id,
				typeRepasId: ligne.repas.id,
				quantite: ligne.quantite,
				points: ligne.points,
				unite: ligne.unite
			};

			logConsole(viewLog,emoji,module + '/handleLigneModifier', 'ligne',ligne)

			const resultat = await journalAlimentaireModifier(ligne.id, data);

			if (resultat.success) {
				setModificationCount(c => c + 1); (true);
				
			} else {
				setMessageErreur(`Erreur lors de la modification de l'aliment (${resultat.message} )`);
			}
			setSelectedLigne(null);
			setShowEnregistrementModify(false);
		}
	}

	// Fermeture de la modale et réinitialisation des données
	const handleCloseEnregistrementModify = () => {
		setShowEnregistrementModify(false);
	};

return (
	<div className="page-container">
		
		<div className="page-card">
			
			{/* Affichage de selcteur de jour */}
			<SemaineSelector
				selectedDate={selectedDate}
				onDateChange={handleDateChange} />
			
			{/* Affichage conditionnel pour du récapitulatif de points */}
			{loading ? (
				<>
					<div className="loadingMessage">Chargement des données</div>
				</>

			) : error ? (
					<div className={styles.messageErreur}>
						<Avertissement
							message={error}
							type='erreur'>
						</Avertissement>
					</div>
				) : (
				<>
					<PointSummary
						pointsUsed={pointsConsumedToday}
						pointsRemaining={pointsRemainingDaily}
						bonusPoints={bonusPoints}
						totalDailyPoints={dailyPointsTotal}
							/>
							{ messageErreur !== '' ? (
								<div className={styles.messageErreur}>
									<Avertissement
										message={messageErreur}
										type='erreur'>
									</Avertissement>
								</div>
							) : (<></>)}
					<div className='page-body-scrollable'>
						<JournalAlimentaireParRepas
							journalLines={journalLines}
							mealTypes={repasTypes}
							selectedDate={selectedDate}
							onAskAdd={handleLigneDemanderAjout}		
							onAskModidy={handleLigneEditer}
							onAskDelete={handleLigneSupprimer}
								/>
					</div>
				</>
			)}

		</div>

		{/* La modale de recherche d'aliment */}
		<AlimentSelector
			show={showAlimentSelector}
			aliments={alimentsDisponibles}
			alimentsRecents={alimentsRecents}
			repas={selectedRepas}
			date={selectedDate}
			onValider={handleLigneAjouter}
			onClose={handleCloseAlimentSelector	}
		/>

		{ /* La modale de saisie de la ligne */}
		<EnregistrementModify
			show={showEnregistrementModify}
			ligne={selectedLigne}
			repasDisponibles={repasTypes}
			unites={unites}
			onValider={handleLigneModifier}
			onClose={handleCloseEnregistrementModify}
		/>

	</div>
);
}
