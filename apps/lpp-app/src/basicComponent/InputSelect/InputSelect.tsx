import React, { useState, useEffect } from 'react';
import styles from '@/basicComponent/InputText/InputText.module.css';
import { logConsole } from '@/utils/logger';
import { empty } from 'list';

// Définition des types pour les props du composant
type InputWidth = 'small' | 'medium' | 'large';
type InputHeight = 'h1' | 'h2';

export interface SelectOption {
    value: string;
    label: string;
}

interface InputSelectProps {
    label: string;
    placeholder: string; // La prop placeholder est ajoutée ici    
	showLabel?: boolean;
    name: string;
    options: SelectOption[];
    width: InputWidth;
    height: InputHeight;
    required?: boolean;
    value: string;
    onChange: (value: string) => void;
    onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void;
    isValid: boolean;
    isTouched: boolean;
    messageErreur?: string;
}

export default function InputSelect({
    label,
    placeholder, // La prop placeholder est récupérée ici
    showLabel = true,
    name,
    options,
    width,
    height,
    required = false,
    value,
    onChange,
    onBlur,
    isValid,
    isTouched,
    messageErreur
}: InputSelectProps) {

    // -----------------------------------------------------------------------------
    // Initialisation des variables pour l'affichage
    // -----------------------------------------------------------------------------
    const emoji = "↕️​​";
    const viewLog = false;
    const module = "InputSelect";

    logConsole(viewLog, emoji, module, ` ${name} - isValid`, isValid);
    logConsole(viewLog, emoji, module, ` ${name} - messageErreur`, messageErreur);
    logConsole(viewLog, emoji, module, ` ${name} - isValid`, isValid);
    logConsole(viewLog, emoji, module, ` ${name} - isTouched`, isTouched);    

    const [isFocused, setIsFocused] = useState(false);
   
    // La validation est gérée directement sans état local 'isValid'
    
    const containerClasses = [
        styles.container,
        styles[width],
        // styles[height],
    ].join(' ');
  
    const selectClasses = [
        styles['form-field-base-select'],
        value === '' ? styles['placeholder-active'] : '',
        styles[height],
        styles.input, // On réutilise la classe 'input' pour le style
        isValid ? styles.valid : styles.invalid
    ].join(' ');

    const labelClasses = [
		styles.label,
		showLabel === true ? styles.labelVisible : styles.labelInvisible
	].join(' ');
	logConsole(viewLog, emoji, module, 'labelClasses', labelClasses);


    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        logConsole(viewLog, emoji, module, "e.target.value", e.target.value);
        onChange(e.target.value);
    };

    return (
        <div className={containerClasses}>
			<label className={labelClasses}>
                {label}
                {required && <span className={styles.requiredStar}>*</span>}
            </label>
            <select
                className={selectClasses}
                value={value}
                name={name}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                onBlur={(e) => {
                    setIsFocused(false);
                    onBlur(e);
                }}
            >
                {/* L'option placeholder est ajoutée ici */}
                <option value="" disabled>
                    {placeholder}
                </option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                    ))}
            </select>
        </div>
    );
}