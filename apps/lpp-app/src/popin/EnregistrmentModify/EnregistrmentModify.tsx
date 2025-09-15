import styles from './EnregistrmentModify.module.css';

import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'react-bootstrap';
import Button from '@/basicComponent/Button/Button';
import { capitalise } from '@/utils/fonctionBase';
import QuantityPicker from '@/basicComponent/QuantityPicker/QuantityPicker';
import { logConsole } from '@/utils/logger';
import { UNITE_BASE } from '@/config';

import {
Repas,
LigneJournalAlimentaireComplet,
Unite
} from '@ww/reference';

import {
format,
isSameDay
} from "date-fns";
import { fr } from "date-fns/locale";

import * as MDIcons from 'react-icons/md';

interface EnregistrementModifyProps {
show: boolean;
ligne: LigneJournalAlimentaireComplet | null;
repasDisponibles: Repas[];
unites: Unite[];
onValider: (ligne : LigneJournalAlimentaireComplet | null) => void;
onClose: () => void;
}

const EnregistrementModify: React.FC<EnregistrementModifyProps> = ({
show,
ligne,
repasDisponibles,
unites,
onValider,
onClose,
}) => {
// -----------------------------------------------------------------------------
// Initialisation des variables pour l'affichage
// -----------------------------------------------------------------------------
const emoji = "📅​";
const viewLog = false ;
const module = "AlimentModify";

    // =============================================================================
    // !!!!!!!!! ATTENTION
    // Il s'agit d'un composant sur une modale, son foncitonnement est le suivant :
    // * le premier chargement (useEffect().[]) se produit lors du chargement du
    //   composant appelant. A ce moment la modale n'est pas visible
    // * Tant que la modale n'est pas visible cela ne sert à rien d'estimer toutes
    //   les données. C'est au moment où elle devient visible que cela est intéressant
    // =============================================================================

    // =============================================================================
    // Gestion des données
    // =============================================================================
    const hasInitialized = useRef(false);  // Pour gérer le fait de faire ou pas un render

    const [dateCourante, setDateCourante] = useState<Date>(new Date());
    const [repasCourant, setRepasCourant] = useState<Repas | null>(null);
    const [pointCourant, setPointCourant] = useState<number>(0);
    const [quantiteCourante, setQuantiteCourante] = useState<number>(0);
    const [unite, setUnite] = useState<string>(UNITE_BASE);
    const [listeUnites, setListeUnites] = useState<string[]>([]);
    const [erreursData, setErreursData] = useState<string[]>([]);
    let ligneModifiee = ligne;


    // Le hook useEffect gère la logique de chargement des données.
    // Il ne s'exécute que lorsque la propriété "show" est modifiée ou ligne est modifié ??
    useEffect(() => {
    	if (show && !hasInitialized.current) {
    		logConsole (viewLog, emoji, module + '/useEffect(ligne,show)', "ligne", ligne);

    		const nouvellesErreurs: string[] = [];

    		if (ligne) {
    			ligneModifiee = ligne;
    			setDateCourante(new Date(ligne.date));
    			setRepasCourant(ligne.repas);
    			setPointCourant(ligne.points);
    			setUnite(ligne.unite);
    			setQuantiteCourante(ligne.quantite);

    			setListeUnites([ligne.aliment.unite]);

    			hasInitialized.current = true;
    		} else {
    			nouvellesErreurs.push('Pas de ligne transmise !');
    		}

    	}

    	if (!show) {
    		hasInitialized.current = false;
    	}
    	}, [show, ligne]);

    // Ce useEffect s'exécute chaque fois que les valeurs d'état changent.
    useEffect(() => {
    	logConsole(viewLog, emoji, module + '/checkValues', "valeurUnites : ", listeUnites);
    	logConsole(viewLog, emoji, module + '/checkValues', "quantiteCourante après mise à jour : ", quantiteCourante);
    	logConsole(viewLog, emoji, module + '/checkValues', "pointCourant après mise à jour : ", pointCourant);
    	logConsole(viewLog, emoji, module + '/checkValues', "unite après mise à jour : ", unite);
    }, [quantiteCourante, pointCourant,unite]);

    // Mise en forme de la date, seulement si elle existe
    const dateFormatte = capitalise(format(dateCourante, 'EEEE d MMMM', { locale: fr })) ;
    const today = new Date();

    // ======================================================================
    // Gestion des événements
    // ======================================================================
    const handleRepasClick = (repas: Repas) => {
    	setRepasCourant(repas);
    	if (ligneModifiee) {
    		ligneModifiee.repas = repas;
    	}
    };

    const handleQuantiteChange = (valeurTransmise: number, uniteTransmise: string) => {

    	logConsole(viewLog, emoji, module + '/handleQuantiteChange', "valeurTransmise", valeurTransmise);
    	logConsole(viewLog, emoji, module + '/handleQuantiteChange', "uniteTransmise", uniteTransmise);

    	if (valeurTransmise !== quantiteCourante && ligne) {
    		const qte = valeurTransmise;
    		const pts = Math.round((qte / ligne.aliment.quantite) * ligne.aliment.points);
    		logConsole(viewLog, emoji, module + '/handleQuantiteChange', "qte", qte);
    		logConsole(viewLog, emoji, module + '/handleQuantiteChange', "pts ", pts);
    		setPointCourant(pts)
    		setQuantiteCourante(qte);
    		if (ligneModifiee) {
    			ligneModifiee.quantite = qte;
    			ligneModifiee.points = pts;
    		}

    	}

    	if (uniteTransmise !== unite) {
    		setUnite(uniteTransmise);
    	}

    };


    return (
    	<Modal onHide={onClose} show={show} centered scrollable>
    		{/**/}
    		<Modal.Header className='modal-header'>
				 <div className='header-left'>
					 <Button variant='secondary' onClick={onClose}>Annuler</Button>
    			</div>
    			<div className='headerCenter'>
    				<div className='modal-title'>
    					Enregistrement
    				</div>
    			</div>
				 <div className='headerRight'>
					 <Button variant='primary' onClick={() =>onValider(ligneModifiee)}>Ok</Button>
    			</div>
    		</Modal.Header>

    		<Modal.Body >
    			<>
    				{/* Section : Aliment */}
    				<div className={styles.section} >
    					<div className={styles.sectionAliment}>
    						{ligne?.aliment && (
    							<>
    								<div className={styles.nomAliment}>{ligne.aliment.nom}</div>
    								<div className={styles.pointAliment}>{pointCourant}</div>
    							</>
    						)}
    					</div>
    				</div>

    				{/* Section portion */}
    				<div className={styles.section} >
    					<div className={styles.titreSection}>Portion consommée</div>
    					<div className={styles.sousSection}>
    						<div className={styles.sectionContainer}>
    							<div className={styles.parts}>
    								<div>Quantité :</div>
    								<div className={styles.unitePart}>
    									<div>{quantiteCourante}</div>
    									<div>  {unite}{quantiteCourante > 1 && unite === "portion" ? "(s)" : ""}</div>
    								</div>
    							</div>
    							<div className={styles.choixPart}>
    								<div>
    									{ <QuantityPicker
    										valeur={quantiteCourante}
    										unites={listeUnites}
    										unite={unite}
    										onChange={handleQuantiteChange}
    									/> }
    								</div>
    							</div>
    						</div>
    					</div>
    				</div>

    				{/* Section repas */}
    				<div className={styles.section} >
    					<div className={styles.titreSection}>Repas ({repasCourant?.nom})</div>
    						<div className={styles.sousSection}>
    							<div className={styles.sectionRepas}>
    									{repasDisponibles.map((r) => {
    										const Icon = MDIcons[r.icone as keyof typeof MDIcons];
    										const isSelected = repasCourant?.id === r.id;

    										return (
    											<button
    											key={r.id}
    											type="button"
    											className={`${styles.boutonRepas} ${isSelected ? styles.boutonRepasCourant : ''}`}
    											onClick={() => handleRepasClick(r)}
    											>
    												{Icon && <Icon className={styles.repasIcon} />}
    												<div className={styles.repasNom}>{r.nom}</div>
    												</button>
    										);
    									})}
    					</div>
    					</div>
    				</div>

    				{/* Section date*/}
    				<div className={styles.section}>
    					<div className={styles.sousSection}>
    						<div className={styles.sectionContainer}>
    							{dateCourante && (
    							<div className={styles.sectionLigne}>
    								<div className={styles.ligneTitre}>Date</div>
    								<div className={styles.ligneValeur}>{isSameDay(dateCourante, today)
    									? `Aujourd’hui`
    									: dateFormatte
    									}
    								</div>
    							</div	>
    							)}
    						</div>
    					</div>
    				</div>

    				{/* Section information complémentaire*/}
    				<div className={styles.section} >
    					<div className={styles.titreSection}>Informations complémentaires</div>
    					<div className={styles.sousSection}>
    						<div className={styles.sectionContainer}>
    						<div className={styles.sectionLigne}>
    								<div className={styles.ligneTitre}>Pour une portion de base</div>
    								<div className={styles.ligneValeur}>{ligne?.aliment.quantite}  {ligne?.aliment.unite	}</div>
    							</div>

    							<div className={styles.sectionLigne}>
    								<div className={styles.ligneTitre}>Calories</div>
    								<div className={styles.ligneValeur}>588</div>
    							</div>
    							<div className={styles.sectionLigne}>
    								<div className={styles.ligneTitre}>Fibres</div>
    								<div className={styles.ligneValeur}>{ligne?.aliment.fibres}</div>
    							</div>
    							<div className={styles.sectionLigne}>
    								<div className={styles.ligneTitre}>Glucides</div>
    								<div className={styles.ligneValeur}>{ligne?.aliment.glucides}</div>
    							</div>
    							<div className={styles.sectionLigne}>
    								<div className={styles.ligneTitre}>protéïnes</div>
    								<div className={styles.ligneValeur}>{ligne?.aliment.proteines}</div>
    							</div>
    							<div className={styles.sectionLigne}>
    								<div className={styles.ligneTitre}>Matières grasses</div>
    								<div className={styles.ligneValeur}>{ligne?.aliment.matieresGrasses}</div>
    							</div>
    							<div className={styles.sectionLigne}>
    								<div className={styles.ligneTitre}>Dont acides gras saturés</div>
    								<div className={styles.ligneValeur}>{ligne?.aliment.acideGrasSature}</div>
    							</div>

    						</div>
    					</div>
    				</div>

    			</>
    		</Modal.Body>
    	</Modal>
    );

};

    export default EnregistrementModify;
