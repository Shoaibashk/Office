import { create } from 'zustand';
import { fabric } from 'fabric';

export interface SlideElement {
    id: string;
    type: 'text' | 'image' | 'shape' | 'video';
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    data: any; // Type-specific data
    zIndex: number;
}

export interface Slide {
    id: string;
    order: number;
    elements: SlideElement[];
    background: string;
    notes: string;
    transition: 'none' | 'fade' | 'slide' | 'zoom';
    thumbnailUrl?: string;
}

export interface Presentation {
    id: string;
    title: string;
    slides: Slide[];
    theme: {
        primaryColor: string;
        secondaryColor: string;
        backgroundColor: string;
        fontFamily: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface SlidesStore {
    // Presentation
    presentation: Presentation;
    isDirty: boolean;

    // Current state
    currentSlideIndex: number;
    selectedElementIds: string[];
    isPresenting: boolean;
    zoom: number;

    // Canvas reference
    canvas: fabric.Canvas | null;

    // Presentation actions
    setTitle: (title: string) => void;
    save: () => void;
    newPresentation: () => void;

    // Slide actions
    addSlide: (afterIndex?: number) => void;
    duplicateSlide: (index: number) => void;
    deleteSlide: (index: number) => void;
    reorderSlides: (fromIndex: number, toIndex: number) => void;
    setCurrentSlide: (index: number) => void;
    setSlideBackground: (index: number, background: string) => void;
    setSlideNotes: (index: number, notes: string) => void;

    // Element actions
    addElement: (type: SlideElement['type'], data?: any) => void;
    updateElement: (slideIndex: number, elementId: string, updates: Partial<SlideElement>) => void;
    deleteElements: (elementIds: string[]) => void;
    selectElement: (id: string, addToSelection?: boolean) => void;
    clearSelection: () => void;

    // Canvas actions
    setCanvas: (canvas: fabric.Canvas | null) => void;

    // View actions
    setZoom: (zoom: number) => void;
    startPresentation: (fromSlide?: number) => void;
    stopPresentation: () => void;
    nextSlide: () => void;
    previousSlide: () => void;

    // Theme actions
    setTheme: (theme: Partial<Presentation['theme']>) => void;

    // Utility
    getCurrentSlide: () => Slide | undefined;
    getSlide: (index: number) => Slide | undefined;
}

function createSlide(order: number): Slide {
    return {
        id: crypto.randomUUID(),
        order,
        elements: [],
        background: '#ffffff',
        notes: '',
        transition: 'none',
    };
}

function createInitialPresentation(): Presentation {
    const titleSlide = createSlide(0);
    // Add title text element
    titleSlide.elements.push({
        id: crypto.randomUUID(),
        type: 'text',
        x: 100,
        y: 200,
        width: 760,
        height: 100,
        rotation: 0,
        data: {
            text: 'Click to add title',
            fontSize: 44,
            fontFamily: 'Arial',
            fontWeight: 'bold',
            fill: '#1e293b',
            textAlign: 'center',
        },
        zIndex: 1,
    });

    // Add subtitle text element
    titleSlide.elements.push({
        id: crypto.randomUUID(),
        type: 'text',
        x: 100,
        y: 320,
        width: 760,
        height: 60,
        rotation: 0,
        data: {
            text: 'Click to add subtitle',
            fontSize: 24,
            fontFamily: 'Arial',
            fontWeight: 'normal',
            fill: '#64748b',
            textAlign: 'center',
        },
        zIndex: 2,
    });

    return {
        id: crypto.randomUUID(),
        title: 'Untitled Presentation',
        slides: [titleSlide],
        theme: {
            primaryColor: '#3b82f6',
            secondaryColor: '#60a5fa',
            backgroundColor: '#ffffff',
            fontFamily: 'Arial',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}

export const useSlidesStore = create<SlidesStore>((set, get) => ({
    presentation: createInitialPresentation(),
    isDirty: false,
    currentSlideIndex: 0,
    selectedElementIds: [],
    isPresenting: false,
    zoom: 100,
    canvas: null,

    // Presentation actions
    setTitle: (title) => set((state) => ({
        presentation: { ...state.presentation, title, updatedAt: new Date() },
        isDirty: true,
    })),

    save: () => set((state) => ({
        presentation: { ...state.presentation, updatedAt: new Date() },
        isDirty: false,
    })),

    newPresentation: () => set({
        presentation: createInitialPresentation(),
        currentSlideIndex: 0,
        selectedElementIds: [],
        isDirty: false,
    }),

    // Slide actions
    addSlide: (afterIndex) => set((state) => {
        const insertIndex = afterIndex !== undefined ? afterIndex + 1 : state.presentation.slides.length;
        const newSlide = createSlide(insertIndex);

        const slides = [...state.presentation.slides];
        slides.splice(insertIndex, 0, newSlide);

        // Update order for all slides
        slides.forEach((slide, i) => {
            slide.order = i;
        });

        return {
            presentation: { ...state.presentation, slides, updatedAt: new Date() },
            currentSlideIndex: insertIndex,
            isDirty: true,
        };
    }),

    duplicateSlide: (index) => set((state) => {
        const sourceSlide = state.presentation.slides[index];
        if (!sourceSlide) return state;

        const newSlide: Slide = {
            ...sourceSlide,
            id: crypto.randomUUID(),
            order: index + 1,
            elements: sourceSlide.elements.map(el => ({
                ...el,
                id: crypto.randomUUID(),
            })),
        };

        const slides = [...state.presentation.slides];
        slides.splice(index + 1, 0, newSlide);

        // Update order
        slides.forEach((slide, i) => {
            slide.order = i;
        });

        return {
            presentation: { ...state.presentation, slides, updatedAt: new Date() },
            currentSlideIndex: index + 1,
            isDirty: true,
        };
    }),

    deleteSlide: (index) => set((state) => {
        if (state.presentation.slides.length <= 1) return state;

        const slides = state.presentation.slides.filter((_, i) => i !== index);
        slides.forEach((slide, i) => {
            slide.order = i;
        });

        const newIndex = Math.min(index, slides.length - 1);

        return {
            presentation: { ...state.presentation, slides, updatedAt: new Date() },
            currentSlideIndex: newIndex,
            isDirty: true,
        };
    }),

    reorderSlides: (fromIndex, toIndex) => set((state) => {
        const slides = [...state.presentation.slides];
        const [removed] = slides.splice(fromIndex, 1);
        slides.splice(toIndex, 0, removed);

        slides.forEach((slide, i) => {
            slide.order = i;
        });

        return {
            presentation: { ...state.presentation, slides, updatedAt: new Date() },
            currentSlideIndex: toIndex,
            isDirty: true,
        };
    }),

    setCurrentSlide: (index) => set({
        currentSlideIndex: Math.max(0, Math.min(index, get().presentation.slides.length - 1)),
        selectedElementIds: [],
    }),

    setSlideBackground: (index, background) => set((state) => {
        const slides = [...state.presentation.slides];
        if (slides[index]) {
            slides[index] = { ...slides[index], background };
        }
        return {
            presentation: { ...state.presentation, slides, updatedAt: new Date() },
            isDirty: true,
        };
    }),

    setSlideNotes: (index, notes) => set((state) => {
        const slides = [...state.presentation.slides];
        if (slides[index]) {
            slides[index] = { ...slides[index], notes };
        }
        return {
            presentation: { ...state.presentation, slides, updatedAt: new Date() },
            isDirty: true,
        };
    }),

    // Element actions
    addElement: (type, data) => set((state) => {
        const slide = state.presentation.slides[state.currentSlideIndex];
        if (!slide) return state;

        const defaultData: Record<string, any> = {
            text: {
                text: 'Text',
                fontSize: 24,
                fontFamily: 'Arial',
                fill: '#000000',
                textAlign: 'left',
            },
            shape: {
                shapeType: 'rectangle',
                fill: '#3b82f6',
                stroke: '#1e40af',
                strokeWidth: 2,
            },
            image: {
                src: '',
            },
        };

        const newElement: SlideElement = {
            id: crypto.randomUUID(),
            type,
            x: 100,
            y: 100,
            width: type === 'text' ? 300 : 200,
            height: type === 'text' ? 50 : 200,
            rotation: 0,
            data: { ...defaultData[type], ...data },
            zIndex: slide.elements.length + 1,
        };

        const slides = [...state.presentation.slides];
        slides[state.currentSlideIndex] = {
            ...slide,
            elements: [...slide.elements, newElement],
        };

        return {
            presentation: { ...state.presentation, slides, updatedAt: new Date() },
            selectedElementIds: [newElement.id],
            isDirty: true,
        };
    }),

    updateElement: (slideIndex, elementId, updates) => set((state) => {
        const slides = [...state.presentation.slides];
        const slide = slides[slideIndex];
        if (!slide) return state;

        slides[slideIndex] = {
            ...slide,
            elements: slide.elements.map(el =>
                el.id === elementId ? { ...el, ...updates } : el
            ),
        };

        return {
            presentation: { ...state.presentation, slides, updatedAt: new Date() },
            isDirty: true,
        };
    }),

    deleteElements: (elementIds) => set((state) => {
        const slides = [...state.presentation.slides];
        const slide = slides[state.currentSlideIndex];
        if (!slide) return state;

        slides[state.currentSlideIndex] = {
            ...slide,
            elements: slide.elements.filter(el => !elementIds.includes(el.id)),
        };

        return {
            presentation: { ...state.presentation, slides, updatedAt: new Date() },
            selectedElementIds: [],
            isDirty: true,
        };
    }),

    selectElement: (id, addToSelection = false) => set((state) => ({
        selectedElementIds: addToSelection
            ? [...state.selectedElementIds, id]
            : [id],
    })),

    clearSelection: () => set({ selectedElementIds: [] }),

    // Canvas actions
    setCanvas: (canvas) => set({ canvas }),

    // View actions
    setZoom: (zoom) => set({ zoom: Math.max(25, Math.min(400, zoom)) }),

    startPresentation: (fromSlide = 0) => set({
        isPresenting: true,
        currentSlideIndex: fromSlide,
    }),

    stopPresentation: () => set({ isPresenting: false }),

    nextSlide: () => {
        const state = get();
        if (state.currentSlideIndex < state.presentation.slides.length - 1) {
            set({ currentSlideIndex: state.currentSlideIndex + 1 });
        }
    },

    previousSlide: () => {
        const state = get();
        if (state.currentSlideIndex > 0) {
            set({ currentSlideIndex: state.currentSlideIndex - 1 });
        }
    },

    // Theme actions
    setTheme: (theme) => set((state) => ({
        presentation: {
            ...state.presentation,
            theme: { ...state.presentation.theme, ...theme },
            updatedAt: new Date(),
        },
        isDirty: true,
    })),

    // Utility
    getCurrentSlide: () => {
        const state = get();
        return state.presentation.slides[state.currentSlideIndex];
    },

    getSlide: (index) => get().presentation.slides[index],
}));
