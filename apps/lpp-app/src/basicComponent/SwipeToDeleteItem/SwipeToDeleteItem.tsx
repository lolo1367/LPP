import React, { useRef, useState } from 'react';
import styles from './SwipeToDeleteItem.module.css';
import { FaTrashAlt } from 'react-icons/fa';

type Props = {
  children: React.ReactNode;
  onDelete: () => void;
  className?: string;
  style?: React.CSSProperties;
};

const SwipeToDeleteItem: React.FC<Props> = ({
  children,
  onDelete,
  className = '',
  style = {}
}) => {
  const startX = useRef<number | null>(null);
  const [translateX, setTranslateX] = useState(0);
  const isMouseDown = useRef(false);

  const handleStart = (x: number) => {
    startX.current = x;
  };

  const handleMove = (x: number) => {
    if (startX.current !== null) {
      const deltaX = startX.current - x;
      if (deltaX > 0) {
        setTranslateX(-Math.min(deltaX, 100)); // max -100px
      }
    }
  };

  const handleEnd = (x: number) => {
    const deltaX = (startX.current ?? 0) - x;
    if (deltaX > 50) {
      onDelete();
    } else {
      setTranslateX(0);
    }
    startX.current = null;
    isMouseDown.current = false;
  };

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => handleEnd(e.changedTouches[0].clientX);

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => {
    isMouseDown.current = true;
    handleStart(e.clientX);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (isMouseDown.current) handleMove(e.clientX);
  };
  const onMouseUp = (e: React.MouseEvent) => {
    if (isMouseDown.current) handleEnd(e.clientX);
  };

  return (
    <div className={styles.swipeWrapper}>
      <div className={styles.swipeBackground}>
        <FaTrashAlt className={styles.trashIcon} />
      </div>
      <div
        className={`${styles.swipeItem} ${className} ${translateX < 0 ? styles.swipeRed : ''}`}
        style={{
          transform: `translateX(${translateX}px)`,
          transition: startX.current === null ? 'transform 0.2s ease' : 'none',
          ...style,
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={() => {
          if (isMouseDown.current) {
            handleEnd(startX.current ?? 0);
          }
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default SwipeToDeleteItem;
