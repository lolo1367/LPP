import React, { useState, useEffect } from 'react';
import styles from './InputText.module.css';
import { logConsole } from '@/utils/logger';
import { HiEye, HiEyeOff } from "react-icons/hi"; 


// Définition des types possibles pour les largeurs et hauteurs
type InputWidth = 'small' | 'medium' | 'large';
type InputHeight = 'h1' | 'h2';

interface InputTextProps {
	label: string;
	showLabel?: boolean;
	placeholder: string;
	name: string;
	width: InputWidth;
	height: InputHeight;
	required?: boolean;
	type?: "text" | "password";
	value: string;
	onChange: (value: string) => void;
	onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
	isValid: boolean;
	isTouched: boolean;
	messageErreur?: string;
}

export default function InputText({
	label,
	showLabel = true,
	placeholder,
	name,
	width,
	height,
	required = false,
	type= "text",
	value,
	onChange,
	onBlur,
	isValid,
	isTouched,
	messageErreur
}: InputTextProps) {
	
	// -----------------------------------------------------------------------------
	// Initialisation des variables pour l'affichage
	// -----------------------------------------------------------------------------
	const emoji = "🔡​​​​";
	const viewLog = false;
	const module = "InputText";
	
	logConsole(viewLog, emoji, module, ` ${name} - isValid`, isValid);
	logConsole(viewLog, emoji, module, ` ${name} - messageErreur`, messageErreur);
	logConsole(viewLog, emoji, module, ` ${name} - isValid`, isValid);
	logConsole(viewLog, emoji, module, ` ${name} - isTouched`, isTouched);

	const [isFocused, setIsFocused] = useState(false);	
	const [showPassword, setShowPassword] = useState(false);

	// Déclaration des variables de classes CSS dynamiques
	// On combine les classes du conteneur, de la largeur et de la hauteur
	const containerClasses = [
		styles.container,
		styles[width],
		// styles[height],
	].join(' ');

	const inputClasses = [
		styles['form-field-base'],
		styles[height],
		isValid === true ? styles.valid : '',
		isValid === false ? styles.invalid : ''
	].join(' ');

	const labelClasses = [
		styles.label,
		showLabel === true ? styles.labelVisible : styles.labelInvisible
	].join(' ');
	logConsole(viewLog, emoji, module, 'labelClasses', labelClasses);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.value);
	};

	return (
		<div className={containerClasses}>
				<label className={labelClasses}>
					{label}
					{required && <span className={styles.requiredStar}>*</span>}
				</label>
			
				<div >
					<input
					type={type === "password" ? (showPassword ? "text" : "password") : type}
					className={inputClasses}
					placeholder={placeholder}
					name={name}
					value={value}
					onChange={handleChange}
					onFocus={() => setIsFocused(true)}
					onBlur={(e) => {
						setIsFocused(false);
						onBlur(e);
					}}
						
					/>
					{type === "password" && (
							<button
							  type="button"
							  className={styles.eyeButton}
							  onClick={() => setShowPassword(!showPassword)}
							  tabIndex={-1} // évite le focus clavier
							>
							  {showPassword ? <HiEyeOff /> : <HiEye />}
							</button>
					)}

				</div>
				{/* Afficher un message d'erreur si l'input n'est pas valide */}
				{!isValid && isTouched && (<p className={styles.messageErreur}>{messageErreur}</p>)}   
		</div>
	);
}