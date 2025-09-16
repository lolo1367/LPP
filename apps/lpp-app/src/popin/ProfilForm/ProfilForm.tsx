import styles from './ProfilForm.module.css';

import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'react-bootstrap';
import { logConsole, Utilisateur, UtilisateurData } from '@lpp/communs';
import InputText from '@/basicComponent/InputText/InputText';
import InputNumber from '@/basicComponent/InputNumber/InputNumber';
import InputSelect, { SelectOption } from '@/basicComponent/InputSelect/InputSelect';
import Avertissement from '@/basicComponent/Avertissement/Avertissement';
import { ErreursFormulaire, TouchedFormulaire } from '@/utils/Form/form';
import Button from '@/basicComponent/Button/Button';


//================================================================================================
// Déclaration des types et interface
//================================================================================================

type FormData = Utilisateur & { mdpNouveau: string, mdpRepat: string };

type FieldName = keyof FormData;

interface AlimentFormProps {
	show: boolean;
   utilisateur: Utilisateur;
   field: FieldName;
   erreurValidation: string ;
	onValider: (utilisateurtData : UtilisateurData, id: number) => void;
	onClose: () => void;
}

type InputConfig<T> = {
   [P in keyof T]: {
      label: string;
      placeholder: string;
      showLabel: boolean;
      type?: "texte" | "number" | "select" | "password";
      required?: boolean;
      regex?: RegExp;  // ✅ Validation par regex
      errorMessage?: string; // message si la regex échoue
      selectData?:SelectOption[];     
   };
};
 
type ChampConfig = InputConfig<FormData>[keyof FormData];

const inputConfig: InputConfig<FormData> = {
   email: {
      label: "Email",
      placeholder: "ex : tdureand@gmail.com",
      showLabel: false,
      type: "texte",
      required: true,
      regex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      errorMessage: "L'adresse mail n'a pas le bon format"
   },
   mdp: {
      label: "Mot de passe actuel",
      placeholder: "ex : rere0!FRETG",
      showLabel: true,
      type: "password",
      required: true,
      regex: /^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{10,}$/,
      errorMessage: "Le mot de passe actuel n'a pas le bon format"
   },
   mdpNouveau: {
      label: "Nouveau mot de passe",
      placeholder: "ex : rere0!FRETG",
      showLabel: true,
      type: "password",
      required: true,
      regex: /^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{10,}$/,
      errorMessage: "Le nouveau mot de passe n'a pas le bon format"
   },
   mdpRepat: {
      label: "Répeter mot de passe",
      placeholder: "ex : rere0!FRETG",
      showLabel: true,
      type: "password",
      required: true,
      regex: /^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{10,}$/,
      errorMessage: "Le nouveau mot de passe n'a pas le bon format"
   },
   nom: {
      label: "Nom",
      placeholder: "ex : Dureand",      
      showLabel: false,
      type: "texte",
      required: true,
   },
   prenom: {
      label: "Prénom",
      placeholder: "ex : Sylvaine",
      showLabel: false,
      type: "texte",
      required: true,
   },
   sexe: {
      label: "Sexe",
      placeholder: "ex : Féminin",
      showLabel: false,
      type: "select",
      required: true,
      selectData: [{
         value: 'F',
         label: 'Femme'
      },
      {
         value: "M",
         label: 'Homme'
      }]         
   },
   taille: {
      label: "Taille (cm)",
      placeholder: "ex : 170",
      showLabel: false,
      type: "number",
      required: true,
   },
   point_bonus: {
      label: "Bonus hendomadaire",
      placeholder: "ex : 30",
      showLabel: false,
      type: "number",
      required: true,
   },
   point_jour: {
      label: "Points journaliers",
      placeholder: "ex : 23",
      showLabel: false,
      type: "number",
      required: true,
   },
   id: {
      label: "Identifiant technique",
      placeholder: "ex : 23",
      showLabel: false,
      type: "number",
      required: true,
   }
 }


// =============================================================================
// Initialisation des variables pour l'affichage
// =============================================================================
const emoji = "🤑​​​";
const viewLog = true;   
const module = "ProfilForm";

//===============================================================================================================
// Fonction générique
//===============================================================================================================

//  ==========================================================================================
//  Formulaire
//  ==========================================================================================
const ProfilForm: React.FC<AlimentFormProps> = ({
   show,
   utilisateur,
   field,
   erreurValidation,
   onValider,
   onClose,
}) => {
	
   // =============================================================================
   // Gestion des données
   // =============================================================================
   const formRef = useRef<HTMLFormElement>(null);
   const [formData, setFormData] = useState<FormData>({
      id: utilisateur.id,
      email: utilisateur.email,
      mdp: utilisateur.mdp,
      mdpNouveau: utilisateur.mdp,
      mdpRepat: utilisateur.mdp,
      nom: utilisateur.nom,
      prenom: utilisateur.prenom,
      sexe: utilisateur.sexe,
      taille: utilisateur.taille,
      point_bonus: utilisateur.point_bonus,
      point_jour: utilisateur.point_jour,
   });
   const [afficherAvertissement, setAfficherAvertissement] = useState<boolean>(false);
   const [messageAvertissement, setMessageAvertissement] = useState<string>('');
   const [erreursFormulaire, setErreursFormulaire] = useState<ErreursFormulaire>({});
   const [touched, setTouched] = useState<TouchedFormulaire>({});
   const [initialisation, setInitialisation] = useState<boolean>(false);
   const [configs, setConfigs] = useState<ChampConfig[]>([inputConfig[field]]);
   const [btnSaveActif, setBtnSaveActif] = useState<boolean>(false);
   const hauteur = 'h2';
   const scrollableRef = useRef<HTMLDivElement>(null);

   // =============================================================================
   // Gestion des données
   // =============================================================================
		
   // =============================================================================
   // Fonction de validation du formulaire
   // =============================================================================
   const validerInput = (name: keyof FormData, value: any) => { 

      logConsole(viewLog, emoji, module + '/validerInput', `name : ${String(name)}`, `value : ${value}`);
      const config = inputConfig[name];      
      let message: string = '';

      // Obligatoire
      if (config.required) {
         if (value === null || value === "" || (typeof value === "string" && value.trim() === "")) {
            message = `${config.label} est requis.`;
         }
      }

      // Regex
      if (!message && config.regex && typeof value === "string") {
         if (!config.regex.test(value.trim())) {
         message = config.errorMessage || `${config.label} n'est pas valide.`;
         }
      }

      // Cas particuliers
      if (!message && name === "mdpRepat") {
         if (formData.mdpNouveau !== value) {
            message = "Les mots de passe ne correspondent pas.";
         }
      }

      if (!message && name === "nom" && value?.length < 3) {
         message = "Le nom doit comporter au moins 3 caractères.";
      }

      if (!message && name === "prenom" && value?.length < 3) {
         message = "Le prénom doit comporter au moins 3 caractères.";
      }
  
      logConsole(viewLog, emoji, module + '/validerInput', `message : ${message}`, ``);

      if (!message) {
         setBtnSaveActif(true);
      } else {
         setBtnSaveActif(false);
      }
      setErreursFormulaire(prev => ({ ...prev, [name]: message }));
   };


   // ====================================================================================
   // Fonction pour vérifier tous les champs du formualaire
   // ====================================================================================
   const validerFormulaire = () => {


      validerInput(field, formData[field]);

      logConsole(viewLog, emoji, module + '/validerFormulaire', `erreursFormulaire : ${erreursFormulaire}`, ``);
   }
	 
   // ====================================================================================
   // Hook
   // ====================================================================================

   // SHOW
   useEffect(() => {
      logConsole(viewLog, emoji, module + '/useEffect(show,utilisateur)', 'utilisateur', utilisateur);
      logConsole(viewLog, emoji, module + '/useEffect(show,utilisateur)', 'field', field);
      logConsole(viewLog, emoji, module + '/useEffect(show,aliment)', `show : ${show}`, "");
      logConsole(viewLog, emoji, module + '/useEffect(show,aliment)', `erreursFormulaire`, erreursFormulaire);
			
      if (show) {
         setAfficherAvertissement(false);
         setErreursFormulaire({});
         setTouched({});
         setInitialisation(true);
         validerFormulaire();

         if (field === "mdp") {
            setConfigs([
              inputConfig.mdp,
              inputConfig.mdpNouveau,
              inputConfig.mdpRepat,
            ]);
          } else {
            setConfigs([inputConfig[field]]);
          }

         logConsole(viewLog, emoji, module + '/useEffect(show,aliment)', `inputConfig[field]`, inputConfig[field]);
            
         logConsole(viewLog, emoji, module + '/useEffect(show,aliment)', `Fin initialisation`, "");
      }
   }, [show, utilisateur,field]);
   
   // FORMDATA
   useEffect(() => {

      if (initialisation) {
         validerFormulaire();
      }
   }, [formData]);

   // erreurValidation
   useEffect(() => {
      setMessageAvertissement(erreurValidation);
      if (erreurValidation !== '' && scrollableRef.current) {
         scrollableRef.current.scrollTop = 0;
      }
   }, [erreurValidation]);

   useEffect(() => {
      logConsole(viewLog, emoji, module + '/checkValues[erreursFormulaire]', "erreursFormulaire", erreursFormulaire);
   }, [erreursFormulaire]);
	
   // ======================================================================
   // Gestion des événements
   // ======================================================================

   const handleInputChange = (name: keyof FormData, value: string | number | null) => {
      // Pour l'affichage dans le log, on convertit en string
      logConsole(viewLog, emoji, module + '/handleInputChange', `name: ${String(name)}`, `value: ${value}`);
    
      // Mise à jour du state
      setFormData((prevData : FormData) => {
        const newData: FormData = {
          ...prevData,
          [name]: value, // TypeScript comprend que 'name' est une clé valide
        };
        return newData;
      });
    
      // Validation de l'input
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
            // setMessageAvertissement(messagesErreur);
            // setAfficherAvertissement(true);
            return;
         }
      
      } 

      const utilisateurData : UtilisateurData = {
         nom: formData.nom || '',
         prenom: formData.prenom || '',
         email: formData.email || '',
         sexe: formData.sexe || '',
         mdp: formData.mdp || '',
         taille: formData.taille || 0,
         point_bonus: formData.point_bonus || 0,
         point_jour: formData.point_jour || 0,
      }

      onValider(utilisateurData,formData.id || 0);
      
   };


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
		<Modal onHide={onClose} show={show} centered scrollable size='sm'>
			<Modal.Header className='modal-header'>

				<div className='headerCenter'>
					<div className='modal-title'>
						{configs[0].label}
					</div>
				</div>
			</Modal.Header>

         <Modal.Body  ref={scrollableRef} className={styles.modalProfilBody}>
            {messageAvertissement && (
               <Avertissement
                  message={messageAvertissement}
                  type="erreur"
        />
      )}
            <form ref={formRef} onSubmit={handleSubmit}>

            {configs.map((config) => {
               const name = (Object.keys(inputConfig) as (keyof FormData)[])
                  .find((key) => inputConfig[key] === config) as keyof FormData;

                  const commonProps = {
                     label: config.label,
                     showLabel: config.showLabel,
                     name: String(name),
                     width: "medium" as const,
                     height: "h2" as const,
                     required: config.required,
                     value: formData[name] !== null ? formData[name].toString() : '',
                     onChange: (value: string | number | null) => handleInputChange(name, value),
                     onBlur: handleBlur,
                     isValid: !erreursFormulaire[String(name)],
                     isTouched: !!touched[String(name)],
                     messageErreur: erreursFormulaire[String(name)],
                  };
               
                  switch (config.type) {
                     case "texte":
                     case "password":
                        return (
                           <InputText
                              key={String(name)}
                              {...commonProps}
                              type={config.type === "password" ? "password" : "text"}
                              placeholder={config.placeholder}
                           />
                        );
               
                     case "number":
                        return (
                           <InputNumber
                              key={String(name)}
                              {...commonProps}
                              value={formData[name] !== null ? Number(formData[name]) : null}
                              placeholder={config.placeholder}
                           />
                        );
               
                     case "select":
                        return (
                           <InputSelect
                              key={String(name)}
                              {...commonProps}
                              options={config.selectData || [{ value: "", label: "" }]}
                              value={formData[name] !== null ? formData[name].toString() : ''}
                              placeholder={config.placeholder}
                           />
                        );
               
                     default:
                        return null;
                  }
               })}
            </form>
         </Modal.Body>

         <Modal.Footer className='modal-footer'>
            <Button variant='secondary' onClick={onClose}>Annuler</Button>
            <Button
               variant='primary'
               disabled={!btnSaveActif}
               onClick={(e) => handleSubmit(e as unknown as React.FormEvent)}>
               Sauvegarder
            </Button>

         </Modal.Footer>
		</Modal>
	);
};

export default ProfilForm;