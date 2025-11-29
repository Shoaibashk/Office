import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserPreferences } from '../types';

interface UserState {
    user: User | null;
    preferences: UserPreferences;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    setUser: (user: User | null) => void;
    updatePreferences: (preferences: Partial<UserPreferences>) => void;
    login: (user: User) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
}

const defaultPreferences: UserPreferences = {
    theme: 'system',
    language: 'en',
    dateFormat: 'MM/dd/yyyy',
    timeFormat: '12h',
    autoSave: true,
    autoSaveInterval: 30,
};

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            preferences: defaultPreferences,
            isAuthenticated: false,
            isLoading: false,

            setUser: (user) => set({ user, isAuthenticated: !!user }),

            updatePreferences: (newPreferences) =>
                set((state) => ({
                    preferences: { ...state.preferences, ...newPreferences },
                })),

            login: (user) => set({ user, isAuthenticated: true, isLoading: false }),

            logout: () =>
                set({
                    user: null,
                    isAuthenticated: false,
                    preferences: defaultPreferences,
                }),

            setLoading: (isLoading) => set({ isLoading }),
        }),
        {
            name: 'office-user-storage',
            partialize: (state) => ({
                user: state.user,
                preferences: state.preferences,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
