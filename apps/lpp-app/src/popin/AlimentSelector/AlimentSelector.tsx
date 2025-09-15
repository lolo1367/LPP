	import React, { useState, useEffect } from 'react';
	import { Modal } from 'react-bootstrap';
	import Tabs from '@/basicComponent/Tabs/Tabs';
	import {
		Aliment,
		Repas,
		AlimentRecent
	} from '@lpp/communs';


	import styles from './AlimentSelector.module.css';
	import { IoAddCircle, IoCheckmarkCircleSharp } from "react-icons/io5";
	import Button from '@/basicComponent/Button/Button';

	import {
		MdSearch,
		MdQrCodeScanner
	} from "react-icons/md";
	
	import { BiBarcodeReader } from "react-icons/bi";
	import { format } from "date-fns";
	import { fr } from "date-fns/locale";

	interface AlimentSelectorModalProps {
		show: boolean;
		aliments: Aliment[];
		alimentsRecents:AlimentRecent[] 
		date: Date;
		repas: Repas | null;
		onValider: (aliments: Aliment[]) => void;
		onClose: () => void;
	}

	const AlimentSelectorModal: React.FC<AlimentSelectorModalProps> = ({
		show,
		aliments,
		alimentsRecents,
		date,
		repas,
		onValider,
		onClose
	}) => {
		
		const tabsData = [
			{ id: '1', title: 'Récents' },
			{ id: '2', title: 'Tous', },
			{ id: '3', title: 'Recette',  },

		];
		
		const [searchTerm, setSearchTerm] = useState('');
		const [showScanModal, setShowScanModal] = useState(false);
		const [alimentsAjoutes, setAlimentsAjoutes] = useState<Aliment[]>([]);
		const [activeTab, setActiveTab] = useState<string>(tabsData[0]?.id || '');

		// Définir la liste d'aliments à afficher en fonction de l'onglet actif
		const [displayedAliments, setDisplayedAliments] = useState<Aliment[]>([]);

		// Mise à jour de la liste des aliments disponibles en fonction de la saisie 'serchTerm'
		const filteredAliments = aliments.filter((aliment) =>
			aliment.nom.toLowerCase().includes(searchTerm.toLowerCase())
		);

		// ----------------------------------------------------------------------
		// Hooks
		// ----------------------------------------------------------------------
		useEffect(() => {
			if (show) {
				setSearchTerm('');
				setAlimentsAjoutes([]);

            // Réinitialiser l'onglet actif au premier onglet (Récents) à l'ouverture de la modale
				setActiveTab(tabsData[0]?.id || ''); 		
				
				const listToFilter: Aliment[] = alimentsRecents.map(ar => ar.aliment);
				const filteredList = listToFilter.filter((aliment) =>
					aliment.nom.toLowerCase().includes(searchTerm.toLowerCase())
				);
				setDisplayedAliments(filteredList);

			}
		}, [show]);

		// Mettre à jour la liste affichée lorsque l'onglet actif ou les données changent
		useEffect(() => {
			let listToFilter: Aliment[] = [];
			if (activeTab === '1') {
				 listToFilter = alimentsRecents.map(ar => ar.aliment);
			} else if (activeTab === '2') {
				 listToFilter = aliments;
			} else if (activeTab === '3') {
				 // Logique pour les recettes à venir...
				 listToFilter = []; 
			}
 
			// Filtrer la liste sélectionnée en fonction du terme de recherche
			const filteredList = listToFilter.filter((aliment) =>
				 aliment.nom.toLowerCase().includes(searchTerm.toLowerCase())
			);
			setDisplayedAliments(filteredList);
	  }, [activeTab, aliments, alimentsRecents, searchTerm]);


		// ----------------------------------------------------------------------
		// Gestion des événements
		// ----------------------------------------------------------------------

		// Evenement de sélection d'un aliment
		const handleSelectAliment = (aliment: Aliment) => {

			// Si l'aliment est déjà dans la liste des aliments sélectionnés alors on le retire
			if (alimentsAjoutes.includes(aliment)) {
				setAlimentsAjoutes(prev => prev.filter(ali => ali !== aliment));

			// Sinon on l'ajoute
			} else {

				// Ajout l'identifiant de l'aliment uniquement si ce dernier n'est pas déjà dans le tableau
				setAlimentsAjoutes(prev => (
					prev.includes(aliment) ? prev : [...prev, aliment]
				));
		
			}
			
		};
		
		const handleClose = () => {
			
		}
		// L'expression pour formater la date est placée à l'intérieur de la balise

		const formattedDate = format(date, 'EEEE d MMMM', { locale: fr });
		const FormattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);


		return (
			<>
				<Modal show={show} onHide={onClose} centered scrollable className={styles.modale}>
					{/* HEADER */}
					<Modal.Header className="modal-header">
						<div className="header-left">
							<Button
									variant='secondary'
									onClick={() => onClose()}
							>
								Annuler
							</Button>
						</div>
						<div className="header-center">
							<div className='modal-title'>
								{repas?.nom}
							</div>
							<span className={styles.dateText}>{FormattedDate}</span>
						</div>
						<div className="header-right">
							<Button
								variant="primary"
								onClick={() => onValider(alimentsAjoutes)}
							>
								Ajouter
							</Button>
						</div>
					</Modal.Header>

					{/* BARRE DE RECHERCHE */}
					<div className={styles.zoneRecherche}>
						<div className={styles.searchInputWrapper}>
							<MdSearch className={styles.searchIcon}/>
							<input
								id="zoneRecherche"
								type="text"
								className={styles.searchInput}
								placeholder="Rechercher un aliment"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)} // Mise à jour du filtre
							/>
						</div>
						<button
							type="button"
							className={styles.scanButton}
							onClick={() => setShowScanModal(true)}
							aria-label="Scanner un code barre"
						>
							<BiBarcodeReader	 />
						</button>
					</div>

					{/* ZONE ONGLETS */}
					<div className={styles.zoneTabs}>
						<Tabs
						tabs={tabsData}
						activeTabId={activeTab}
						onTabChange={setActiveTab}
						></Tabs>
					</div>
					

					<Modal.Body className={styles.modalBody}>
						<div className={styles.scrollWrapper} >
								<div className={styles.alimentListe} >
									{displayedAliments.map((aliment) => (

											/* Pour chaque aliment*/
											<div
												key={aliment.id}
												className={styles.alimentWrapper} >

												<div className={styles.alimentItem}>
													<div className={styles.points}>
														{aliment.points}
													</div>		
													
													<div className={styles.details}>
														<div className={styles.nom}>{aliment.nom}</div>
														<div className={styles.portion}>{aliment.quantite}  {aliment.unite}</div>
													</div>
													
													<button
														className={`${styles.addButton} ${
															alimentsAjoutes.includes(aliment) ? styles.confirmButton : ''
														}`}
														onClick={() => handleSelectAliment(aliment)}
														data-bs-toggle="tooltip"
														data-bs-placement="top"
														title="Sélectionner l'aliment à ajouter au journal"									
													>
														{alimentsAjoutes.includes(aliment) ? (
															<IoCheckmarkCircleSharp size={36} />
														) : (
															<IoAddCircle size={36} />
														)}
													</button>
												</div>

											</div>
										))}

										{filteredAliments.length === 0 && (
											<div className="text-center text-muted p-3">Aucun aliment trouvé</div>
										)}
								</div>
						</div>
					</Modal.Body>

				</Modal>

				<Modal show={showScanModal} onHide={() => setShowScanModal(false)} centered>
						<Modal.Header closeButton>
						<Modal.Title>Scanner un code-barre</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						Fonctionnalité à venir... 📷
					</Modal.Body>
					<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowScanModal(false)}>
						Fermer
					</Button>
					</Modal.Footer>
				</Modal>
			</>
		);
	};

	export default AlimentSelectorModal;
