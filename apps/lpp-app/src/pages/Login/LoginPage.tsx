//================================================================================================
// Import
//================================================================================================

import styles from './LoginPage.module.css';
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import InputText from '@/basicComponent/InputText/InputText';
import { ErreursFormulaire, TouchedFormulaire } from '@/utils/Form/form';
import { formatAppError, logConsole } from '@ww/reference';
import Button from '@/basicComponent/Button/Button';
import Avertissement from '@/basicComponent/Avertissement/Avertissement';
import { HiOutlineUserCircle } from "react-icons/hi2";

//================================================================================================
// type
//================================================================================================
type FormData = {
	email: string;
	mdp: string;
}

//================================================================================================
// Page
//================================================================================================
export default function LoginPage() {

	//================================================================================================
	// Initialisation des variables poir l'affichage dans la console
	//================================================================================================
	const viewLog = true;
	const emoji = ""
	const module = "LoginPage/"

	//================================================================================================
	// Gestion des données
	//================================================================================================

	// Récupération du login dans le store  
	const login = useAuthStore(s => s.login);

	// ??
	const navigate = useNavigate();

	// Gestion des états
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [erreursFormulaire, setErreursFormulaire] = useState<ErreursFormulaire>({});
	const [touched, setTouched] = useState<TouchedFormulaire>({});
	const [boutonEnabled, setBoutonEnabled] = useState<boolean>(false);	
	const [formData, setFormData] = useState<FormData>({ email: '', mdp: '' });
	const [messageAvertissement, setMessageAvertissement] = useState<string>('');
	

   // =============================================================================
   // Fonction de validation du formulaire
   // =============================================================================
   const validerInput = (name: string, value: any) => { 

		logConsole(viewLog, emoji, module + '/validerInput', `name : ${name}`, `value : ${value}`);
		
		let message: string = '';

		// Mot de passe
		if (name === 'mdp') {
     
			// La regex pour valider les critères du mot de passe
			// ^ Le motif est en début de chaine
			// (?=.*[A-Z]) : C'est une assertion positive (positive lookahead). 
			//       Elle vérifie s'il y a au moins une lettre majuscule ([A-Z]) n'importe où dans la chaîne (.*), sans consommer de caractères.
			// (?=.*\d) : Une autre assertion positive qui vérifie la présence d'au moins un chiffre (\d).
			// (?=.*[^a-zA-Z0-9]) : Une troisième assertion qui vérifie la présence d'au moins un caractère qui n'est pas une lettre (a-zA-Z) ou un chiffre (0-9).
			//       C'est la manière standard de cibler les caractères spéciaux.
			// {10,} : 10 caractères au moins
			// $ Fin de motif
			const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{10,}$/;

			if (!value) {
				message = 'Le mot de passe est obligatoire';
			} else if (!regex.test(value)) {
				message = "le mot de passe doit avoir au moins 10 caractères dont une majuscule, un chiffre et un caractère spécial."
			}
		}

    	// Adresse mail
		if (name === 'email') {
		 
			const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

			if (!value || value.length === 0) {
         	message = "L'adresse mail est obligatoire.";
			} else if (!regex.test(value.trim())) {
				message = "L'adresse mail n'a pas le bon format."
       	}
    	}

		logConsole(viewLog, emoji, module + '/validerInput', `message : ${message}`, ``);
    	setErreursFormulaire(prev => ({ ...prev, [name]: message }));
 	};


	// ====================================================================================
   // Fonction pour vérifier tous les champs du formualaire
   // ====================================================================================
	const validerFormulaire = () => {

		const cles = Object.keys(formData);

		Object.entries(formData).forEach(([cle, valeur]) => {
			validerInput(cle, valeur);
		});
	}

	// ======================================================================================
	// Fonction de l'état du bouton
	// ======================================================================================
	const evaluerEtatBouton = () => {
		
		const etat: boolean = ( formData.email !== '' && formData.mdp !== '' && erreursFormulaire.mdp === "" &&  erreursFormulaire.email === "" );
		logConsole(viewLog, emoji, module + '/evaluerEtatBouton', `formData`, formData);
		logConsole(viewLog, emoji, module + '/evaluerEtatBouton', `erreursForumulaire`, erreursFormulaire);

		logConsole(viewLog, emoji, module + '/evaluerEtatBouton', `etat : ${etat}`, ``);

      setBoutonEnabled(etat);
	}
	
	// =======================================================================================
	// Hook
	// =======================================================================================
	useEffect(() => {



	},[]);

	useEffect(() => {
		evaluerEtatBouton();
		
	}, [formData]);

	// =======================================================================================
	// Evenement
	// =======================================================================================
  	const handleSubmit = async (e: React.FormEvent) => {
   	e.preventDefault();

		const resultat = await login(formData.email, formData.mdp);
	
		if (resultat.success) {
			navigate("/"); // redirection vers page principale
		} else {
			if (resultat.erreur) {
				setMessageAvertissement(formatAppError(resultat.erreur));
		  } else {
				setMessageAvertissement("Erreur inconnue lors de la vérification des informations d'authentification");
		  }		}
	};
  
   const handleBlur = (e : React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      logConsole(viewLog, emoji, module + '/handleBlur', `name`, e.target.name);
      logConsole(viewLog, emoji, module + '/handleBlur', `value`, e.target.value);
      const name  = e.target.name as keyof FormData;
      setTouched(prev => ({ ...prev, [name]: true }));

      validerInput(name, e.target.value);
	};
	
	const handleInputChange = (name: string, value: string | number | null ) => {
      logConsole(viewLog, emoji, module + '/handleInputChange', `name: ${name}`, `value: ${value}`);
      setFormData((prevData) => ({
          ...prevData,
          [name]: value,
      }));

      validerInput(name, value);
	};
	
	const handleMdpOublie = () => {

	}

  return (
	<form onSubmit={handleSubmit}>
		  <div className={styles.loginZone}>
			  
		  	{messageAvertissement && (
				  	<div className={styles.avertissementZone} >
						<Avertissement
               		message={messageAvertissement}
               		type="erreur"
					  />
					</div>
      	)}
			  
			<InputText 
				label='Adresse mail'
				placeholder='Saisir votre adresse mail'
				name='email'
				width='large'
				height='h2'
				required
				value={formData.email}
				onChange={(value) => handleInputChange("email", value)}
				onBlur={handleBlur}
				isValid={!erreursFormulaire.email}
				isTouched={!!touched.email}
				messageErreur={erreursFormulaire.email}
			  />
			  
			<InputText 
				label='Mot de passe'
				placeholder='Saisir votre mot de passe'
				name='mdp'
				type='password'
				width='large'
				height='h2'
				required
				value={formData.mdp}
				onChange={(value) => handleInputChange("mdp", value)}
				onBlur={handleBlur}
				isValid={!erreursFormulaire.mdp}
				isTouched={!!touched.mdp}
				messageErreur={erreursFormulaire.mdp}
			/>

			<Button
				  variant='primary'
				  tooltip="Permet de valider les informations d'authentification"
				  tooltipPosition='bottom'
				  type='submit'
				  disabled={!boutonEnabled}
			>
				<HiOutlineUserCircle></HiOutlineUserCircle>​ Se connecter	  
			</Button>


        </div>
    </form>
  );
}
