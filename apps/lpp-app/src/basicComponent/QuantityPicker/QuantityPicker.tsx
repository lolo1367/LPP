import React, { useRef, useEffect, useState } from 'react';
import styles from './QuantityPicker.module.css';

import { logConsole } from '@/utils/logger';

interface QuantityPickerProps {
	valeur: number;
	unites: string[];
	unite: string;
	onChange: (valeur: number, unite: string) => void;
}

interface ValeurFraction {
	nom: string; 
	valeur: number;
}

const QuantityPicker: React.FC<QuantityPickerProps> = ({ valeur, unites, unite, onChange }) => {
		
	// Constantes pour les logs
	const viewLog = true;
	const emoji = "🏹";
	const module = "Quantitypicker";

	// Constante pour les zones de saisie	
	const ITEM_HEIGHT = 50;
	const VISIBLE_VALEUR_ITEMS = 5;
	const VISIBLE_UNITE_ITEMS = 3;
	const CONTAINER_VALEUR_HEIGHT = ITEM_HEIGHT * VISIBLE_VALEUR_ITEMS;
	const CONTAINER_UNITE_HEIGHT = ITEM_HEIGHT * VISIBLE_UNITE_ITEMS;

	// Ref	
	const valeurEntiereRef = useRef<HTMLDivElement>(null!);
	const valeurFractionRef = useRef<HTMLDivElement>(null!);
	const uniteRef = useRef<HTMLDivElement>(null!);
	const isProgrammaticScroll = useRef(false);

	// Listes
	const valeursEntieres = [
		...Array.from({ length: 500 }, (_, i) => i * 1),
		/* ...Array.from({ length: 58 }, (_, i) => 10 + i * 5), */
	];

	const valeursFraction: ValeurFraction[] = [
		{ nom: '-', valeur: 0 },
		{ nom: '1/8', valeur: 0.125 },
		{ nom: '1/4', valeur: 0.250 },
		{ nom: '1/3', valeur: 0.333 },
		{ nom: '3/8', valeur: 0.375 },
		{ nom: '1/2', valeur: 0.500 },
		{ nom: '5/8', valeur: 0.625 },
		{ nom: '2/3', valeur: 0.666 },		
		{ nom: '3/4', valeur: 0.750 },
		{ nom: '7/8', valeur: 0.875 },
	];

	// Initialisation des états avec des valeurs par défaut
	const [valeurEntiere, setValeurEntiere] = useState(0);
	const [valeurFraction, setValeurFraction] = useState(0);
	const [idxE, setIdxE] = useState(0);
	const [idxF, setIdxF] = useState(0);
	const [idxU, setIdxU] = useState(0);
	
	const [readyCount, setReadyCount] = useState(0);

	const onColumnReady = () => setReadyCount(c => c + 1);

	// useEffect pour l'initialisation et la synchronisation
	useEffect(() => {
		// Calcul des index et des valeurs
		const entiere = Math.trunc(valeur);
		const fraction = +(valeur - entiere).toFixed(3);

		const indexE = valeursEntieres.indexOf(entiere);
		const indexF = Math.max(0, valeursFraction.findIndex(f => f.valeur === fraction));
		const indexU = Math.max(0, unites.indexOf(unite));

		// Mise à jour des états
		setValeurEntiere(entiere);
		setValeurFraction(fraction);
		setIdxE(indexE);
		setIdxF(indexF);
		setIdxU(indexU);

		// Défilement vers les positions cibles
		scrollToIndex(valeurEntiereRef, indexE);
		scrollToIndex(valeurFractionRef, indexF);
		scrollToIndex(uniteRef, indexU);

	}, [valeur, unite]); // Le tableau de dépendances contient les props qui, si elles changent, doivent déclencher une mise à jour


	// Check des useState
	useEffect(() => {
		logConsole(viewLog, emoji, module + '/checkUseState', "- valeurEntiere", valeurEntiere);
		logConsole(viewLog, emoji, module + '/checkUseState', "- valeurFraction", valeurFraction);
		logConsole(viewLog, emoji, module + '/checkUseState', "- unite", unite);
		logConsole(viewLog, emoji, module + '/checkUseState', "- readyCount", readyCount);

	},[valeurEntiere,valeurFraction,unite,readyCount]);	
	// util
	const scrollToIndex = (
		ref: React.RefObject<HTMLDivElement | null>,
		index: number
	) => {
		
		logConsole(viewLog, emoji, module + '/scrollToIndex', "index", index);
		if (!ref.current || index < 0) return;
	 
		const target = index * ITEM_HEIGHT;
		logConsole(viewLog, emoji, module + '/scrollToIndex', "target", target);
		isProgrammaticScroll.current = true;
	 
		// Scroll instantané pour éviter les positions intermédiaires
		ref.current.scrollTop = target;
	 
		// Attendre d'être *vraiment* à la bonne position
		const check = () => {
		  if (!ref.current) return;
		  const delta = Math.abs(ref.current.scrollTop - target);
		  if (delta <= 1) {
			 isProgrammaticScroll.current = false;
		  } else {
			 requestAnimationFrame(check);
		  }
		};
		requestAnimationFrame(check);
	};
	
	// handlers
	const onScrollEntier = () => {
		onColumnReady(); // Informe que cette colonne a fini son premier rendu
		const el = valeurEntiereRef.current;
		if (!el || isProgrammaticScroll.current) return;
		const idx = Math.round(el.scrollTop / ITEM_HEIGHT);
		const safe = Math.min(Math.max(0, idx), valeursEntieres.length - 1);
		const newEnt = valeursEntieres[safe];
		if (newEnt !== valeurEntiere) {
			setValeurEntiere(newEnt);
			onChange(newEnt + valeurFraction, unite);
		}
	};

	const onScrollFraction = () => {
		onColumnReady();
		const elementHTML = valeurFractionRef.current;
		
		if (!elementHTML || isProgrammaticScroll.current) return;

		const position = elementHTML.scrollTop;
		logConsole(viewLog, emoji, '/onScrollFraction', "position", position);
		
		const idx = Math.round(position / ITEM_HEIGHT);
		logConsole(viewLog, emoji, '/onScrollFraction', "idx", idx);

		const safe = Math.min(Math.max(0, idx), valeursFraction.length - 1);
		logConsole(viewLog, emoji, '/onScrollFraction', "safe", safe);

		const newFrac = valeursFraction[safe].valeur;
		if (newFrac !== valeurFraction) {
			setValeurFraction(newFrac);
			onChange(valeurEntiere + newFrac, unite);
		}
	};

	const onScrollUnite = () => {
		onColumnReady();
		const el = uniteRef.current;
		if (!el || isProgrammaticScroll.current) return;
		const idx = Math.round(el.scrollTop / ITEM_HEIGHT);
		const safe = Math.min(Math.max(0, idx), unites.length - 1);
		const newU = unites[safe];
		if (newU !== unite) {
			onChange(valeurEntiere + valeurFraction, newU);
		}
	};
		
	// rendu
	return (
		<div className={styles.pickerWrapper}>
			<div className={styles.pickerOverlay} />

			{/* Colonne entier */}
			<div
				ref={valeurEntiereRef}
				className={`${styles.pickerContainerValeur} ${styles.colValeur}`}
				onScroll={onScrollEntier}
				aria-label="valeur entière"
			>
				{valeursEntieres.map(v => (
					<div
						key={v}
						className={`${styles.pickerItem} ${v === valeurEntiere ? styles.pickerItemActive : ''}`}
					>
						{v}
					</div>
				))}
			</div>

			{/* Colonne fraction */}
			<div
				ref={valeurFractionRef}
				className={`${styles.pickerContainerValeur} ${styles.colValeur}`}
				onScroll={onScrollFraction}
				aria-label="valeur fraction"
			>
				{valeursFraction.map(f => (
					<div
						key={f.valeur}
						className={`${styles.pickerItem} ${f.valeur === valeurFraction ? styles.pickerItemActive : ''}`}
					>
						{f.nom}
					</div>
				))}
			</div>

			{/* Colonne unité */}
			<div
				ref={uniteRef}
				className={`${styles.pickerContainerUnite} ${styles.colUnite}`}
				onScroll={onScrollUnite}
				aria-label="unité"
			>
				{unites.map(u => (
					<div
						key={u}
						className={`${styles.pickerItem} ${u === unite ? styles.pickerItemActive : ''}`}
					>
						{u}
					</div>
				))}
			</div>
		</div>
	);
}
	
export default QuantityPicker;
