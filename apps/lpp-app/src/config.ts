// src/config.js
import { logConsole } from "@lpp/communs";

const viewLog = false;
const module = "config.ts";
const emoji = "😎​";
logConsole(viewLog,emoji,module,'Debut','-') ;

export const API_BASE = process.env.API_BASE_URL;
export const UNITE_BASE: string = "portion";
export const UTI_ID: number = 1;
logConsole(viewLog,emoji,module,'API_BASE is', API_BASE);
