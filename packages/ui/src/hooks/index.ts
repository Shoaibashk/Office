import { useState, useCallback, useRef, useEffect } from 'react';

// useLocalStorage hook
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error('Error reading localStorage:', error);
            return initialValue;
        }
    });

    const setValue = useCallback((value: T | ((prev: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error('Error writing localStorage:', error);
        }
    }, [key, storedValue]);

    return [storedValue, setValue];
}

// useDebounce hook
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

// useUndo hook for history management
interface UndoState<T> {
    past: T[];
    present: T;
    future: T[];
}

export function useUndo<T>(initialState: T) {
    const [state, setState] = useState<UndoState<T>>({
        past: [],
        present: initialState,
        future: [],
    });

    const canUndo = state.past.length > 0;
    const canRedo = state.future.length > 0;

    const set = useCallback((newPresent: T | ((prev: T) => T)) => {
        setState((currentState) => {
            const resolvedPresent = typeof newPresent === 'function'
                ? (newPresent as (prev: T) => T)(currentState.present)
                : newPresent;

            if (resolvedPresent === currentState.present) {
                return currentState;
            }

            return {
                past: [...currentState.past, currentState.present],
                present: resolvedPresent,
                future: [],
            };
        });
    }, []);

    const undo = useCallback(() => {
        setState((currentState) => {
            if (currentState.past.length === 0) return currentState;

            const previous = currentState.past[currentState.past.length - 1];
            const newPast = currentState.past.slice(0, -1);

            return {
                past: newPast,
                present: previous,
                future: [currentState.present, ...currentState.future],
            };
        });
    }, []);

    const redo = useCallback(() => {
        setState((currentState) => {
            if (currentState.future.length === 0) return currentState;

            const next = currentState.future[0];
            const newFuture = currentState.future.slice(1);

            return {
                past: [...currentState.past, currentState.present],
                present: next,
                future: newFuture,
            };
        });
    }, []);

    const reset = useCallback((newPresent: T) => {
        setState({
            past: [],
            present: newPresent,
            future: [],
        });
    }, []);

    return {
        state: state.present,
        set,
        undo,
        redo,
        reset,
        canUndo,
        canRedo,
        history: state,
    };
}

// useClickOutside hook
export function useClickOutside<T extends HTMLElement>(
    callback: () => void
): React.RefObject<T | null> {
    const ref = useRef<T>(null);

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        };

        document.addEventListener('mousedown', handleClick);
        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, [callback]);

    return ref;
}

// useKeyboardShortcut hook
export function useKeyboardShortcut(
    key: string,
    callback: () => void,
    options: { ctrl?: boolean; shift?: boolean; alt?: boolean; meta?: boolean } = {}
) {
    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            const { ctrl, shift, alt, meta } = options;

            if (ctrl && !event.ctrlKey) return;
            if (shift && !event.shiftKey) return;
            if (alt && !event.altKey) return;
            if (meta && !event.metaKey) return;

            if (event.key.toLowerCase() === key.toLowerCase()) {
                event.preventDefault();
                callback();
            }
        };

        document.addEventListener('keydown', handler);
        return () => {
            document.removeEventListener('keydown', handler);
        };
    }, [key, callback, options]);
}

// useSelection hook for text selection
export function useSelection() {
    const [selection, setSelection] = useState<Selection | null>(null);

    useEffect(() => {
        const handleSelectionChange = () => {
            setSelection(window.getSelection());
        };

        document.addEventListener('selectionchange', handleSelectionChange);
        return () => {
            document.removeEventListener('selectionchange', handleSelectionChange);
        };
    }, []);

    return selection;
}

// useWindowSize hook
export function useWindowSize() {
    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return size;
}

// useContextMenu hook
export function useContextMenu<T extends HTMLElement>() {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const ref = useRef<T>(null);

    const handleContextMenu = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        setPosition({ x: event.clientX, y: event.clientY });
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
    }, []);

    useEffect(() => {
        const handleClick = () => {
            if (isOpen) {
                close();
            }
        };

        document.addEventListener('click', handleClick);
        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, [isOpen, close]);

    return { ref, isOpen, position, handleContextMenu, close };
}

// useDrag hook for drag and drop
export function useDrag<T extends HTMLElement>() {
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const ref = useRef<T>(null);

    const handleMouseDown = useCallback((event: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({ x: event.clientX, y: event.clientY });
        setOffset({ x: 0, y: 0 });
    }, []);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (isDragging) {
                setOffset({
                    x: event.clientX - dragStart.x,
                    y: event.clientY - dragStart.y,
                });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragStart]);

    return { ref, isDragging, offset, handleMouseDown };
}

// useClipboard hook
export function useClipboard() {
    const [copied, setCopied] = useState(false);

    const copy = useCallback(async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            return true;
        } catch (error) {
            console.error('Failed to copy:', error);
            return false;
        }
    }, []);

    const paste = useCallback(async () => {
        try {
            return await navigator.clipboard.readText();
        } catch (error) {
            console.error('Failed to paste:', error);
            return null;
        }
    }, []);

    return { copy, paste, copied };
}

// useFullscreen hook
export function useFullscreen<T extends HTMLElement>() {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const ref = useRef<T>(null);

    const enter = useCallback(() => {
        if (ref.current) {
            ref.current.requestFullscreen?.();
        }
    }, []);

    const exit = useCallback(() => {
        document.exitFullscreen?.();
    }, []);

    const toggle = useCallback(() => {
        if (isFullscreen) {
            exit();
        } else {
            enter();
        }
    }, [isFullscreen, enter, exit]);

    useEffect(() => {
        const handleChange = () => {
            setIsFullscreen(document.fullscreenElement !== null);
        };

        document.addEventListener('fullscreenchange', handleChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleChange);
        };
    }, []);

    return { ref, isFullscreen, enter, exit, toggle };
}

// useThrottle hook
export function useThrottle<T>(value: T, limit: number): T {
    const [throttledValue, setThrottledValue] = useState<T>(value);
    const lastRan = useRef(Date.now());

    useEffect(() => {
        const handler = setTimeout(() => {
            if (Date.now() - lastRan.current >= limit) {
                setThrottledValue(value);
                lastRan.current = Date.now();
            }
        }, limit - (Date.now() - lastRan.current));

        return () => {
            clearTimeout(handler);
        };
    }, [value, limit]);

    return throttledValue;
}

// useToggle hook
export function useToggle(initialValue = false): [boolean, () => void, (value: boolean) => void] {
    const [value, setValue] = useState(initialValue);
    const toggle = useCallback(() => setValue((v) => !v), []);
    const set = useCallback((v: boolean) => setValue(v), []);
    return [value, toggle, set];
}

// useInterval hook
export function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (delay !== null) {
            const id = setInterval(() => savedCallback.current(), delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

// usePrevious hook
export function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T>();
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}
