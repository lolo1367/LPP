// src/api/api.ts
import { API_BASE } from '../config';

import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "@/store/authStore";

type TokenPayload = {
  id: number;
  email: string;
  exp: number; // timestamp en secondes
  iat: number; // timestamp en secondes
};

const api = axios.create({ baseURL: API_BASE });
//const jwtDecode = (jwtDecodeCJS as unknown) as <T = unknown>(token: string) => T;

// Intercepteur pour ajouter le token
api.interceptors.request.use(config => {
  const token = useAuthStore.getState().token;
  if (token) {
    const payload = jwtDecode<TokenPayload>(token);
    const now = Date.now() / 1000;
    if (payload.exp && payload.exp < now) {
      console.warn("Access token expiré");
      // on peut laisser l'appel échouer et intercepteur response gère le refresh
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Intercepteur pour gérer 401 et refresh token
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const store = useAuthStore.getState();

    // 401 = accèsToken expiré
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const token = store.refreshToken;

      if (!token) {
        // pas de refresh token → logout
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      try {
          const res = await axios.post(`${API_BASE}/login/refresh`, { token });
        store.setAccessToken(res.data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return api(originalRequest); // réessaye la requête initiale
      } catch (err) {
        store.logout(); // refresh token invalide → logout
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

