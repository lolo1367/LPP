import React from "react";
import styles from "./PuceButton.module.css";
import Tooltip from "@/basicComponent/Tooltip/Tooltip";
import { FaTrashAlt } from "react-icons/fa";
import { MdAddCircle, MdKeyboardArrowRight } from 'react-icons/md';


type PuceButtonProps = {
  icon?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger";
  fonction?: "icon" | "ajouter" | "modifier" | "supprimer";
  disabled?: boolean;
  tooltip?: string;
  tooltipPosition?: "top" | "bottom" | "left" | "right";
  ariaLabel: string;
  size?: "sm" | "md" | "lg"; // nouvelle prop pour gérer la taille
};

const PuceButton: React.FC<PuceButtonProps> = ({
  icon,
  onClick,
  type = "button",
  variant = "primary",
  fonction= "ajouter",
  disabled = false,
  tooltip,
  tooltipPosition = "top",
  ariaLabel,
  size = "md",
}) => {

  const image = () : React.ReactNode => {

    if (fonction === "icon") {
      return icon ;
    } else if (fonction === "ajouter") {
      return <MdAddCircle />;
    } else if (fonction === "modifier") {
      return <MdKeyboardArrowRight />;
    } else {
      return <FaTrashAlt />;
    }
    
    
  }
  const btn = (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${styles.puce} ${styles[size]}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {image()}
    </button>
  );

  return tooltip ? (
    <Tooltip text={tooltip} position={tooltipPosition}>
      {btn}
    </Tooltip>
  ) : (
    btn
  );
};

export default PuceButton;
