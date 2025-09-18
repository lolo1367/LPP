import styles from './SemaineSelector.module.css';


import React from "react"; // Plus besoin de useState ici, car le composant est contrôlé
import { format, addDays, startOfWeek, subWeeks, addWeeks, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { capitalise } from '@/utils/fonctionBase';
import { DateISO, logConsole, toDateISO } from '@lpp/communs';


// Import des icônes de react-bootstrap-icons
import { CaretLeftFill, CaretRightFill } from 'react-bootstrap-icons'; 

const viewLog = true;
const emoji = "🦕​​";
const file = "SemaineSelectoir" ;

interface SemaineSelectorProps {
	selectedDate: DateISO; // La date actuellement sélectionnée (vient du parent SaisieQuotidienne)
	onDateChange: (newDate: DateISO) => void; // Callback pour notifier le parent d'un changement de date
}

	export default function SemaineSelector({ selectedDate, onDateChange }: SemaineSelectorProps) {

	// La date de référence pour la semaine affichée est maintenant selectedDate via les props.
	// startOfCurrentWeek est calculé à partir de selectedDate.
	const startOfCurrentWeek = startOfWeek(selectedDate, { weekStartsOn: 1 }); // lundi

	// Liste des 7 jours de la semaine en cours, basée sur startOfCurrentWeek
	const joursSemaine = Array.from({ length: 7 }, (_, i) =>
		addDays(startOfCurrentWeek, i)
	);

	// Naviguer vers la semaine précédente
	const goToPreviousWeek = () => {
		const newStart = subWeeks(selectedDate, 1); // Basé sur selectedDate pour le calcul
		onDateChange(toDateISO(newStart)); // Notifie le parent du changement
	};

	// Naviguer vers la semaine suivante
	const goToNextWeek = () => {
		const newStart = toDateISO(addWeeks(selectedDate, 1)); // Basé sur selectedDate pour le calcul
		onDateChange(newStart); // Notifie le parent du changement
	};

	// Gérer le clic sur un jour spécifique
	const handleDayClick = (date: DateISO) => {
		onDateChange(date); // Notifie le parent du jour cliqué
	};

	// Récupération du jour courant pour l'affichage "Aujourd'hui"
	const today = toDateISO(new Date());
		


	return (
		<div className={styles.container}>
			<h5>
			{isSameDay(selectedDate, today)
			? `Aujourd’hui, ${format(today, "EEEE d MMMM", { locale: fr })}`
			: capitalise(format(selectedDate, "EEEE d MMMM", { locale: fr }))
			}
			</h5>

			<div className={styles.joursWrapper}>
			<button
					onClick={goToPreviousWeek}
				>
				<CaretLeftFill size={26} /> 
				</button>
			<div className={styles.jours}>
				{joursSemaine.map((date, index) => {
					const isSelected = isSameDay(toDateISO(date), selectedDate);
					return (
					<div
						key={index}
						className={`${styles.jour} ${isSelected ? styles.actif : ''}`}
						onClick={() => handleDayClick(toDateISO(date))}
						title={format(date, "EEEE d MMMM", { locale: fr })}
					>
						{format(date, "EEEEE", { locale: fr })}
					</div>
					);
				})}
			</div>
			<button onClick={goToNextWeek}>
				<CaretRightFill size={26} /> 
			</button>
			</div>
		</div>
	);
	}
