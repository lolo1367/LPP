// src/component/ToolTipInitializer/ToolTipInitializer.tsx
import { useEffect } from 'react';
import { Tooltip } from 'bootstrap';

const TooltipInitializer = () => {
  useEffect(() => {
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(el => new Tooltip(el));
    
    return () => {
      tooltipList.forEach(t => t.dispose());
    };
  }, []);

  return null;
};

export default TooltipInitializer;
