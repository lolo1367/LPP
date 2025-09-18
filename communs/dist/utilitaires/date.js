"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDateISO = toDateISO;
function toDateISO(ts) {
    if (typeof ts === "string")
        return ts; // pas de conversion → pas de décalage
    const yyyy = ts.getFullYear();
    const mm = String(ts.getMonth() + 1).padStart(2, "0");
    const dd = String(ts.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}
