// src/components/PointSummary/PointSummary.tsx
import React, { useRef, useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { logConsole } from '@ww/reference';
import styles from './PointSummary.module.css'; // Assurez-vous que le nom du module est correct (PointSummary sans 's')

interface PointSummaryProps {
  pointsUsed: number;
  pointsRemaining: number;
  bonusPoints: number;
  totalDailyPoints: number;
}

export default function PointSummary({ pointsUsed, pointsRemaining, bonusPoints, totalDailyPoints }: PointSummaryProps) {
	const emoji = "🧭​";
	const module = "PointSummaryProps";
	const viewLog = false;

	const pathRef = useRef<SVGPathElement | null>(null);
	const [pathLength, setPathLength] = useState(0);

	useEffect(() => {
		if (pathRef.current) {
		  setPathLength(pathRef.current.getTotalLength());
		}
	 }, []);
	 
	
	// Calcul de la progression pour la jauge
	// La jauge doit maintenant montrer les points RESTANTS par rapport au total quotidien
	const progressPercentage = totalDailyPoints > 0 ? (pointsRemaining / totalDailyPoints) * 100 : 0;
	const clampedProgress = Math.min(progressPercentage, 100);
	logConsole(viewLog, emoji, module, "progressPercentage", progressPercentage);
	logConsole(viewLog, emoji, module, "clampedProgress", clampedProgress);


	// Paramètres pour la jauge semi-circulaire SVG
	const gaugeStrokeWidth = 8; // Épaisseur de la ligne de la jauge
	const pathRadius = 45; // Rayon du chemin de l'arc (légèrement réduit pour un meilleur ajustement)
	const svgWidth = 120; // Largeur de l'SVG
	const svgHeight = 65; // Hauteur de l'SVG (réduite pour mieux s'aligner avec les autres colonnes)

	// Coordonnées du chemin pour un arc semi-circulaire s'ouvrant vers le haut
	const pathStartX = 10;
	const pathStartY = 55; // Ajusté pour correspondre à la nouvelle hauteur SVG
	const pathEndX = 110;
	const pathEndY = 55; // Ajusté pour correspondre à la nouvelle hauteur SVG

	// Le chemin SVG qui dessine l'arc semi-circulaire
	// On trace un arc qui 
	// * Démarre aux coordonnées : startX et start Y
	// * A un rayon en X de 45 px et en Y de 45px (cercle pur)
	// 0 0 1 : Rotation (0) / ArcLong (+180°) ou arc court (-180°) : ici court / Sens du dessin (1 : horaire)
	// * Point d'arrivé
	const dPath = `M ${pathStartX} ${pathStartY} A ${pathRadius} ${pathRadius} 0 0 1 ${pathEndX} ${pathEndY}`;

	// Longueur totale de l'arc semi-circulaire (circonférence d'un demi-cercle)
	const semiCircumference = Math.PI * pathRadius;

	// Le décalage pour la progression (plus la progression est grande, plus le décalage est petit)
	const strokeDashoffset = semiCircumference * (1 - clampedProgress / 100);
	logConsole(viewLog, emoji, module, "strokeDashoffset", strokeDashoffset);

	return (
		<div className={styles.summaryContainer}>
			<div className={styles.summaryContent}>
			<Row className="text-center justify-content-around align-items-end">
				{/* Section "Bonus semaine" */}
				<Col className={styles.summaryItem}>
					<div className={styles.bonusPointsValue}>{bonusPoints}</div>
					<div className={styles.bonusPointsLabel}>Reste hebdo</div>
				</Col>

				{/* Jauge de progression semi-circulaire centrale */}
				<Col xs="auto" className={styles.gaugeContainer}>
					<svg
					className={styles.gaugeSvg}
					width={svgWidth}
					height={svgHeight}
					viewBox={`0 0 ${svgWidth} ${svgHeight}`} // Définit le système de coordonnées de l'SVG
					>
					{/* Chemin de fond de la jauge (gris clair) */}
					<path
						className={styles.gaugeBackgroundPath}
						d={dPath}
						fill="none"
						stroke="#e6e6e6"
						strokeWidth={gaugeStrokeWidth}
					/>
					{/* Chemin de progression de la jauge (bleu) */}
					<path
							ref={pathRef}
							className={styles.gaugeProgressPath}
							d={dPath}
							fill="none"
							strokeWidth={gaugeStrokeWidth}
							strokeLinecap="round"
							style={{
								strokeDasharray: pathLength,
								strokeDashoffset: pathLength * (1 - clampedProgress / 100),
							}}
					/>

					{/* Le nombre au centre de la jauge doit maintenant être les points RESTANTS */}
					<text
						x={svgWidth / 2} // Centre horizontalement dans le SVG
						y={pathStartY - pathRadius * 0.20} // MODIFIÉ : Revert de la position y pour le texte
						className={styles.pointsRemainingInGauge} // Nouvelle classe pour styliser le texte
						textAnchor="middle" // Ancre le texte au milieu de son point x
						dominantBaseline="middle" // Ancre le texte au milieu de son point y
					>
						{pointsRemaining} {/* Affiche les points restants */}
					</text>
					</svg>
					{/* Titre sous la jauge */}
					<div className={styles.gaugeTitle}>Reste journalier</div>
				</Col>

				{/* Section de droite : doit maintenant contenir les points UTILISÉS */}
				<Col className={styles.summaryItem}>
					<div className={styles.usedPointsValue}>{pointsUsed}</div>
					<div className={styles.usedPointsLabel}>Utilisés aujourd'hui</div>
				</Col>
			</Row>
			</div>
		</div>
	);
}
