import { create } from 'zustand';

export interface DocumentState {
    id: string;
    title: string;
    content: string;
    lastModified: Date;
    isModified: boolean;
    wordCount: number;
    characterCount: number;
    pageCount: number;
}

export interface FormatState {
    fontFamily: string;
    fontSize: number;
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
    textColor: string;
    highlightColor: string;
    alignment: 'left' | 'center' | 'right' | 'justify';
    lineHeight: number;
    subscript: boolean;
    superscript: boolean;
}

export interface EditorState {
    zoom: number;
    showRuler: boolean;
    showComments: boolean;
    showTrackChanges: boolean;
    currentPage: number;
    viewMode: 'edit' | 'read' | 'web';
    showFindReplace: boolean;
    findText: string;
    replaceText: string;
}

export interface SelectionState {
    hasSelection: boolean;
    selectionStart: number;
    selectionEnd: number;
    selectedText: string;
}

export interface HistoryEntry {
    content: string;
    timestamp: Date;
    action: string;
}

export interface WordStore {
    // Document state
    document: DocumentState;
    setDocument: (doc: Partial<DocumentState>) => void;
    setTitle: (title: string) => void;
    setContent: (content: string) => void;
    markAsModified: () => void;
    markAsSaved: () => void;

    // Format state
    format: FormatState;
    setFormat: (format: Partial<FormatState>) => void;
    toggleBold: () => void;
    toggleItalic: () => void;
    toggleUnderline: () => void;
    toggleStrikethrough: () => void;
    setFontFamily: (font: string) => void;
    setFontSize: (size: number) => void;
    setTextColor: (color: string) => void;
    setHighlightColor: (color: string) => void;
    setAlignment: (alignment: 'left' | 'center' | 'right' | 'justify') => void;

    // Editor state
    editor: EditorState;
    setZoom: (zoom: number) => void;
    toggleRuler: () => void;
    toggleComments: () => void;
    toggleTrackChanges: () => void;
    setViewMode: (mode: 'edit' | 'read' | 'web') => void;
    toggleFindReplace: () => void;
    setFindText: (text: string) => void;
    setReplaceText: (text: string) => void;

    // Selection state
    selection: SelectionState;
    setSelection: (sel: Partial<SelectionState>) => void;
    clearSelection: () => void;

    // History (Undo/Redo)
    history: HistoryEntry[];
    historyIndex: number;
    canUndo: boolean;
    canRedo: boolean;
    pushHistory: (action: string) => void;
    undo: () => void;
    redo: () => void;

    // Actions
    newDocument: () => void;
    updateStats: () => void;
}

const initialDocument: DocumentState = {
    id: crypto.randomUUID?.() || Math.random().toString(36).substring(2),
    title: 'Untitled Document',
    content: '',
    lastModified: new Date(),
    isModified: false,
    wordCount: 0,
    characterCount: 0,
    pageCount: 1,
};

const initialFormat: FormatState = {
    fontFamily: 'Calibri',
    fontSize: 11,
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    textColor: '#000000',
    highlightColor: 'transparent',
    alignment: 'left',
    lineHeight: 1.15,
    subscript: false,
    superscript: false,
};

const initialEditor: EditorState = {
    zoom: 100,
    showRuler: true,
    showComments: false,
    showTrackChanges: false,
    currentPage: 1,
    viewMode: 'edit',
    showFindReplace: false,
    findText: '',
    replaceText: '',
};

const initialSelection: SelectionState = {
    hasSelection: false,
    selectionStart: 0,
    selectionEnd: 0,
    selectedText: '',
};

export const useWordStore = create<WordStore>((set, get) => ({
    // Document
    document: initialDocument,
    setDocument: (doc) => set((state) => ({
        document: { ...state.document, ...doc }
    })),
    setTitle: (title) => set((state) => ({
        document: { ...state.document, title, isModified: true }
    })),
    setContent: (content) => {
        set((state) => ({
            document: { ...state.document, content, isModified: true, lastModified: new Date() }
        }));
        get().updateStats();
    },
    markAsModified: () => set((state) => ({
        document: { ...state.document, isModified: true, lastModified: new Date() }
    })),
    markAsSaved: () => set((state) => ({
        document: { ...state.document, isModified: false, lastModified: new Date() }
    })),

    // Format
    format: initialFormat,
    setFormat: (format) => set((state) => ({
        format: { ...state.format, ...format }
    })),
    toggleBold: () => set((state) => ({
        format: { ...state.format, bold: !state.format.bold }
    })),
    toggleItalic: () => set((state) => ({
        format: { ...state.format, italic: !state.format.italic }
    })),
    toggleUnderline: () => set((state) => ({
        format: { ...state.format, underline: !state.format.underline }
    })),
    toggleStrikethrough: () => set((state) => ({
        format: { ...state.format, strikethrough: !state.format.strikethrough }
    })),
    setFontFamily: (fontFamily) => set((state) => ({
        format: { ...state.format, fontFamily }
    })),
    setFontSize: (fontSize) => set((state) => ({
        format: { ...state.format, fontSize }
    })),
    setTextColor: (textColor) => set((state) => ({
        format: { ...state.format, textColor }
    })),
    setHighlightColor: (highlightColor) => set((state) => ({
        format: { ...state.format, highlightColor }
    })),
    setAlignment: (alignment) => set((state) => ({
        format: { ...state.format, alignment }
    })),

    // Editor
    editor: initialEditor,
    setZoom: (zoom) => set((state) => ({
        editor: { ...state.editor, zoom: Math.max(10, Math.min(500, zoom)) }
    })),
    toggleRuler: () => set((state) => ({
        editor: { ...state.editor, showRuler: !state.editor.showRuler }
    })),
    toggleComments: () => set((state) => ({
        editor: { ...state.editor, showComments: !state.editor.showComments }
    })),
    toggleTrackChanges: () => set((state) => ({
        editor: { ...state.editor, showTrackChanges: !state.editor.showTrackChanges }
    })),
    setViewMode: (viewMode) => set((state) => ({
        editor: { ...state.editor, viewMode }
    })),
    toggleFindReplace: () => set((state) => ({
        editor: { ...state.editor, showFindReplace: !state.editor.showFindReplace }
    })),
    setFindText: (findText) => set((state) => ({
        editor: { ...state.editor, findText }
    })),
    setReplaceText: (replaceText) => set((state) => ({
        editor: { ...state.editor, replaceText }
    })),

    // Selection
    selection: initialSelection,
    setSelection: (sel) => set((state) => ({
        selection: { ...state.selection, ...sel }
    })),
    clearSelection: () => set({ selection: initialSelection }),

    // History
    history: [],
    historyIndex: -1,
    canUndo: false,
    canRedo: false,
    pushHistory: (action) => set((state) => {
        const newEntry: HistoryEntry = {
            content: state.document.content,
            timestamp: new Date(),
            action,
        };
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(newEntry);

        // Keep only last 100 entries
        if (newHistory.length > 100) {
            newHistory.shift();
        }

        return {
            history: newHistory,
            historyIndex: newHistory.length - 1,
            canUndo: true,
            canRedo: false,
        };
    }),
    undo: () => set((state) => {
        if (state.historyIndex <= 0) return state;

        const newIndex = state.historyIndex - 1;
        const entry = state.history[newIndex];

        return {
            document: { ...state.document, content: entry.content },
            historyIndex: newIndex,
            canUndo: newIndex > 0,
            canRedo: true,
        };
    }),
    redo: () => set((state) => {
        if (state.historyIndex >= state.history.length - 1) return state;

        const newIndex = state.historyIndex + 1;
        const entry = state.history[newIndex];

        return {
            document: { ...state.document, content: entry.content },
            historyIndex: newIndex,
            canUndo: true,
            canRedo: newIndex < state.history.length - 1,
        };
    }),

    // Actions
    newDocument: () => set({
        document: { ...initialDocument, id: crypto.randomUUID?.() || Math.random().toString(36).substring(2) },
        format: initialFormat,
        editor: initialEditor,
        selection: initialSelection,
        history: [],
        historyIndex: -1,
        canUndo: false,
        canRedo: false,
    }),

    updateStats: () => set((state) => {
        const text = state.document.content;
        // Strip HTML tags for counting
        const plainText = text.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
        const words = plainText.trim().split(/\s+/).filter(w => w.length > 0);
        const chars = plainText.length;
        // Rough estimate: ~3000 chars per page
        const pages = Math.max(1, Math.ceil(chars / 3000));

        return {
            document: {
                ...state.document,
                wordCount: words.length,
                characterCount: chars,
                pageCount: pages,
            }
        };
    }),
}));
