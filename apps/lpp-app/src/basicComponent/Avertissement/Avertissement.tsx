import React from "react";
import { FaExclamationTriangle, FaInfoCircle, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import styles from './Avertissement.module.css';

type AvertissementProps = {
  message: string;
  type?: "erreur" | "avertissement" | "info" | "succes";
  onClose?: () => void;
};

const Avertissement: React.FC<AvertissementProps> = ({ message, type = "info", onClose }) => {
  
  const getClassName = () => {
    let classes = [styles.messageContainer]; // base obligatoire

    switch (type) {
      case "erreur":
      	classes.push(styles.erreur);
      case "avertissement":
      	classes.push(styles.avertissement);
      case "succes":
      	classes.push(styles.succes);
      case "info":
      default:
      	classes.push(styles.information);
	  }
	  return classes.join(" ");
  };

  const getIcon = () => {
    switch (type) {
      case "erreur":
        return <FaTimesCircle className={styles.icon}/>;
      case "avertissement":
        return <FaExclamationTriangle className={styles.icon}/>;
      case "succes":
        return <FaCheckCircle className={styles.icon}/>;
      case "info":
      default:
        return <FaInfoCircle className={styles.icon} />;
    }
  };

  return (
    <div className={getClassName()}>
      <div>{getIcon()}</div>
      <div className={styles.message}>{message}</div>
    </div>
  );
};

export default Avertissement;
