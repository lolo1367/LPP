// components/PrivateRoute.tsx
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { logConsole } from "@ww/reference";

type PrivateRouteProps = {
  children: ReactNode;
};

const viewLog = false;
const module = "PrivateRoute.tsx";
const emoji = "☀️​​";

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { token, utilisateur } = useAuthStore();

  logConsole(viewLog, emoji, module, "token", token);
  logConsole(viewLog, emoji, module, "utilisateur", utilisateur);

  if (!token || !utilisateur) {
    // pas connecté → redirige vers login
    return <Navigate to="/login" replace />;
  }

  // connecté → affiche la page
  return <>{children}</>;
};
