import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';

export type FileType = 'folder' | 'document' | 'spreadsheet' | 'presentation' | 'image' | 'pdf' | 'other';

export interface DriveItem {
    id: string;
    name: string;
    type: FileType;
    parentId: string | null;
    size: number;
    mimeType?: string;
    createdAt: Date;
    updatedAt: Date;
    isStarred: boolean;
    isTrashed: boolean;
    trashedAt?: Date;
    content?: string | ArrayBuffer;
    thumbnail?: string;
}

export type ViewMode = 'grid' | 'list';
export type SortBy = 'name' | 'date' | 'size' | 'type';
export type SortOrder = 'asc' | 'desc';

interface DriveState {
    // Items
    items: DriveItem[];
    selectedIds: string[];
    currentFolderId: string | null;

    // View state
    viewMode: ViewMode;
    sortBy: SortBy;
    sortOrder: SortOrder;
    searchQuery: string;

    // UI state
    isUploading: boolean;
    uploadProgress: number;

    // Navigation
    path: { id: string | null; name: string }[];

    // Actions - Items
    addItem: (item: Omit<DriveItem, 'id' | 'createdAt' | 'updatedAt'>) => string;
    updateItem: (id: string, updates: Partial<DriveItem>) => void;
    deleteItem: (id: string) => void;
    moveItem: (id: string, newParentId: string | null) => void;
    copyItem: (id: string) => string;
    renameItem: (id: string, newName: string) => void;
    toggleStar: (id: string) => void;
    trashItem: (id: string) => void;
    restoreItem: (id: string) => void;
    permanentlyDeleteItem: (id: string) => void;
    emptyTrash: () => void;

    // Actions - Selection
    selectItem: (id: string, append?: boolean) => void;
    selectAll: () => void;
    clearSelection: () => void;

    // Actions - Navigation
    navigateToFolder: (folderId: string | null) => void;
    navigateUp: () => void;

    // Actions - View
    setViewMode: (mode: ViewMode) => void;
    setSortBy: (sortBy: SortBy) => void;
    toggleSortOrder: () => void;
    setSearchQuery: (query: string) => void;

    // Actions - Upload
    setUploading: (isUploading: boolean) => void;
    setUploadProgress: (progress: number) => void;

    // Getters
    getCurrentItems: () => DriveItem[];
    getStarredItems: () => DriveItem[];
    getTrashedItems: () => DriveItem[];
    getRecentItems: (limit?: number) => DriveItem[];
    getItemPath: (id: string) => { id: string | null; name: string }[];
    searchItems: (query: string) => DriveItem[];
}

// Initial mock data
const initialItems: DriveItem[] = [
    {
        id: 'folder-1',
        name: 'Documents',
        type: 'folder',
        parentId: null,
        size: 0,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-11-20'),
        isStarred: true,
        isTrashed: false,
    },
    {
        id: 'folder-2',
        name: 'Images',
        type: 'folder',
        parentId: null,
        size: 0,
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-11-18'),
        isStarred: false,
        isTrashed: false,
    },
    {
        id: 'folder-3',
        name: 'Projects',
        type: 'folder',
        parentId: null,
        size: 0,
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-11-25'),
        isStarred: true,
        isTrashed: false,
    },
    {
        id: 'doc-1',
        name: 'Quarterly Report.docx',
        type: 'document',
        parentId: 'folder-1',
        size: 245000,
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        createdAt: new Date('2024-10-15'),
        updatedAt: new Date('2024-11-20'),
        isStarred: true,
        isTrashed: false,
    },
    {
        id: 'sheet-1',
        name: 'Budget 2024.xlsx',
        type: 'spreadsheet',
        parentId: 'folder-1',
        size: 185000,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        createdAt: new Date('2024-09-01'),
        updatedAt: new Date('2024-11-22'),
        isStarred: false,
        isTrashed: false,
    },
    {
        id: 'ppt-1',
        name: 'Product Launch.pptx',
        type: 'presentation',
        parentId: 'folder-3',
        size: 5200000,
        mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        createdAt: new Date('2024-11-01'),
        updatedAt: new Date('2024-11-28'),
        isStarred: true,
        isTrashed: false,
    },
    {
        id: 'img-1',
        name: 'Team Photo.jpg',
        type: 'image',
        parentId: 'folder-2',
        size: 3500000,
        mimeType: 'image/jpeg',
        createdAt: new Date('2024-08-15'),
        updatedAt: new Date('2024-08-15'),
        isStarred: false,
        isTrashed: false,
    },
    {
        id: 'pdf-1',
        name: 'Contract.pdf',
        type: 'pdf',
        parentId: null,
        size: 520000,
        mimeType: 'application/pdf',
        createdAt: new Date('2024-11-10'),
        updatedAt: new Date('2024-11-10'),
        isStarred: false,
        isTrashed: false,
    },
];

export const useDriveStore = create<DriveState>()(
    persist(
        (set, get) => ({
            // Initial state
            items: initialItems,
            selectedIds: [],
            currentFolderId: null,
            viewMode: 'grid',
            sortBy: 'name',
            sortOrder: 'asc',
            searchQuery: '',
            isUploading: false,
            uploadProgress: 0,
            path: [{ id: null, name: 'My Drive' }],

            // Item actions
            addItem: (item) => {
                const id = uuid();
                const now = new Date();
                const newItem: DriveItem = {
                    ...item,
                    id,
                    createdAt: now,
                    updatedAt: now,
                };
                set((state) => ({ items: [...state.items, newItem] }));
                return id;
            },

            updateItem: (id, updates) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id ? { ...item, ...updates, updatedAt: new Date() } : item
                    ),
                })),

            deleteItem: (id) =>
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                    selectedIds: state.selectedIds.filter((sid) => sid !== id),
                })),

            moveItem: (id, newParentId) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id ? { ...item, parentId: newParentId, updatedAt: new Date() } : item
                    ),
                })),

            copyItem: (id) => {
                const state = get();
                const original = state.items.find((item) => item.id === id);
                if (!original) return '';

                const newId = uuid();
                const now = new Date();
                const copy: DriveItem = {
                    ...original,
                    id: newId,
                    name: `Copy of ${original.name}`,
                    createdAt: now,
                    updatedAt: now,
                };
                set((s) => ({ items: [...s.items, copy] }));
                return newId;
            },

            renameItem: (id, newName) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id ? { ...item, name: newName, updatedAt: new Date() } : item
                    ),
                })),

            toggleStar: (id) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id ? { ...item, isStarred: !item.isStarred } : item
                    ),
                })),

            trashItem: (id) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id ? { ...item, isTrashed: true, trashedAt: new Date() } : item
                    ),
                    selectedIds: state.selectedIds.filter((sid) => sid !== id),
                })),

            restoreItem: (id) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id ? { ...item, isTrashed: false, trashedAt: undefined } : item
                    ),
                })),

            permanentlyDeleteItem: (id) => get().deleteItem(id),

            emptyTrash: () =>
                set((state) => ({
                    items: state.items.filter((item) => !item.isTrashed),
                })),

            // Selection actions
            selectItem: (id, append = false) =>
                set((state) => ({
                    selectedIds: append
                        ? state.selectedIds.includes(id)
                            ? state.selectedIds.filter((sid) => sid !== id)
                            : [...state.selectedIds, id]
                        : [id],
                })),

            selectAll: () =>
                set((state) => ({
                    selectedIds: state.getCurrentItems().map((item) => item.id),
                })),

            clearSelection: () => set({ selectedIds: [] }),

            // Navigation actions
            navigateToFolder: (folderId) => {
                const state = get();
                const newPath = state.getItemPath(folderId!);
                set({
                    currentFolderId: folderId,
                    path: folderId ? newPath : [{ id: null, name: 'My Drive' }],
                    selectedIds: [],
                });
            },

            navigateUp: () => {
                const state = get();
                if (state.path.length <= 1) return;
                const parentPath = state.path.slice(0, -1);
                const parentId = parentPath[parentPath.length - 1].id;
                set({
                    currentFolderId: parentId,
                    path: parentPath,
                    selectedIds: [],
                });
            },

            // View actions
            setViewMode: (mode) => set({ viewMode: mode }),
            setSortBy: (sortBy) => set({ sortBy }),
            toggleSortOrder: () =>
                set((state) => ({ sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc' })),
            setSearchQuery: (query) => set({ searchQuery: query }),

            // Upload actions
            setUploading: (isUploading) => set({ isUploading }),
            setUploadProgress: (progress) => set({ uploadProgress: progress }),

            // Getters
            getCurrentItems: () => {
                const state = get();
                let items = state.items.filter(
                    (item) => item.parentId === state.currentFolderId && !item.isTrashed
                );

                // Apply search filter
                if (state.searchQuery) {
                    items = items.filter((item) =>
                        item.name.toLowerCase().includes(state.searchQuery.toLowerCase())
                    );
                }

                // Apply sorting
                items.sort((a, b) => {
                    let comparison = 0;
                    switch (state.sortBy) {
                        case 'name':
                            comparison = a.name.localeCompare(b.name);
                            break;
                        case 'date':
                            comparison = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
                            break;
                        case 'size':
                            comparison = a.size - b.size;
                            break;
                        case 'type':
                            comparison = a.type.localeCompare(b.type);
                            break;
                    }
                    return state.sortOrder === 'asc' ? comparison : -comparison;
                });

                // Sort folders first
                return items.sort((a, b) => {
                    if (a.type === 'folder' && b.type !== 'folder') return -1;
                    if (a.type !== 'folder' && b.type === 'folder') return 1;
                    return 0;
                });
            },

            getStarredItems: () => get().items.filter((item) => item.isStarred && !item.isTrashed),

            getTrashedItems: () => get().items.filter((item) => item.isTrashed),

            getRecentItems: (limit = 10) => {
                return get()
                    .items.filter((item) => !item.isTrashed && item.type !== 'folder')
                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                    .slice(0, limit);
            },

            getItemPath: (id) => {
                const state = get();
                const path: { id: string | null; name: string }[] = [{ id: null, name: 'My Drive' }];

                let currentId: string | null = id;
                const pathItems: DriveItem[] = [];

                while (currentId) {
                    const item = state.items.find((i) => i.id === currentId);
                    if (item) {
                        pathItems.unshift(item);
                        currentId = item.parentId;
                    } else {
                        break;
                    }
                }

                pathItems.forEach((item) => {
                    path.push({ id: item.id, name: item.name });
                });

                return path;
            },

            searchItems: (query) => {
                return get().items.filter(
                    (item) =>
                        !item.isTrashed && item.name.toLowerCase().includes(query.toLowerCase())
                );
            },
        }),
        {
            name: 'office-drive-storage',
            partialize: (state) => ({
                items: state.items,
                viewMode: state.viewMode,
                sortBy: state.sortBy,
                sortOrder: state.sortOrder,
            }),
        }
    )
);
