import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { PrivateRoute } from '@/component/PrivateRoute/PrivateRoute';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AlimentsManager from '@/pages/AlimentsManager/AlimentsManager';
import ProfilManager from './pages/ProfilManager/ProfilManager';
import Categories from '@/pages/Categorie/Categories';
import TableauDeBord from '@/pages/TableauDeBord/TableauDeBord';
import JournalPoidsPage from './pages/JournalPoidsPage/JournalPoidsPage';

import Page404 from '@/pages/Page404';
import SaisieQuotidienne from '@/pages/SaisieQuotidienne/SaisieQuotidienne';
import Layout from '@/component/Layout/Layout';
import { logConsole } from '@lpp/communs';
import PageTest from '@/pages/pageTest';

import { useAuthStore } from './store/authStore';
import { useReferenceStore } from './store/referenceStore';
import { useEffect } from "react";
import LoginPage from './pages/Login/LoginPage';
import { Toaster } from 'react-hot-toast';

function App() {
	const viewLog = true;
	const module = "App.tsx";
	const emoji = "💚​";

	logConsole(viewLog, emoji, module, ' ===== Debut =======', '-');

	// ===========================================================================
	// Gestion des variables globales 
	// ===========================================================================
	const token = useAuthStore(state => state.token);
	const utilisateur = useAuthStore(state => state.utilisateur);
	logConsole(viewLog, emoji, module, ' utilisateur', utilisateur);
	const loadReferences = useReferenceStore(state => state.loadReferences);

	useEffect(() => {
	 
		const fetchReference = async () => {
		  try {
			 logConsole(viewLog, emoji, module, "useEffect[loadReference] start", "-");
			 await loadReferences();
		  } catch (err) {
			 logConsole(viewLog, emoji, module + "useEffect[loadReference]", "err", err);
		  }
		};
	 
		fetchReference();
	 }, []);

	useEffect(() => {
		if (!token) return; // pas de token → on attend login
	
		const fetchUser = async () => {
			try {
			const res = await fetch("/api/me", {
				headers: { Authorization: `Bearer ${token}` },
			});
	
			if (!res.ok) {
				// token invalide ou expiré
				console.warn("Token invalide ou expiré");
				useAuthStore.getState().logout();
				return;
			}
	
			const data = await res.json();
			useAuthStore.getState().login(token, data);
	

			} catch (error) {
			console.error("Erreur lors du fetch /me :", error);
			// déconnexion sécurisée
			useAuthStore.getState().logout();
			}
		};
	
		// si user déjà présent, on ne refait pas le fetch
		if (!utilisateur) {	
			fetchUser();
		}
	}, [token, utilisateur]);
	
	return (
		<Router>
			<Toaster position='top-right' />
			<Layout>
			<Routes>

				<Route path="/login" element={<LoginPage />} />

				<Route path="/" element={
					<PrivateRoute>
							<SaisieQuotidienne />
					</PrivateRoute>
				} /> 
				<Route path="/saisieQuotidienne" element={
					<PrivateRoute>
						<SaisieQuotidienne />
					</PrivateRoute>
				} />
				<Route path="/tableauDeBord" element={
					<PrivateRoute>
						<TableauDeBord />
					</PrivateRoute>
				} />
				<Route path="/suiviPoids" element={
					<PrivateRoute>
						<JournalPoidsPage />
					</PrivateRoute>
				} />
				<Route path="/categories" element={
					<PrivateRoute>
						<Categories />
					</PrivateRoute>
				} />
				<Route path="/alimentsManager" element={
					<PrivateRoute>
						<AlimentsManager />
					</PrivateRoute>
				} />
				<Route path="/profil" element={
					<PrivateRoute>
						<ProfilManager />
					</PrivateRoute>
				} />
			{/* <Route path="/" element={<PageTest />} />  */}
				<Route path="*" element={<Page404/>} />
			</Routes>
			</Layout>
		</Router>
	);
	}

	export default App;
