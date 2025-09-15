import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@/index.css'; //
import '@/styles/modal.css';
import '@/styles/page.css';
import '@/styles/padding-marging.css';

   
import React from 'react';
import ReactDom from 'react-dom/client' ;
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
   throw new Error ('L\'élément #root est introuvable dans le DOM');
}

const root = ReactDom.createRoot(rootElement) ;
root.render(
   <React.StrictMode>
      <App />
  </React.StrictMode>
);
