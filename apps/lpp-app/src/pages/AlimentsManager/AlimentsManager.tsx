// Imports
import styles from './AlimentsManager.module.css';
import React, { useState, useEffect } from 'react';
import {
    Aliment,
    Unite,
    Categorie,
    AlimentData
} from '@lpp/communs';
import {
    CustomAppException,
    formatAppError
} from '@lpp/communs';

import { logConsole } from '@lpp/communs';
import AlimentForm from "@/popin/AlimentForm/AlimentForm";
import {
    alimentCharger,
    alimentAjouter,
    alimentModifier,
    alimentSupprimer,
    categorieCharger
} from '@/api';

import {
    MdSearch,
    MdMode
 } from "react-icons/md";
import { MdAddCircle } from 'react-icons/md';
 
import {

    uniteCharger
    
 } from '@/api';

export default function AlimentsManager() {
    const emoji = "🍔​";
    const viewLog = false;
    const module = 'AlimentManager';

    // ========================================================================
    // Gestion des données
    // ========================================================================

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [aliments, setAliments] = useState<Aliment[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [erreurChargement, setErreurChargement] = useState<string>('');
    const [showAlimentForm, setShowAlimentForm] = useState<boolean>(false);
    const [selectedAliment, setSelectedAliment] = useState<Aliment | null>(null);
    const [unites, setUnites] = useState<Unite[]>([]);
    const [categories, setCategories] = useState<Categorie[]>([]);
    const [erreurValidation, setErreurValidation] = useState<string>('');

    // =========================================================================
    // Hooks et appels API
    // =========================================================================

    // Chargement initial des données de référence (unités)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const unitesResult = await uniteCharger();
                setUnites(unitesResult);
            
                const categorieResult = await categorieCharger();
                setCategories(categorieResult); 
            }
            catch (error) {
                setErreurChargement("Erreur lors du chargement initial (unite)");
            }
        };
        fetchData();
    }, []);


    // Fonction de recherche déclenchée par la saisie
    const handleSearch = async (newTerm: string) => {
        if (erreurChargement !== '') {
            setErreurChargement('');
        }

        setSearchTerm(newTerm);
        if (newTerm.length > 2) {
            setLoading(true);

            try {

                const result = await alimentCharger(newTerm);
                setAliments(result)
            } 
            catch (err) {
                setAliments([]);
                if (err instanceof CustomAppException) {
                    if (err.erreur) {
                        let message = formatAppError(err.erreur);
                        setErreurChargement(message);
                    } else {
                        setErreurChargement("Erreur inconnue lors du chargement des aliments");
                        logConsole(true, emoji, "❌​ " + module, "Erreur de chargement inconnue", err);
                    }

                } else {
                    setErreurChargement("Erreur inconnue lors du chargement des aliments");
                    logConsole(true, emoji, "❌​ " + module, "Erreur de chargement inconnue", err);

                }
                setAliments([]);
            }
            setLoading(false);
        } else {
            setAliments([]);
        }
    };

    // ===============================================================================
    // Gestion des événements
    // ===============================================================================

    // Gérer l'ajout d'un nouvel aliment
    const handleDemanderAjout = () => {
        setSelectedAliment(null);
        setShowAlimentForm(true);
    };

    // Gérer la modification d'un aliment existant
    const handleDemanderModificaiton = (aliment: Aliment) => {
        setSelectedAliment(aliment);
        setShowAlimentForm(true);
    };

    // Gérer la suppression d'un aliment
    const handleDelete = async (alimentId: number) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet aliment ?")) {
            const result = await alimentSupprimer(alimentId);
            if (result.success) {
                handleSearch(searchTerm); // On relance la recherche pour rafraîchir la liste
            } else {
                setErreurChargement(result.message || 'Erreur lors de la suppression.');
            }
        }
    };

    // Gérer la soumission du formulaire (ajout ou modification)
    const handleSaveAliment = async (alimentData: AlimentData, id: number) => {
        logConsole(viewLog, emoji, module + '/handleSaveAliment', "alimentData", alimentData);
        logConsole(viewLog, emoji, module + '/handleSaveAliment', "id", id);
        if (id === 0) {
            handleAjouterAliment(alimentData);
        } else {
            handleModifierAliment(alimentData,id);
        }
    };

    const handleCloseForm = () => {
        setShowAlimentForm(false);
    };

    // Gérer la soumission du formulaire (ajout ou modification)
    const handleAjouterAliment = async (alimentData: AlimentData) => {
        logConsole(viewLog, emoji, module + '/handleAjouterAliment', "alimentData", alimentData);
   
        const resultat = await alimentAjouter(alimentData);

        if (resultat.success) {
            setShowAlimentForm(false);
            setErreurValidation('');
            handleSearch(searchTerm);
        } else {
            if (resultat.erreur) {
                setErreurValidation(formatAppError(resultat.erreur));
            } else {
                setErreurValidation("Erreur inconnue lors de la création de l'aliment");
            }
           
        }
    };

    // Gérer la soumission du formulaire (ajout ou modification)
    const handleModifierAliment = async (alimentData: AlimentData, id: number) => {
        logConsole(viewLog, emoji, module + '/handlhandleModifierAliment', "alimentData", alimentData);
        logConsole(viewLog, emoji, module + '/handleModifierAliment', "id", id);
    
        const resultat = await alimentModifier(id, alimentData);


        if (resultat.success) {
            setShowAlimentForm(false);
            setErreurValidation('');
            handleSearch(searchTerm);
        } else {
            if (resultat.erreur) {
                setErreurValidation(formatAppError(resultat.erreur));
            } else {
                setErreurValidation("Erreur inconnue lors de la modification de l'aliment");
            }               
        }
    };

    // ===============================================================================
    // Rendu
    // ===============================================================================

    return (
        <div className="page-container">
            <div className="page-card">     
                <div className="page-header">
                    <div className='page-title'>Gestion des Aliments</div>

                </div>
                <div className="page-search-container">
                    <div className='page-search-input-wrapper'>
                        <MdSearch className="page-search-icon-input"/>
                        <input
                            type="text"
                            placeholder="Rechercher un aliment..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="page-search-input"
                        />
                        <button onClick={handleDemanderAjout} className="page-action-bouton">
                            <MdAddCircle />
                        </button>
                    </div>
                </div>
                <div className='page-body'>
                        {loading && <p>Chargement en cours...</p>}
                        {erreurChargement && <p className={styles.error}>{erreurChargement}</p>}
                    
                        {!loading && !erreurChargement && 
                            (<>
                            {aliments.length > 0 ? (
					            <div className="page-scroll-wrapper" >
							        <div className="page-liste">
                                        {aliments.map((aliment) => (
                                            <div
                                                key={aliment.id}
                                                className='page-item-wrapper'>
                                                <div className='page-liste-item'>
                                                    <div className={styles.points}>
                                                        {aliment.points}
                                                    </div>		
                                                    
                                                    <div className={styles.details}>
                                                        <div className={styles.nom}>{aliment.nom}</div>
                                                        <div className={styles.portion}>{aliment.quantite}  {aliment.unite}</div>
                                                    </div>
                                                    <button className='page-liste-action-bouton' onClick={() => handleDemanderModificaiton (aliment)}>
												        <MdMode /> {/* Icône de flèche droite */}
											        </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) :
                            ( 
                                <div className='page-liste-absence-item'>Aucun aliment trouvé. Saisissez au moins 3 caractères pour lancer la recherche</div>    
                            )}
                                
                         
                            </>
                            )
                        }
                    
                </div>
                <div className='page-footer'></div>

                <AlimentForm
                    show={showAlimentForm}
                    aliment={selectedAliment}
                    unites={unites}
                    categories={categories}
                    erreurValidation={erreurValidation}
                    onValider={handleSaveAliment}
                    onClose={handleCloseForm}
            />
            </div>
        </div>
    );
}