import styles from './AlimentForm.module.css';

import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'react-bootstrap';
import { log, logConsole } from '@lpp/communs';
import InputText from '@/basicComponent/InputText/InputText';
import InputNumber from '@/basicComponent/InputNumber/InputNumber';
import InputSelect from '@/basicComponent/InputSelect/InputSelect';
import Avertissement from '@/basicComponent/Avertissement/Avertissement';
import { FaExclamationTriangle } from "react-icons/fa";
import { ErreursFormulaire, TouchedFormulaire } from '@/utils/Form/form';
import Button from '@/basicComponent/Button/Button';

import {
   Aliment,
   AlimentData,
   Unite,
   Categorie
} from '@lpp/communs';
import { ThemeConsumer } from 'react-bootstrap/esm/ThemeProvider';
import { forEach } from 'list';
import { da } from 'date-fns/locale';

//================================================================================================
// Déclaration des types et interface
//================================================================================================
interface AlimentFormProps {
	show: boolean;
   aliment: Aliment | null;
   unites: Unite[];
   categories: Categorie[];
   erreurValidation: string ;
	onValider: (alimentData : AlimentData, id: number) => void;
	onClose: () => void;
}


// Aliment par défaut pour initialiser le formulaire d'ajout
const defaultFormData = {
   id: 0,
   nom: '',
   quantite: null,
   unite: '',
   points: null,
   categorieId:'', // Initialisez la catégorie
   calories: null,
   fibres: null,
   proteines: null,
   acideGrasSature: null,
   matieresGrasses: null,
   glucides: null,
   sucres: null,
   sel: null,
   zeroPoint: false,
};

type DefaultFormDataType = typeof defaultFormData;

type FormData = {
  [P in keyof DefaultFormDataType]: DefaultFormDataType[P] extends null ? number | null : DefaultFormDataType[P];
};

   // =============================================================================
   // Initialisation des variables pour l'affichage
   // =============================================================================
   const emoji = "🍆​​";
   const viewLog = true;   
   const module = "AlimentForm";

//===============================================================================================================
// Fonction générique
//===============================================================================================================

// Fonction de conversion d'un aliment vers la structure pour exploiter les données dans le formulaire
const convertToFormData = (aliment: Aliment | null): FormData => {
   
   if (!aliment) return defaultFormData;

   const data: FormData = {
      id: aliment.id,
      nom: aliment.nom,
      quantite: aliment.quantite,
      unite: aliment.unite,
      points: aliment.points,
      categorieId: aliment.categorie.id.toString(),
      calories: aliment.calories,
      fibres: aliment.fibres,
      proteines: aliment.proteines,
      matieresGrasses: aliment.matieresGrasses,
      acideGrasSature: aliment.acideGrasSature,
      glucides: aliment.glucides,
      sucres: aliment.sucres,
      sel: aliment.sel,
      zeroPoint: aliment.zeroPoint
   }
   
   return data;
};

// Fonction de conversion des données du formulaire vers la structure d'un aliment
const convertToAliment = (data: FormData, categories: Categorie[]): AlimentData => {

   // Trouvez l'objet catégorie complet à partir de son ID
   logConsole(true, "=================",'/convertToAliment', `data`, data);
   const selectedCategory = categories.find(cat => cat.id.toString() === data.categorieId) || { id: 0, nom: '' };
   const zeroPoint = (data.points || 0 === 0 ? true : false );
   const aliment: AlimentData = {
      nom: data.nom,
      categorie:  {
         id: parseInt(data.categorieId, 10),
         nom: selectedCategory.nom
      },
      points: data.points || 0,
      quantite: data.quantite || 0,  
      unite: data.unite,
      // Conversion des champs optionnels
      calories: data.calories != null ? data.calories : null,
      fibres: data.fibres != null ? data.fibres : null,
      proteines: data.proteines != null ? data.proteines : null,
      acideGrasSature: data.acideGrasSature != null ? data.acideGrasSature   : null,
      matieresGrasses: data.matieresGrasses != null ? data.matieresGrasses : null,
      glucides: data.glucides != null ? data.glucides : null,
      sucres: data.sucres != null ? data.sucres : null,
      sel: data.sel != null ? data.sel: null,
      zeroPoint : zeroPoint
         
      }
      logConsole(true, "=================",'/convertToAliment', `aliment`, aliment);
   return aliment;
};

/**
 * Calcule les ProPoints WW (ancienne formule publique).
 * @param proteines en grammes
 * @param glucides en grammes
 * @param lipides en grammes
 * @param fibres en grammes
 * @returns nombre de points arrondi à l’entier le plus proche
 */
function calculPoint(
   calories: number,
   acidesGrasSatures: number,
   sucres: number,
   proteines: number,
   fibres: number
 ): number {
   const points =
     calories / 33 + acidesGrasSatures * 0.33 + sucres / 4 - proteines / 10 - fibres/12;
 
   // on arrondit au plus proche
   return Math.round(points);
}
 
function calculSmartPoints(
   calories: number,
   acidesGrasSatures: number,
   sucres: number,
   proteines: number
 ): number {
   const points =
      (calories * 0.0405 + acidesGrasSatures * 0.275 - sucres * 0.12 - proteines * 0.098);
   
   logConsole(viewLog, emoji, module, 'Point smart', points);
 
   // on arrondit au plus proche
   return Math.round(points);
   //return points;
}
 
function calculSmartPoints2(
   calories: number,
   acidesGrasSatures: number,
   sucres: number,
   proteines: number
 ): number {
   const points =
      (calories * 0.0355 + sucres * 0.1212 + acidesGrasSatures * 0.1107 - proteines * 0.0985);
   
   logConsole(viewLog, emoji, module, 'Point smart', points);
 
   // on arrondit au plus proche
   return Math.round(points);
   //return points;
 }
 
 
//  ==========================================================================================
//  Formulaire
//  ==========================================================================================
const AlimentForm: React.FC<AlimentFormProps> = ({
   show,
   aliment,
   unites,
   categories,
   erreurValidation,
   onValider,
   onClose,
}) => {
	


   // =============================================================================
   // Gestion des données
   // =============================================================================
   const [formData, setFormData] = useState<FormData>(defaultFormData);
   const formRef = useRef<HTMLFormElement>(null);
   // const [isformulaireValide, setIsFormulaireValide] = useState<boolean>(false);
   const [afficherAvertissement, setAfficherAvertissement] = useState<boolean>(false);
   const [messageAvertissement, setMessageAvertissement] = useState<string>('');
   const [erreursFormulaire, setErreursFormulaire] = useState<ErreursFormulaire>({});
   const [touched, setTouched] = useState<TouchedFormulaire>({});
   const [isCalculPointActif, setIsCalculPointActif] = useState<boolean>(false);
   //const [isCalculPointSmartActif, setIsCalculPointSmartActif] = useState<boolean>(false);
   const [initialisation, setInitialisation] = useState<boolean>(false);
   const hauteur = 'h2';
   const scrollableRef = useRef<HTMLDivElement>(null);

   // =============================================================================
   // Gestion des données
   // =============================================================================
		
    const uniteOptions = [
      /*{ value: '', label: 'Sélectionner une unite' }, */
      ...unites.map(u => ({
         value: u.unite,
         label: u.unite
      }))
   ];

   const categorieOptions = [
      /* { value: '', label: 'Sélectionner une catégorie' },*/
      ...categories.map(c => ({
          value: c.id.toString(),
          label: c.nom
      }))
   ];

   // =============================================================================
   // Fonction de validation du formulaire
   // =============================================================================
   const validerInput = (name: string, value: any) => { 

      logConsole(viewLog, emoji, module + '/validerInput', `name : ${name}`, `value : ${value}`);
      
      let message: string = '';

      // Nom
      if (name === 'nom') {
         if (!value.trim()) {
            message = 'Le nom est requis.';
         } else if (value.trim().length < 3) {
            message = 'Le nom doit comporter au moins 3 caractères.';
         } else if (value.trim().length > 50) {
            message = 'Le nom ne doit pas comporter plus de 50 caractères.';
         }
      }

      // Quantité
      if (name === 'quantite') {
         if (value === null) {
            message = 'La quantité est requise';
         } else if (Number(value) <= 0) {
            message = 'La quantité doit être un nombre positif';
         } else if (Number(value) > 1000) {
            message = 'La quantité ne peut pas dépasser 1000';
         }
      }

      // Catégorie
      if (name === 'categorieId') {
         if (value === null || value === '')
            message = 'La catégorie est requise';
      }

      // Unite
      if (name === 'unite') {
         if (value === null || value === '')
            message = "L'unite est requise";
      }

      // Point
      if (name === 'points') {
         if (value === null) {
            message = "Le nombre de point est obligatoire"
         } else if (value < 0) {
            message = "Le nombre de point est un nombre positif ou égal à 0"
         }
      }

      // Calories
      if (name === 'calories') {
         if (value < 0) {
            message = "Le nombre de calories est un nombre positif ou égal à 0"
         }
      }

      // Fibres
      if (name === 'fibres') {
         if (value < 0) {
            message = "La quantité de fibres est un nombre positif ou égal à 0"
         }
      }

      // Gludides
      if (name === 'glucides') {
         if (value < 0) {
            message = "La quantité de glucides est un nombre positif ou égal à 0"
         }
      }      

      // Proteines
      if (name === 'proteines') {
         if (value < 0) {
            message = "La quantité de protéines est un nombre positif ou égal à 0"
         }
      }

      // Matières grasses
      if (name === 'matieresGrasses') {
         if (value < 0) {
            message = "La quantité de matières grasses est un nombre positif ou égal à 0"
         }
      }
      // Acides gras sature
      if (name === 'acideGrasSature') {
         if (value < 0) {
            message = "La quantité d'acides gras saturés est un nombre positif ou égal à 0"
         }
      }

      // Sucres
      if (name === 'sucres') {
         if (value < 0) {
            message = "La quantité de sucre est un nombre positif ou égal à 0"
         }
      }

      // Sel
      if (name === 'sel') {
         if (value < 0) {
            message = "La quantité de sel est un nombre positif ou égal à 0"
         }
      }
      
      logConsole(viewLog, emoji, module + '/validerInput', `message : ${message}`, ``);
      setErreursFormulaire(prev => ({ ...prev, [name]: message }));
   };

   // ====================================================================================
   // Fonction d'avaluation de l'état du bouton de calcul des points
   // ====================================================================================
   const evaluerEtatBoutonCalculPoint = () => {
      logConsole(viewLog, emoji, module + '/evaluerEtatBoutonCalculPoint', 'formData', formData);
      const etat: boolean = (
         formData.calories !== null &&
         formData.proteines !== null &&
         formData.glucides !== null &&
         formData.fibres !== null &&
         formData.matieresGrasses !== null);

      setIsCalculPointActif(etat);
      logConsole(viewLog, emoji, module + '/evaluerEtatBoutonCalculPoint', `etat : ${etat}`, ``);
   }

   // const evaluerEtatBoutonCalculPointSmart = () => {
   //    const etat: boolean = (
   //       formData.calories !== null &&
   //       formData.acideGrasSature !== null &&
   //       formData.sucres !== null &&
   //       formData.proteines !== null
   //       && formData.unite === 'g');
   //    setIsCalculPointSmartActif(etat);
   //    logConsole(viewLog, emoji, module + '/evaluerEtatBoutonCalculPointSmart', `etat : ${etat}`, ``);
   // }

   // ====================================================================================
   // Fonction pour vérifier tous les champs du formualaire
   // ====================================================================================
   const validerFormulaire = () => {

      const cles = Object.keys(formData);

      Object.entries(formData).forEach(([cle, valeur]) => {  
         validerInput(cle, valeur);
      });
      logConsole(viewLog, emoji, module + '/validerFormulaire', `erreursFormulaire : ${erreursFormulaire}`, ``);
   }
	 
   // ====================================================================================
   // Hook
   // ====================================================================================

   // SHOW
   useEffect(() => {
      logConsole(viewLog, emoji, module + '/useEffect(show,aliment)', `aliment : ${aliment}`, "");
      logConsole(viewLog, emoji, module + '/useEffect(show,aliment)', `show : ${show}`, "");
      logConsole(viewLog, emoji, module + '/useEffect(show,aliment)', `erreursFormulaire : ${erreursFormulaire}`, "");
			
      if (show) {
         setFormData(convertToFormData(aliment));
         setAfficherAvertissement(false);
         setErreursFormulaire({});
         setTouched({});
         setInitialisation(true);
         validerFormulaire();
         evaluerEtatBoutonCalculPoint();
         // evaluerEtatBoutonCalculPointSmart();
         logConsole(viewLog, emoji, module + '/useEffect(show,aliment)', `Fin initialisation`, "");
      }
   }, [show]);

   // erreurValidation
   useEffect(() => {
      setMessageAvertissement(erreurValidation);
      if (erreurValidation !== '' && scrollableRef.current) {
         scrollableRef.current.scrollTop = 0;
      }
   }, [erreurValidation]);
   
   // FORMDATA
   useEffect(() => {

      logConsole(viewLog, emoji, module + '/checkValues[formData]', "formData", formData);
      logConsole(viewLog, emoji, module + '/checkValues[formData]', `initialisation : ${initialisation}`, "");
      evaluerEtatBoutonCalculPoint();
      // evaluerEtatBoutonCalculPointSmart();

      if (initialisation) {
         validerFormulaire();
      }
   }, [formData]);

   useEffect(() => {
      logConsole(viewLog, emoji, module + '/checkValues[erreursFormulaire]', "erreursFormulaire", erreursFormulaire);
   }, [erreursFormulaire]);

	
   // ======================================================================
   // Gestion des événements
   // ======================================================================

   const handleInputChange = (name: string, value: string | number | null ) => {
      logConsole(viewLog, emoji, module + '/handleInputChange', `name: ${name}`, `value: ${value}`);
      setFormData((prevData) => ({
          ...prevData,
          [name]: value,
      }));

      validerInput(name, value);
   };

   const handleBlur = (e : React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      logConsole(viewLog, emoji, module + '/handleBlur', `name: ${e.target.name}`, ``);
      const name  = e.target.name as keyof FormData;
      setTouched(prev => ({ ...prev, [name]: true }));

      validerInput(name, e.target.value);
   };

   
   const handleSubmit = (e: React.FormEvent) => {
      logConsole(viewLog, emoji, module + '/handleSubmit',"-","")
      e.preventDefault();
      validerFormulaire();

      if (Object.keys(erreursFormulaire).length > 0 ) {
         
         // Construire la chaîne de messages d'erreur
         let messagesErreur = '';

         Object.entries(erreursFormulaire).forEach(([champ, message]) => {
            if (message !== '') {
               messagesErreur += `${message}\n`;
            }
         });

         if (messagesErreur !== '') {
            setMessageAvertissement(messagesErreur);
            setAfficherAvertissement(true);
            return;
         }
      
      } 

      onValider(convertToAliment(formData,categories),formData.id);
      
   };

   const handleCalculerPointNewClick = () => {
      let points: number = 0;

      if (formData.proteines !== null && formData.calories !== null && formData.acideGrasSature !== null && formData.sucres !== null && formData.fibres !== null) {
         points = calculPoint(
            formData.calories,
            formData.acideGrasSature,
            formData.sucres,
            formData.proteines,
            formData.fibres);
         
         setFormData((prevData) => ({
            ...prevData,
            points: points,
         }));
      }           
   }

   const handleCalculerPointSmartClick = () => {
      let points: number = 0;

      if (formData.calories !== null && formData.acideGrasSature !== null && formData.fibres !== null && formData.proteines !== null) {
         points = calculSmartPoints2(
            formData.calories,
            formData.acideGrasSature,
            formData.fibres,
            formData.proteines);
         
         setFormData((prevData) => ({
            ...prevData,
            points: points,
         }));
      }           
   }

   const handleValiderClick = () => {
      logConsole(viewLog, emoji, module + '/handleValiderClick',"avant if","")
      if (formRef.current) {
         logConsole(viewLog, emoji, module + '/handleValiderClick',"après if","")
         formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
   };

   if (!show) {
      return null;
   }

	return (
		<Modal onHide={onClose} show={show} centered scrollable size='lg'>
			<Modal.Header className='modal-header'>
            <div className='header-left'>
               <Button variant='secondary' onClick={onClose}>Annuler</Button>
				</div>
				<div className='headerCenter'>
					<div className='modal-title'>
						{aliment ? 'Modifier un aliment' : 'Ajouter un aliment' }
					</div>
				</div>
            <div className='headerRight'>
               <Button
                  variant='primary'
                  onClick={(e) => handleSubmit(e as unknown as React.FormEvent)}>
                  {aliment ? 'Modifier' : 'Ajouter'}
               </Button>

				</div>
			</Modal.Header>

         <Modal.Body  ref={scrollableRef} >
            {messageAvertissement && (
               <Avertissement
                  message={messageAvertissement}
                  type="erreur"
        />
      )}
            <form ref={formRef} onSubmit={handleSubmit}>
               <div className={styles.formGrid}>
                  
                  {/* Ligne 1 : Nom */}
                  <div className={`${styles.gridItem} `}>
                        <InputText
                           label="Nom"
                           placeholder="Sasir le nom"
                           name='nom'
                           width="large"
                           height="h2"
                           required={true}
                           value={formData.nom}
                           onChange={(value) => handleInputChange('nom', value)}
                           onBlur={handleBlur}
                           isValid={!erreursFormulaire.nom}
                           isTouched={!!touched.nom}
                           messageErreur={erreursFormulaire.nom}                        

                        />
                  </div>

                  {/* Ligne 2 : Catégorie */}
                  <div className={`${styles.gridItem} ${styles['full-width']}`}>
                        <InputSelect
                           label="Catégorie"
                           placeholder="Choisir une catégorie"
                           name="categorieId"
                           options={categorieOptions}
                           value={formData.categorieId}
                           onChange={(value) => handleInputChange('categorieId', value)}
                           onBlur={handleBlur}
                           width="large"
                           height="h2"
                           required={true}
                           isValid={!erreursFormulaire.categorieId}
                           isTouched={!!touched.categorieId}
                           messageErreur={erreursFormulaire.categorieId}
                        />
                  </div>

                  {/* Ligne 3 : Quantité et Unité */}
                  <div className={styles.gridItem}>
                     <div className={styles.twoDataRow}>
                        <InputNumber
                           label="Quantité"
                           placeholder="Saisir la quantité"
                           name= "quantite"
                           width="medium"
                           height="h2"
                           step={1}
                           required={true}
                           value={formData.quantite}
                           onChange={(value) => handleInputChange('quantite', value)}
                           onBlur={handleBlur}
                           isValid={!erreursFormulaire.quantite}
                           isTouched={!!touched.quantite}
                           messageErreur={erreursFormulaire.quantite}
                        />
                        <InputSelect
                           label="Unité"
                           placeholder="Choisir l'unité"
                           name="unite"
                           options={uniteOptions}
                           value={formData.unite}
                           onChange={(value) => handleInputChange('unite', value)}
                           onBlur={handleBlur}
                           width="medium"    
                           height="h2"
                           required={true}
                           isValid={!erreursFormulaire.unite}
                           isTouched={!!touched.unite}
                           messageErreur={erreursFormulaire.unite}
                        />
                     </div>
                  </div>
                  {/* Ligne 4 : Points */}
                  <div className={`${styles.gridItem}`}>
                     <div className={styles.twoDataRow}>
                        <InputNumber
                           label="Points"
                           placeholder="Nombre de point"
                           name= "points"
                           width="medium"
                           height="h2"
                           step={1}
                           required={true}
                           value={formData.points}
                           onChange={(value) => handleInputChange('points', value)}
                           onBlur={handleBlur}
                           isValid={!erreursFormulaire.points}
                           isTouched={!!touched.points}
                           messageErreur={erreursFormulaire.points}
                        />
                        <div className={styles.positionBoutonCalculerPoints}>
                           <Button
                              variant='secondary' 
                              onClick={() => handleCalculerPointNewClick()}
                              disabled={!isCalculPointActif}
                              tooltip="Toutes les informations nutritionelles doivent être renseignées."
                              tooltipPosition='bottom'
                           >                              
                              Calculer les points
                           </Button>
                           {/* <Button
                              variant='secondary'
                              onClick={() => handleCalculerPointSmartClick()}
                              disabled={!isCalculPointSmartActif}
                              tooltip="Accessible si l'unité est le gramme et toutes les informations nutritionelles sont renseignées."
                           >

                              Points smart
                           </Button> */}
                        </div>
                     </div>
                  </div>
                  {/* Ligne 5 : Energie / Calories */}
                  <div className={`${styles.gridItem} `}>
                     <div className={styles.informationsNutritionelles}>
                        Valeurs nutritionnelles (<div className={styles.attentionValeurNutrionelle}><FaExclamationTriangle /></div> pour {formData.quantite} {formData.unite})
                     </div>
                  </div>
                  {/* Ligne 6 : Calories */}
                  <div className={styles.gridItem}>
                     <div className={styles.ligneTitre}>
                        <div className={styles.titreNutrition}>Calories</div>
                        <InputNumber
                           label="Calories"
                           showLabel={false}
                           placeholder="Nombre"
                           name= "calories"
                           width="small"
                           height="h2"
                           step={0.01}
                           required={false}
                           value={formData.calories}
                           onChange={(value) => handleInputChange('calories', value)}
                           onBlur={handleBlur}
                           isValid={!erreursFormulaire.calories}
                           isTouched={!!touched.calories}
                           messageErreur={erreursFormulaire.calories}
                        />
                     </div>
                     {/* Matières grasses */}
                     <div className={styles.ligneTitre}>
                        <div className={styles.titreNutrition}>Matières grasses (g)</div>
                        <InputNumber
                              label=""
                              showLabel= {false}
                              placeholder="Nombre"
                              name= "matieresGrasses"
                              width="small"
                              height="h2"
                              required={false}
                              value={formData.matieresGrasses}
                              onChange={(value) => handleInputChange('matieresGrasses', value)}
                              onBlur={handleBlur}
                              isValid={!erreursFormulaire.matieresGrasses}
                              isTouched={!!touched.matieresGrasses}
                              messageErreur={erreursFormulaire.matieresGrasses}
                        />
                     </div>
                     {/* Acides gras */}
                     <div className={styles.ligneSoustitre}>
                        <div className={styles.sousTitreNutrition}>Acides gras satutés (g)</div>
                        <InputNumber
                           label="dont acides gras saturé"
                           showLabel= {false}
                           placeholder="Nombre"
                           name= "acideGrasSature"
                           width="small"
                           height="h2"
                           step={1}
                           required={false}
                           value={formData.acideGrasSature}
                           onChange={(value) => handleInputChange('acideGrasSature', value)}
                           onBlur={handleBlur}
                           isValid={!erreursFormulaire.acideGrasSature}
                           isTouched={!!touched.acideGrasSature}
                           messageErreur={erreursFormulaire.acideGrasSature}
                        />
                     </div>
                     {/* Glucides */}
                     <div className={styles.ligneTitre}>
                        <div className={styles.titreNutrition}>Glucides (g)</div>
                        <InputNumber
                           label="Glucides"
                           showLabel= {false}
                           placeholder="Nombre"
                           name= "glucides"
                           width="small"
                           height="h2"
                           step={1}
                           required={false}
                           value={formData.glucides}
                           onChange={(value) => handleInputChange('glucides', value)}
                           onBlur={handleBlur}
                           isValid={!erreursFormulaire.glucides}
                           isTouched={!!touched.glucides}
                           messageErreur={erreursFormulaire.glucides}
                        />
                     </div>
                     {/* Sucres */}
                     <div className={styles.ligneSoustitre}>
                        <div className={styles.sousTitreNutrition}>Sucres (g)</div>
                        <InputNumber
                           label="Sucres"
                           showLabel= {false}
                           placeholder="Nombre"
                           name= "sucres"
                           width="small"
                           height="h2"
                           step={0.01}
                           required={false}
                           value={formData.sucres}
                           onChange={(value) => handleInputChange('sucres', value)}
                           onBlur={handleBlur}
                           isValid={!erreursFormulaire.sucres}
                           isTouched={!!touched.sucres}
                           messageErreur={erreursFormulaire.sucres}
                        />
                     </div>
                     {/* fibres */}
                     <div className={styles.ligneSoustitre}>
                        <div className={styles.sousTitreNutrition}>Fibres (g)</div>
                        <InputNumber
                           label="Fibres"
                           showLabel= {false}
                           placeholder="Nombre"
                           name= "fibres"
                           width="small"
                           height="h2"
                           step={0.01}
                           required={false}
                           value={formData.fibres}
                           onChange={(value) => handleInputChange('fibres', value)}
                           onBlur={handleBlur}
                           isValid={!erreursFormulaire.fibres}
                           isTouched={!!touched.fibres}
                           messageErreur={erreursFormulaire.fibres}
                        />
                     </div>
                     {/* PROTEINES */}
                     <div className={styles.ligneTitre}>
                        <div className={styles.titreNutrition}>Protéines (g)</div>
                        <InputNumber
                           label="Protéines"
                           showLabel= {false}
                           placeholder="Nombre"
                           name= "proteines"
                           width="small"
                           height="h2"
                           step={1}
                           required={false}
                           value={formData.proteines}
                           onChange={(value) => handleInputChange('proteines', value)}
                           onBlur={handleBlur}
                           isValid={!erreursFormulaire.proteines}
                           isTouched={!!touched.proteines}
                           messageErreur={erreursFormulaire.proteines}
                        />                    
                     </div>
                     {/* SEL */}
                     <div className={styles.ligneTitre}>
                        <div className={styles.titreNutrition}>Sel (g)</div>
                        <InputNumber
                           label="Sel"
                           showLabel= {false}
                           placeholder="Nombre"
                           name= "sel"
                           width="small"
                           height="h2"
                           step={1}
                           required={false}
                           value={formData.sel}
                           onChange={(value) => handleInputChange('sel', value)}
                           onBlur={handleBlur}
                           isValid={!erreursFormulaire.sel}
                           isTouched={!!touched.sel}
                           messageErreur={erreursFormulaire.sel}
                        />                    
                     </div>
                  </div>

               </div>
            </form>
         </Modal.Body>
		</Modal>
	);
};

export default AlimentForm;