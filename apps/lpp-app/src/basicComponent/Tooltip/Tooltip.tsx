import React, { ReactNode, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./Tooltip.module.css";

type TooltipProps = {
  children: ReactNode;
  text: string;
  position?: "top" | "bottom" | "left" | "right";
};

const Tooltip: React.FC<TooltipProps> = ({ children, text, position = "top" }) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible && ref.current && tooltipRef.current) {
      const rect = ref.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      let top = 0;
      let left = 0;

      switch (position) {
        case "top":
          top = rect.top + window.scrollY - tooltipRect.height - 8; // hauteur tooltip
          left = rect.left + window.scrollX + rect.width / 2 - tooltipRect.width / 2;
          break;
        case "bottom":
          top = rect.bottom + window.scrollY + 8;
          left = rect.left + window.scrollX + rect.width / 2 - tooltipRect.width / 2;
          break;
        case "left":
          top = rect.top + window.scrollY + rect.height / 2 - tooltipRect.height / 2;
          left = rect.left + window.scrollX - tooltipRect.width - 8;
          break;
        case "right":
          top = rect.top + window.scrollY + rect.height / 2 - tooltipRect.height / 2;
          left = rect.right + window.scrollX + 8;
          break;
      }

      setCoords({ top, left });
    }
  }, [visible, position]);

  return (
    <>
      <div
        ref={ref}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        style={{ display: "inline-block" }}
      >
        {children}
      </div>

      {visible &&
        createPortal(
          <div
            ref={tooltipRef}
            className={`${styles.tooltip} ${visible ? styles.visible : ""}`}
            style={{
              top: coords.top,
              left: coords.left,
              position: "absolute",
              zIndex: 9999,
            }}
          >
            {text}
          </div>,
          document.body
        )}
    </>
  );
};

export default Tooltip;
