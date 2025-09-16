import React from 'react';
import styles from './JournalAlimentaireParRepas.module.css';
import SwipeToDeleteItem  from '@/basicComponent/SwipeToDeleteItem/SwipeToDeleteItem';

// Importation des types depuis @lpp/communs
import { Repas, LigneJournalAlimentaireComplet } from '@lpp/communs';

// Importez toutes les icônes de react-icons/md sous l'alias MDIcons
import * as MDIcons from 'react-icons/md'; 
import PuceButton from '@/basicComponent/PuceButton/PuceButton';


interface JournalAlimentaireParRepasProps {
	journalLines: LigneJournalAlimentaireComplet[]; 
	selectedDate: Date; 
	mealTypes: Repas[]; 
	onAskAdd: (repas: Repas) => void; 
	onAskModidy: (ligne: LigneJournalAlimentaireComplet) => void; 
	onAskDelete: (ligneId: number) => void;
}

export default function JournalAlimentaireParRepas({
	journalLines,
	selectedDate,
	mealTypes,
	onAskAdd,
	onAskModidy,
	onAskDelete }: JournalAlimentaireParRepasProps) {
	
		if (!mealTypes || mealTypes.length === 0) {
			return (
			  <div className={styles.spinnerContainer}>
				 <div className={styles.spinner}></div>
				 <p>Chargement des repas...</p>
			  </div>
			);
		 }

	// Grouper les lignes par type de repas
	const journalLinesByRepasId = journalLines.reduce((acc, line) => {
		if (!acc.has(line.repas.id)) {
			acc.set(line.repas.id, []);
		}
		acc.get(line.repas.id)?.push(line);
		return acc;
	}, new Map<number, LigneJournalAlimentaireComplet[]>());

	// Calculer les totaux de points par repas
	const repasTotals = new Map<number, number>();
	journalLines.forEach(line => {
		repasTotals.set(line.repas.id, (repasTotals.get(line.repas.id) || 0) + line.points);
	});

	// Trier les types de repas par leur nom pour un affichage cohérent
	const sortedMealTypes = [...mealTypes].sort((a, b) => a.ordre - b.ordre);

	// ---------------------------------------------------------------------------------
	// Gestion des événements
	// ----------------------------------------------------------------------------------
	const supprimerItem = (ligne_id: number) => {
		ligne_id = 1;
	};

	return (
		<div className={styles.container}>
			{sortedMealTypes.length === 0 ? (
			<p className={styles.noEntries}>Aucun type de repas disponible.</p>
			) : (
			sortedMealTypes.map((repasType) => {
				const IconComponent = (MDIcons as any)[repasType.icone];
				const linesForRepas = journalLinesByRepasId.get(repasType.id) || [];
				const totalPointsForRepas = repasTotals.get(repasType.id) || 0;

				// Déplacez le console.error ici pour qu'il ne soit pas un enfant JSX
				if (repasType.icone && !IconComponent) {
					console.error(`Icône Material Design non trouvée ou invalide pour le nom: "${repasType.icone}". Vérifiez la casse et l'existence dans react-icons/md.`);
				}

				return (
					<div key={repasType.id} className={styles.repasGroup}>
					<div className={styles.repasHeader}>
						{/* Afficher l'icône du repas si disponible et si le composant existe */}
						{repasType.icone && IconComponent ? (
							React.createElement(
							IconComponent, // Utilise le composant d'icône trouvé
							{
								className: styles.repasIcon,
								size: 24 // Taille de l'icône, ajustez si nécessaire
							}
							)
						) : (
							// Fallback si l'icône n'est pas trouvée ou si repasType.icone est vide
							<div className={styles.repasIconFallback}>
							{/* Le contenu de ce div est maintenant vide de tout console.error */}
							</div>
						)}
						<span className={styles.repasName}>{repasType.nom}</span>
						<span className={styles.repasTotalPoints}>{totalPointsForRepas} pts</span>
							{/* Bouton d'ajout pour le repas */}
							<PuceButton
								variant='primary'	fonction='ajouter'
								onClick={() => onAskAdd(repasType)}
								tooltip='Ajouter un aliment' ariaLabel='Ajouter' size='lg' />	
					</div>
					<div className={styles.repasLines}>
						{linesForRepas.length === 0 ? (
							<p className={styles.noEntriesForRepas}>Aucune entrée pour ce repas.</p>
						) : (
									linesForRepas.map((line) => (
							<>
								<SwipeToDeleteItem
									key={line.id}
									onDelete={() => onAskDelete(line.id)}
									className={styles.journalLine}		
								>
										<div className={styles.alimentDetails}>
											<span className={styles.alimentNom}>{line.aliment.nom}</span>
											<span className={styles.alimentPortion}>
												{line.quantite} {line.unite} 
											</span>
										</div>
										<div className={styles.journalLineRightSection}>
											<span className={styles.linePoints}>{line.points} pts</span>
											<div className={styles.journalLineActions}>
												<PuceButton
													variant='secondary' fonction='modifier'
													onClick={() => onAskModidy(line)}
													tooltip="Modifier l'aliment" ariaLabel='Modifier' size='lg'
												/>
											</div>
										</div>
									</SwipeToDeleteItem>
								</>
							))
						)}
					</div>
					</div>
				);
			})
			)}
		</div>
	);
	}
