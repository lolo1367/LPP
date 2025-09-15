// referenceStore.ts
import { create } from "zustand";
import { logConsole } from "@ww/reference";
import {
	repasCharger,
	uniteCharger,
	alimentCharger,
	categorieCharger
 } from "@/api";

type ReferenceState = {
  typesRepas: any[];
  categories: any[];
  aliments: any[];
  unites: any[];
  loaded: boolean;
  loadReferences: () => Promise<void>;
};

const viewLog = true;
const module = "ReferenceStore.ts";
const emoji = "💛​​";

export const useReferenceStore = create<ReferenceState>((set) => ({
  typesRepas: [],
  categories: [],
  aliments: [],
  unites: [],
  loaded: false,
	loadReferences: async () => {
		console.group("💛 ReferenceStore/loadReferences");
		logConsole(viewLog, emoji, module, ' == Début','=');

		try {
			const repas = await repasCharger();
			logConsole(viewLog, emoji, module, "typesRepas", repas);
	  
			const categories = await categorieCharger();
			logConsole(viewLog, emoji, module, "categories", categories);
	  
			const aliments = await alimentCharger();
			logConsole(viewLog, emoji, module, "aliments", aliments);
	  
			const unites = await uniteCharger();
			logConsole(viewLog, emoji, module, "unites", unites);
	  
			logConsole(viewLog, emoji, module, "== FIN, repas ==", repas);
	  
			set({ typesRepas: repas, categories, aliments, unites, loaded: true });
		} catch (err) {
			if (err instanceof Error) {
			  logConsole(viewLog, emoji, module, "ERREUR", err.message +  err.stack);
			} else {
			  logConsole(viewLog, emoji, module, "ERREUR brute", err);
			}
		} finally {
			console.groupEnd();
		 }
  }
}));
