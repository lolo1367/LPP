import express from "express" ;
import { handleError } from '@ww/reference';
import 'dotenv/config';

const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());



// Sert les fichiers HTML/CSS/JS depuis le dossier public/
app.use(express.static('public'));

// ajout de la route de test
import testDbRouter from "@/routes/testAccesDb"
app.use('/api/test', testDbRouter);

import testNetwork from "@/routes/testNetwork"
app.use('/api/test', testNetwork);

import categoriesRoutes  from './routes/categorie'; // chemin à adapter si besoin
app.use('/api/categorie', categoriesRoutes); // ⬅️ ça rend /categories accessible

console.log("[Module : Server], [Objet : ],[Fonction : ]");
import alimentsRoutes  from './routes/aliment'; // chemin à adapter si besoin
app.use('/api/aliment', alimentsRoutes); // ⬅️ ça rend /categories accessible

import typesRepasRoutes  from './routes/repas';
app.use ('/api/typeRepas',typesRepasRoutes);

import journalAlimentaireRoute  from  './routes/journalAlimentaire' ;
app.use('/api/journalAlimentaire', journalAlimentaireRoute);

import utilisateurRoute  from  './routes/utilisateur' ;
app.use ('/api/utilisateur',utilisateurRoute);

import journauxPoidsRoutes from  './routes/journalPoids' ;
app.use('/api/journalPoids', journauxPoidsRoutes);

import suiviHebdoRoutes from  './routes/suiviHebdo' ;
app.use('/api/suiviHebdo', suiviHebdoRoutes);

import uniteRoutes from  './routes/unite' ;
app.use('/api/unite', uniteRoutes);

import loginRoutes from './routes/login';
app.use('/api/login', loginRoutes);



app.use(handleError);

// Lancer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré : http://localhost:${PORT}`);
});
