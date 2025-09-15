import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './NavBar.module.css';
import { MdBalance, MdOutlineHome, MdDashboard, MdRestaurant , MdArrowDropDown } from "react-icons/md";
import DropdownMenu from './DropdownMenu';

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  // Fermer le dropdown si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
	  <nav className={styles.navbarCustom}>
		<div className={styles.titreApplication}>Mon application</div>
      <ul className={styles.navList}>
        <li>
          <NavLink className={({ isActive }) => `${styles.navLinkCustom} ${isActive ? styles.active : ''}`} to="/saisieQuotidienne">
            <MdRestaurant  className={styles.menuIcon} />
            <span className={styles.linkText}>Journal</span>
          </NavLink>
        </li>
        <li>
          <NavLink className={({ isActive }) => `${styles.navLinkCustom} ${isActive ? styles.active : ''}`} to="/suiviPoids">
            <MdBalance className={styles.menuIcon} />
            <span className={styles.linkText}>Poids</span>
          </NavLink>
        </li>
        <li>
          <NavLink className={({ isActive }) => `${styles.navLinkCustom} ${isActive ? styles.active : ''}`} to="/alimentsManager">
            <MdDashboard className={styles.menuIcon} />
            <span className={styles.linkText}>Aliments </span>
          </NavLink>
        </li>

        {/* Dropdown */}
        <DropdownMenu />
      </ul>
    </nav>
  );
}

export default Navbar;
