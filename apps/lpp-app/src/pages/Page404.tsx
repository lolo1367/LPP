import React from 'react';
import { Link } from 'react-router-dom';

function Page404() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: '60vh' }}>
      <h1 className="display-4 text-danger mb-3">404</h1>
      <p className="lead mb-4">Oups ! La page que vous cherchez n'existe pas.</p>
      <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
    </div>
  );
}

export default Page404;
