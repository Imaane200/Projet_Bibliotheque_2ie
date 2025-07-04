import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'

// Définition des types pour l'utilisateur et l'état d'authentification
type User = {
    id: number;
    nom: string;
    email: string;
    role: 'etudiant' | 'admin';
};

type AuthState = {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            login: (token, user) => set({ token, user }),
            logout: () => set({ token: null, user: null }),
        }),
        {
            name: 'auth-storage', // clef unique pour le localStorage
            storage: createJSONStorage(() => localStorage),
        }
    )
);