"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = log;
exports.logErreur = logErreur;
exports.logInformation = logInformation;
exports.logDebut = logDebut;
exports.logConsole = logConsole;
function log(projet, fichier, fonction, prompt, valeur) {
    let message = `[${projet}] [${fichier}], [Fonction : ${fonction}], - ${prompt} : `;
    if (typeof valeur === 'object') {
        try {
            message += JSON.stringify(valeur, null, 2);
        }
        catch {
            message += String(valeur);
        }
    }
    else {
        message += String(valeur);
    }
    console.log(message);
}
function logErreur(projet, fichier, fonction, prompt, valeur) {
    let message = `[${projet} (e)] [${fichier}] / [Fonction : ${fonction}] , - ${prompt} : `;
    if (typeof valeur === 'object') {
        try {
            message += JSON.stringify(valeur, null, 2);
        }
        catch {
            message += String(valeur);
        }
    }
    else {
        message += String(valeur);
    }
    console.log(message);
}
function logInformation(projet, fichier, fonction, prompt, valeur) {
    let message = `[${projet} (i)] ${fichier}] / [Fonction : ${fonction}] , - ${prompt} : `;
    if (typeof valeur === 'object') {
        try {
            message += JSON.stringify(valeur, null, 2);
        }
        catch {
            message += String(valeur);
        }
    }
    else {
        message += String(valeur);
    }
    console.log(message);
}
function logDebut(projet, fichier, fonction) {
    let message = `[${projet} (e)] [${fichier}] / [Fonction : ${fonction}] ============ DEBUT =========== `;
    console.log(message);
}
function logConsole(needLog, emoji, module, prompt, valeur) {
    let now = new Date();
    // Extrait l'heure, les minutes et les secondes
    let hours = String(now.getHours()).padStart(2, '0');
    let minutes = String(now.getMinutes()).padStart(2, '0');
    let seconds = String(now.getSeconds()).padStart(2, '0');
    // Construit la chaîne de l'heure au format HH:MM:SS
    let timeString = `${hours}:${minutes}:${seconds}`;
    if (!needLog)
        return;
    let message = `[${timeString}] - ${emoji} [${module}] - ${prompt} : `;
    if (typeof valeur === 'object') {
        try {
            message += JSON.stringify(valeur, null, 2);
        }
        catch {
            message += String(valeur);
        }
    }
    else {
        message += String(valeur);
    }
    console.log(message);
}
