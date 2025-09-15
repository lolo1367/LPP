import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { MdOutlineSettings, MdKeyboardArrowDown } from 'react-icons/md';
import styles from '@/component/NavBar/NavBar.module.css';
import { useAuthStore } from '@/store/authStore';


const DropdownMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLLIElement>(null);
  const logout = useAuthStore(s => s.logout);

  // Fermer le menu si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    
  }

  return (
    <li ref={menuRef} className={`${styles.navItemDropdown}`}>
      <button
        className={styles.dropdownToggle}
        onClick={() => setOpen(!open)}
      >
        <MdOutlineSettings className={styles.menuIcon} />
        <span className={styles.linkText}>Options</span>
        <MdKeyboardArrowDown
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
        />
      </button>
      {open && (
        <ul className={styles.dropdownMenu}>
          <li>
            <NavLink className={styles.dropdownItem} to="/tableauDeBord">
              Aliments
            </NavLink>
          </li>
          <li className={styles.dropdownDivider} />
          <li>
            <NavLink className={styles.dropdownItem} to="/profil">
              Profil
            </NavLink>
          </li>
          <li className={styles.dropdownDivider} />
          <li>
            <a className={styles.dropdownItem} onClick={handleLogout}>
              Déconnexion
            </a>
          </li>
        </ul>
      )}
    </li>
  );
};

export default DropdownMenu;
