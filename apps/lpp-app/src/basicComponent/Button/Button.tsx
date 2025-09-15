import React from "react";
import styles from "./Button.module.css";
import Tooltip from "@/basicComponent/Tooltip/Tooltip"; // <-- on importe ton composant Tooltip

type ButtonProps = {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  tooltip?: string; // 👈 nouveau
  tooltipPosition?: "top" | "bottom" | "left" | "right"; // 👈 nouveau
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  tooltip,
  tooltipPosition = "top",
}) => {
  const btn = (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );

  // si on a un tooltip -> on enveloppe le bouton dedans
  return tooltip ? (
    <Tooltip text={tooltip} position={tooltipPosition}>
      {btn}
    </Tooltip>
  ) : (
    btn
  );
};

export default Button;
