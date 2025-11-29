import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppType = 'word' | 'sheet' | 'slides' | 'drive';

interface RecentFile {
    id: string;
    name: string;
    appType: AppType;
    lastOpenedAt: Date;
    path: string;
}

interface SettingsState {
    // Sidebar state
    sidebarCollapsed: boolean;
    sidebarWidth: number;

    // View preferences
    showRuler: boolean;
    showGridLines: boolean;
    showStatusBar: boolean;

    // Recent files
    recentFiles: RecentFile[];
    maxRecentFiles: number;

    // Keyboard shortcuts enabled
    shortcutsEnabled: boolean;

    // Actions
    toggleSidebar: () => void;
    setSidebarWidth: (width: number) => void;
    toggleRuler: () => void;
    toggleGridLines: () => void;
    toggleStatusBar: () => void;
    addRecentFile: (file: Omit<RecentFile, 'lastOpenedAt'>) => void;
    clearRecentFiles: () => void;
    toggleShortcuts: () => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            sidebarCollapsed: false,
            sidebarWidth: 280,
            showRuler: true,
            showGridLines: true,
            showStatusBar: true,
            recentFiles: [],
            maxRecentFiles: 10,
            shortcutsEnabled: true,

            toggleSidebar: () =>
                set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

            setSidebarWidth: (width) => set({ sidebarWidth: width }),

            toggleRuler: () =>
                set((state) => ({ showRuler: !state.showRuler })),

            toggleGridLines: () =>
                set((state) => ({ showGridLines: !state.showGridLines })),

            toggleStatusBar: () =>
                set((state) => ({ showStatusBar: !state.showStatusBar })),

            addRecentFile: (file) =>
                set((state) => {
                    const existingIndex = state.recentFiles.findIndex(
                        (f) => f.id === file.id
                    );
                    let newRecentFiles = [...state.recentFiles];

                    if (existingIndex !== -1) {
                        newRecentFiles.splice(existingIndex, 1);
                    }

                    newRecentFiles = [
                        { ...file, lastOpenedAt: new Date() },
                        ...newRecentFiles,
                    ].slice(0, state.maxRecentFiles);

                    return { recentFiles: newRecentFiles };
                }),

            clearRecentFiles: () => set({ recentFiles: [] }),

            toggleShortcuts: () =>
                set((state) => ({ shortcutsEnabled: !state.shortcutsEnabled })),
        }),
        {
            name: 'office-settings-storage',
        }
    )
);
