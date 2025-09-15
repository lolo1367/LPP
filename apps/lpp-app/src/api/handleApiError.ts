import { isAppError, CustomAppException, Resultat } from "@ww/reference";
import { logConsole } from "@ww/reference";

export function handleApiCriticalError(error: any, context: string = ""): never {
  const emoji = "🌷​​​​";
  const viewLog = true;

  logConsole(viewLog, emoji + " ❌", context, 'error', error);

  // 1️⃣ Si backend renvoie un AppError
  if (error.response?.data && isAppError(error.response.data)) {
    const retour: Resultat = {
      success: false,
      message: error.response.data.message || "",
      erreur: error.response.data
    };
    throw new CustomAppException(retour);
  }

  // 2️⃣ Si backend renvoie juste un message générique
  if (error.response?.data && typeof error.response.data === "object" && "message" in error.response.data) {
    const retour: Resultat = {
      success: false,
      message: error.response.data.message,
      erreur: error.response.data
    };
    throw new CustomAppException(retour);
  }

  // 3️⃣ Sinon on prend le message de l’exception Axios
  const message = error instanceof Error ? error.message : String(error);
  const retour: Resultat = {
    success: false,
    message: context ? `[${context}] ${message}` : message
  };
  throw new CustomAppException(retour);
}

export function handleApiError(error: any, context: string = ""):   Resultat {
  const emoji = "🌷​​​​";
  const viewLog = true;

  logConsole(viewLog, emoji + " ❌", context, 'error', error);

  // 1️⃣ Si backend renvoie un AppError
  if (error.response?.data && isAppError(error.response.data)) {
    const retour: Resultat = {
      success: false,
      message: error.response.data.message || "",
      erreur: error.response.data
    };
    //throw new CustomAppException(retour);
    return retour;
  }

  // 2️⃣ Si backend renvoie juste un message générique
  if (error.response?.data && typeof error.response.data === "object" && "message" in error.response.data) {
    const retour: Resultat = {
      success: false,
      message: error.response.data.message,
      erreur: error.response.data
    };
    //throw new CustomAppException(retour);
    return retour;
  }

  // 3️⃣ Sinon on prend le message de l’exception Axios
  const message = error instanceof Error ? error.message : String(error);
  const retour: Resultat = {
    success: false,
    message: context ? `[${context}] ${message}` : message
  };
  //throw new CustomAppException(retour);
  return retour;
}
