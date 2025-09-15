import styles from './ProfilManager.module.css';


import React, { useState, useEffect } from 'react';

import { Utilisateur,UtilisateurData, logConsole,formatAppError, CustomAppException } from '@ww/reference';
import { useAuthStore } from '@/store/authStore';
import PuceButton from '@/basicComponent/PuceButton/PuceButton';
import ProfilForm from '@/popin/ProfilForm/ProfilForm';
import { utilisateurModifier, utilisateurCharger } from '@/api';

type FieldName = keyof Utilisateur;

export default function ProfilManager() { 

   // -----------------------------------------------------------------------------
   // Initialisation des variables pour l'affichage
   // -----------------------------------------------------------------------------
   const emoji = "😎​​​​";
   const viewLog = true;
   const module = "ProfilManager";

   // ============================================================================
   // Gestion des etats
   //=============================================================================
   const util: any = useAuthStore(state => state.utilisateur);
   

  
   const [field, setField] = useState<FieldName>('nom');
   const [showProfilForm, setShowProfilForm] = useState<boolean>(false);   
   const [erreurValidation, setErreurValidation] = useState<string>('');
   const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);
   const [erreurChargement, setErreurChargement] = useState<string>('');
   
   // ============================================================================
   // UseEffect
   // ============================================================================
   useEffect(() => {

      const fetchData = async () => {
         try {

            const result = await utilisateurCharger(undefined, util.id);
            logConsole(viewLog, emoji, "module", "result", result);
            if (result.length >= 1) {
               setUtilisateur(result[0]);
            } else {
               setUtilisateur(null);
            }
         }
         catch (err) {
            setUtilisateur(null);
            if (err instanceof CustomAppException) {
               if (err.erreur) {
                  let message = formatAppError(err.erreur);
                  setErreurChargement(message);
               } else {
                  setErreurChargement("Erreur inconnue lors du chargement des données du profil");
                  logConsole(true, emoji, "❌​ " + module, "Erreur de chargement inconnue", err);
               }

            } else {
               setErreurChargement("Erreur inconnue lors du chargement des aliments");
               logConsole(true, emoji, "❌​ " + module, "Erreur de chargement inconnue", err);

            }
         }
      }; 
      fetchData();
   }, [])

   // ============================================================================
   // Evénement
   // ============================================================================
   const handleDemanderModification = (data: FieldName) => {
      logConsole(viewLog, emoji, module + '/handleDemanderModification', "data", data);
      setField(data);  
      setShowProfilForm(true);
   };

   // Gérer la soumission du formulaire (ajout ou modification)
   const handleSaveProfil  = async (data : UtilisateurData, id: number) => {
      logConsole(viewLog, emoji, module + '/handleSaveUtilisateur', "utilisateur", utilisateur);
      const resultat = await utilisateurModifier(id, data);


      if (resultat.success) {
          setShowProfilForm(false);
          setErreurValidation('');
      } else {
          if (resultat.erreur) {
              setErreurValidation(formatAppError(resultat.erreur));
          } else {
              setErreurValidation("Erreur inconnue lors de la modification des données du profil");
          }               
      }

   };

   const handleCloseForm = () => {
      setShowProfilForm(false);
  };


   // Rendu

   if (utilisateur)  

   return (
      <div className="page-container">
         <div className="page-card">     
            <div className="page-header">
               <div className='page-title'>Mon profil</div>
            </div>
            <div className={styles.blocData}>
               <div className={styles.titre}>Email</div>
               <div className={styles.action}>
                  <div className={styles.data}>{utilisateur?.email}</div>
                  <PuceButton
                     variant='secondary' fonction='modifier'
                     onClick={() => handleDemanderModification('email')}
                     tooltip="Modifier l'aliment" ariaLabel='Modifier' size='lg'
                  />
               </div>
            </div>
            <div className={styles.blocData}>
               <div className={styles.titre}>Mot de passe</div>

               <div className={styles.action}>
                  <div className={styles.data}>*****</div>
                  <PuceButton
                     variant='secondary' fonction='modifier'
                     onClick={() => handleDemanderModification('mdp')}
                     tooltip="Modifier l'aliment" ariaLabel='Modifier' size='lg'
                  />
               </div>
            </div>
               <div className={styles.blocData}>
                  <div className={styles.titre}>Nom</div>
                  <div className={styles.action}>
                     <div className={styles.data}>{utilisateur?.nom}</div>
                     <PuceButton
                        variant='secondary' fonction='modifier'
                        onClick={() => handleDemanderModification('nom')}
                        tooltip="Modifier l'aliment" ariaLabel='Modifier' size='lg'
                     />
               </div>
            </div>
            <div className={styles.blocData}>
               <div className={styles.titre}>Prénom</div>
               <div className={styles.action}>
                  <div className={styles.data}>{utilisateur?.prenom}</div>
                  <PuceButton
                     variant='secondary' fonction='modifier'
                     onClick={() => handleDemanderModification('prenom')}
                     tooltip="Modifier l'aliment" ariaLabel='Modifier' size='lg'
                  />
               </div>
               
            </div>
            <div className={styles.blocData}>
                  <div className={styles.titre}>Sexe</div>
                  <div className={styles.action}>
                  <div className={styles.data}>{utilisateur?.sexe === 'F' ? 'Femme' : 'Homme'}</div>
                     <PuceButton
                        variant='secondary' fonction='modifier'
                        onClick={() => handleDemanderModification('sexe')}
                        tooltip="Modifier l'aliment" ariaLabel='Modifier' size='lg'
                     />
               </div>
            </div>
               <div className={styles.blocData}>
                  <div className={styles.titre}>Taille</div>
                  <div className={styles.action}>
                     <div className={styles.data}>{utilisateur?.taille} cm</div>
                     <PuceButton
                        variant='secondary' fonction='modifier'
                        onClick={() => handleDemanderModification('taille')}
                        tooltip="Modifier l'aliment" ariaLabel='Modifier' size='lg'
                     />
               </div>
            </div>
            <div className={styles.blocData}>
                  <div className={styles.titre}>Bonus hedomadaire</div>
                  <div className={styles.action}>
                     <div className={styles.data}>{utilisateur?.point_bonus}</div>
                     <PuceButton
                        variant='secondary' fonction='modifier'
                        onClick={() => handleDemanderModification('point_bonus')}
                        tooltip="Modifier l'aliment" ariaLabel='Modifier' size='lg'
                     />
               </div>
            </div>
            <div className={styles.blocData}>
                  <div className={styles.titre}>Points quotidien</div>
                  <div className={styles.action}>
                     <div className={styles.data}>{utilisateur?.point_jour}</div>
                     <PuceButton
                        variant='secondary' fonction='modifier'
                        onClick={() => handleDemanderModification('point_jour')}
                        tooltip="Modifier l'aliment" ariaLabel='Modifier' size='lg'
                     />
               </div>
            </div>

            <ProfilForm
               show={showProfilForm}
               utilisateur={utilisateur}
               field={field}
               erreurValidation={erreurValidation}
               onValider={handleSaveProfil}
               onClose={handleCloseForm}
            />
         </div>
      </div>
   );
}
