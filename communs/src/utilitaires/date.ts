export type DateISO = `${number}-${number}-${number}`; // "YYYY-MM-DD"

export function toDateISO(ts: string | Date): DateISO {
  if (typeof ts === "string") return ts as DateISO; // pas de conversion → pas de décalage
  const yyyy = ts.getFullYear();
  const mm = String(ts.getMonth() + 1).padStart(2, "0");
  const dd = String(ts.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}` as DateISO;
}
 
