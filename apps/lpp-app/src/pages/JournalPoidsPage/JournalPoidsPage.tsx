// src/pages/JournalPoidsPage.tsx
import styles from './JournalPoidsPage.module.css';


import React, { useState, useEffect } from 'react';
//import { UTI_ID } from '@/config';
import { DateISO, LigneJournalPoids, LigneJournalPoidsData, Resultat,toDateISO } from '@lpp/communs';
import { ligneJournalPoidsAjouter, ligneJournalPoidsCharger, ligneJournalPoidsModifier} from '@/api/journalPoids';
import { logConsole, formatAppError, CustomAppException,Utilisateur } from '@lpp/communs';
import { format } from 'date-fns';
import {startOfMonth,startOfWeek,startOfYear,startOfDay} from '@/utils/date/date'
import InputNumber from '@/basicComponent/InputNumber/InputNumber';
import Button from '@/basicComponent/Button/Button';

import GraphiquePoids from '@/component/GraphiquePoids/GraphiquePoids';
import Avertissement from '@/basicComponent/Avertissement/Avertissement';
import SemaineSelector from '@/component/SemaineSelector/SemaineSelector';
import { isCategoricalAxis } from 'recharts/types/util/ChartUtils';
import {ErreursFormulaire, TouchedFormulaire } from '@/utils/Form/form';
import { is } from 'date-fns/locale';
import { useAuthStore } from '@/store/authStore';

const utilisateur = useAuthStore(state => state.utilisateur);



//================================================================================================
// Déclaration des types et interfaces
//================================================================================================

type FormData = {
   id: number | null;
   utiId: number ;
   date: string;
   poids: number | null;
}

const defaultFormData: FormData = {
   id: null,
   utiId: utilisateur?.id ?? 0,
   date: format(new Date(), 'yyyy-MM-dd'),
   poids: null
}

//=================================================================================================
// Fonctions générique
// ================================================================================================
const convertToFormData = (ligne: LigneJournalPoids | null): FormData => {
   if (!ligne) return defaultFormData;
   
   const data: FormData = {
      id: ligne.id,
      utiId: ligne.uti_id,
      date: ligne.date,
      poids:ligne.poids
   }
   return data;   
}

const convertToLigneJournal = (data: FormData): LigneJournalPoids => {
   const ligne: LigneJournalPoids = {
      id: data.id || 0,
      uti_id: data.utiId || 0,
      date: data.date,
      poids: data.poids || 0
   }
   return ligne;
}

export default function JournalPoidsPage() {

   // =============================================================================
   // Initialisation des variables pour l'affichage
   // =============================================================================
   const emoji = "🏋🏻‍♀️​​​​";
   const viewLog = false;
   const module = "PoidsForm";
   const utilisateur = useAuthStore(state => state.utilisateur);

   // =============================================================================
   // Gestion des données
   // =============================================================================

   const [formData, setFormData] = useState<FormData>(defaultFormData);
   const [selectedDate, setSelectedDate] = useState<DateISO>(toDateISO(new Date()));
   const [erreursFormulaire, setErreursFormulaire] = useState<ErreursFormulaire>({});
   const [touched, setTouched] = useState<TouchedFormulaire>({});
   const [isEnregistrerActif, setIsEnregistrerActif] = useState<boolean>(false);
   const [lignesJournal, setLignesJournal] = useState<LigneJournalPoids[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [erreurChargement, setErreurChargement] = useState<string | null>(null);
   const [startOfData, setStartOfData] = useState<DateISO>(toDateISO(new Date()));
   const [endOfData, setEndOfData] = useState<DateISO>(toDateISO(new Date()));


   const [messageAvertissement, setMessageAvertissement] = useState<string | null >(null);

   const [isPoidsMisAJour, setIsPoidsMisAJour] = useState<boolean>(false);
   const [periode, setPeriode] = useState<'semaine' | 'mois' | 'annee'>('semaine');
   const [isCreation, setIsCreation] = useState<boolean>(true);

   // ============================================================================
   // Fonction 
   // ============================================================================
   
   // Validation des données
   const validerInput = (name: string, value: any) => {
      logConsole(viewLog, emoji, module + '/validerInput', `name : ${name}`, `value : ${value}`);
      
      let message: string = '';

      // Poids
      if (name === 'poids') {
         if (value === null) {
            message = "Le poids est obligatoire"
         } else if (value < 45) {
            message = "Le poids est un nombre positif ou égal à 45"
         }
      }

      logConsole(viewLog, emoji, module + '/validerInput', `message : ${message}`, ``);
      setErreursFormulaire(prev => ({ ...prev, [name]: message }));
   }

   // Evaluation de l'état du bouton Enregistrer
   const evaluerEtatBoutonEnregistrer = () => {
      const etat: boolean = (
         formData.utiId !== null &&
         formData.date !== "" &&
         formData.poids !== null && 
         !erreursFormulaire.poids);
      setIsEnregistrerActif(etat);
      logConsole(viewLog, emoji, module + '/evaluerEtatBoutonEnregistrer', `etat : ${etat}`, ``);
   }

   // Fonction pour vérifier tous les champs du formualaire
   const validerFormulaire = () => {

      const cles = Object.keys(formData);

      Object.entries(formData).forEach(([cle, valeur]) => {  
         validerInput(cle, valeur);
      });
      logConsole(viewLog, emoji, module + '/validerFormulaire', `erreursFormulaire`, erreursFormulaire);
   }

   // =============================================================================
   // Hook
   // =============================================================================

   // selectedDate / isPoidsMisAjour
   useEffect(() => {
      const fetchPoidsData = async () => {
          setLoading(true);
          setErreurChargement(null);
  
          logConsole(true, emoji, module + '/useEffect (selectedDate / isPoidsMisAjour)', `🔴 selectedDate`, selectedDate);
          logConsole(true, emoji, module + '/useEffect (selectedDate / isPoidsMisAjour)', `🔴​ periode`, periode);
  
          // Calcul dateDebut/dateFin selon la période
         let dateDebut: DateISO;
         let date = new Date(selectedDate);
          const dateFin = selectedDate; // toujours la date du jour
  
          if (periode === 'semaine') {
              dateDebut = toDateISO(startOfWeek(date)); // lundi
          } else if (periode === 'mois') {
              dateDebut = toDateISO(startOfMonth(date)); // 1er du mois
          } else {
              dateDebut = toDateISO(startOfYear(date)); // 1er janvier
          }
  
          setStartOfData(dateDebut);
          setEndOfData(dateFin);
  
          logConsole(true, emoji, module + '/useEffect (selectedDate / isPoidsMisAjour)', `💙 dateDebut`, dateDebut);
          logConsole(true, emoji, module + '/useEffect (selectedDate / isPoidsMisAjour)', `💙 dateFin`, dateFin);
  
          try {
              const lignesJournalPoids = await ligneJournalPoidsCharger(formData.utiId, dateDebut, dateFin);
              logConsole(viewLog, emoji, module + '/useEffect (selectedDate / isPoidsMisAjour)', `lignesJournalPoids`, lignesJournalPoids);
  
              // Vérifie si on a déjà un poids pour la date sélectionnée
              const ligneDuJour = lignesJournalPoids.find(l => l.date === format(selectedDate, 'yyyy-MM-dd'));
  
              if (ligneDuJour) {
                  setIsCreation(false);
                  setFormData(convertToFormData(ligneDuJour));
              } else {
                  setIsCreation(true);
                  setFormData({
                      id: null,
                      utiId:utilisateur?.id ?? 0,
                      date: format(selectedDate, 'yyyy-MM-dd'),
                      poids: null
                  });
              }
  
              setLignesJournal(lignesJournalPoids);
              setIsPoidsMisAJour(false);
  
          } catch (error) {
              logConsole(viewLog, emoji + " ❌", module + '/useEffect(selectedDate)', 'error', error);
              if (error instanceof CustomAppException) {
                  setErreurChargement(error.erreur ? formatAppError(error.erreur) : "Erreur lors du chargement du journal de poids");
              } else {
                  setErreurChargement("Erreur lors du chargement du journal de poids.");
              }
          } finally {
              setLoading(false);
          }
      };
  
      fetchPoidsData();
  }, [selectedDate, isPoidsMisAJour, periode]);
  
   // formData
   useEffect(() => {
      logConsole(viewLog, emoji, module + '/checkValues[formData]', "formData", formData);
      evaluerEtatBoutonEnregistrer();
      validerFormulaire();
   
   }, [formData.poids]);

   useEffect(() => {
      logConsole(viewLog, emoji, module + '/checkValues[erreursFormulaire]', "erreursFormulaire", erreursFormulaire);
   }, [erreursFormulaire]);

   // ======================================================================
   // Gestion des événements
   // ======================================================================

   // Input change 
   const handleInputChange = (name: string, value: string | number | null) => {
      logConsole(viewLog, emoji, module + '/handleInputChange', `name: ${name}`, `value: ${value}`);
      setFormData((prevData) => ({
          ...prevData,
          [name]: value,
      }));

      validerInput(name, value);
   };



   // Lose fous
   const handleBlur = (e : React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      logConsole(viewLog, emoji, module + '/handleBlur', `name: ${e.target.name}`, ``);
      const name  = e.target.name as keyof FormData;
      setTouched(prev => ({ ...prev, [name]: true }));

      validerInput(name, e.target.value);
   };


  // Demande enregistrement
   const handleSubmit = async (e: React.FormEvent) => {

      logConsole(viewLog, emoji, module + '/handleSubmit',"-","")
      e.preventDefault(); // Empeche le comportment par defaut
      const poidsData: LigneJournalPoidsData = {
         uti_id: formData.utiId,
         date: formData.date,
         poids: formData.poids || 0
      };

      let resultat: Resultat;
      setMessageAvertissement(null);

      (isCreation ?
         resultat = await ligneJournalPoidsAjouter(poidsData) :
         resultat = await ligneJournalPoidsModifier(formData.id || 0, poidsData))

      if (!resultat.success) {
         if (resultat.erreur) {
            setMessageAvertissement(formatAppError(resultat.erreur));
         } else {
            setMessageAvertissement("Erreur inconnue lors de la création de l'aliment");
         }
      } else {
         setIsPoidsMisAJour(true);
      }
};

  return (
    <div className="page-container">
      <div className="page-card">
         <div className="page-header">
            <div className='page-title'>Suivi du poids</div>
         </div>
			<SemaineSelector
				selectedDate={selectedDate}
				onDateChange={(value) => setSelectedDate(value)} />
        
           <div className={styles.zoneSaisiePoids}>
               {loading && <div className="loadingMessage">Chargement des données...</div>}
               {(messageAvertissement  || erreurChargement ) && (
                  <Avertissement
                     message={messageAvertissement || erreurChargement || 'Pas normal'}
                     type="erreur"
                  />)}
               <form onSubmit={handleSubmit} className={styles.formSaisie}>
                  <InputNumber
                     label='Poids'
                     placeholder='Entrer votre poids'
                     name='poids'
                     step={0.050}
                     height='h2'
                     width='small'
                     required={true}
                     value={formData.poids}
                     isValid={!erreursFormulaire.poids}
                     onChange={(value) => handleInputChange('poids', value)}
                     onBlur={handleBlur}
                     isTouched={!!touched.poids}
                     messageErreur={erreursFormulaire.poids}
                  />
                  <div className={styles.positionBouton}>
                     <Button
                        type="submit"
                        variant='primary'
                        disabled={!isEnregistrerActif}
                        tooltip='Sauvegarder la pesée'
                        >
                        Enregistrer
                     </Button>
                  </div>
            </form>
         </div>

                   {/* Affichage des messages d'erreur ou de chargement */}

        {erreurChargement && <Avertissement message={erreurChargement} type="erreur" />}

        {/* Graphique du poids */}
        <GraphiquePoids
            poidsData={lignesJournal}
            dateDebut={startOfData}
            dateFin={endOfData}
            periode={periode}
            onPeriodeChange={setPeriode}
        />
      </div>
    </div>
  );
}