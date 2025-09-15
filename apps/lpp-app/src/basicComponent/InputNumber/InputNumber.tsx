import React, { useState, useEffect } from 'react';
import styles from '@/basicComponent/InputText/InputText.module.css';
import { logConsole } from '@ww/reference';

// Définition des types
type InputWidth = 'small' | 'medium' | 'large';
type InputHeight = 'h1' | 'h2';
type InputType = 'integer' | 'decimal';

interface InputNumberProps {
   label: string;
   showLabel?: boolean;
   placeholder: string;
   name: string;
   width: InputWidth;
   height: InputHeight;
   step?: number;
   required?: boolean;
   value: number | null ;
   onChange: (value: number | null) => void;
   // La fonction onBlur est gérée par le parent
   onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
   isValid: boolean;
   isTouched: boolean;
   messageErreur?: string;
}

export default function InputNumber({
   label,
   showLabel=true,
   placeholder,
   name,
   width,
   height,
   step,
   required = false,
   value,
   onChange,
   onBlur,
   isValid,
   isTouched,
   messageErreur, 
}: InputNumberProps) {
   const [isFocused, setIsFocused] = useState(false);

      // -----------------------------------------------------------------------------
      // Initialisation des variables pour l'affichage
      // -----------------------------------------------------------------------------
      const emoji = "🔢​​​";
      const viewLog = false;
      const module = "InputNumber";

      logConsole(viewLog, emoji, module, ` ${name} - isValid`, isValid);
      logConsole(viewLog, emoji, module, ` ${name} - messageErreur`, messageErreur);
      logConsole(viewLog, emoji, module, ` ${name} - isValid`, isValid);
      logConsole(viewLog, emoji, module, ` ${name} - isTouched`, isTouched);

      const containerClasses = [
         styles.container,
         styles[width],
      ].join(' ');
   
      const inputClasses = [
         styles['form-field-base'],
         styles[height],
         isValid === true ? styles.valid : '',
         isValid === false ? styles.invalid : '',
         styles['numberInput']
      ].join(' ');
   
      const labelClasses = [
		   styles.label,
		   showLabel === true ? styles.labelVisible : styles.labelInvisible
	   ].join(' ');
	   logConsole(viewLog, emoji, module, 'labelClasses', labelClasses);

      // Gère les changements de la valeur
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
         const inputValue = e.target.value;
         if (inputValue === '') {
            onChange(null);
         } else {
            onChange(Number(inputValue));
         }
      };

      return (
         <div className={containerClasses}>
               <label className={labelClasses   }>
                  {label}
                  {required && <span className={styles.requiredStar}>*</span>}
               </label>
               <input
                  type="number"
                  className={inputClasses}
                  placeholder={placeholder}
                  name={name}
                  step={step}
                  value={value === null  ? '' : value}
                  onChange={handleChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={(e) => {
                        setIsFocused(false);
                        onBlur(e);
                     }
               }
               />
            {/* Afficher un message d'erreur si l'input n'est pas valide */}
               {!isValid && isTouched && <p className={`${styles.messageErreur} ${styles.fullWidth}`}>{messageErreur}</p>}   
         </div>
      );
   }