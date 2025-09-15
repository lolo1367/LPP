// src/layout/Footer.js
import React from 'react';

function Footer() {
  return (
    <footer className="bg-light text-center py-2 mt-auto border-top">
      <div className="container">
        <span className="text-muted"><small>&copy; {new Date().getFullYear()} Suivi diététique</small></span>
      </div>
    </footer>
  );
}

export default Footer;
