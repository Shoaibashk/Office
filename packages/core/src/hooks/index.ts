import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook for managing local storage with React state
 */
export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = useCallback(
        (value: T | ((prev: T) => T)) => {
            try {
                const valueToStore =
                    value instanceof Function ? value(storedValue) : value;
                setStoredValue(valueToStore);
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            } catch (error) {
                console.warn(`Error setting localStorage key "${key}":`, error);
            }
        },
        [key, storedValue]
    );

    return [storedValue, setValue];
}

/**
 * Hook for debounced values
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

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

/**
 * Hook for undo/redo history
 */
export function useHistory<T>(initialState: T) {
    const [past, setPast] = useState<T[]>([]);
    const [present, setPresent] = useState<T>(initialState);
    const [future, setFuture] = useState<T[]>([]);

    const canUndo = past.length > 0;
    const canRedo = future.length > 0;

    const undo = useCallback(() => {
        if (past.length === 0) return;

        const previous = past[past.length - 1];
        const newPast = past.slice(0, -1);

        setPast(newPast);
        setPresent(previous);
        setFuture([present, ...future]);
    }, [past, present, future]);

    const redo = useCallback(() => {
        if (future.length === 0) return;

        const next = future[0];
        const newFuture = future.slice(1);

        setPast([...past, present]);
        setPresent(next);
        setFuture(newFuture);
    }, [past, present, future]);

    const set = useCallback(
        (newState: T | ((prev: T) => T)) => {
            const newPresent =
                newState instanceof Function ? newState(present) : newState;

            setPast([...past, present]);
            setPresent(newPresent);
            setFuture([]);
        },
        [past, present]
    );

    const reset = useCallback((newState: T) => {
        setPast([]);
        setPresent(newState);
        setFuture([]);
    }, []);

    return {
        state: present,
        set,
        undo,
        redo,
        reset,
        canUndo,
        canRedo,
        history: { past, present, future },
    };
}

/**
 * Hook for keyboard shortcuts
 */
export function useKeyboardShortcut(
    keys: string[],
    callback: (event: KeyboardEvent) => void,
    options: {
        enabled?: boolean;
        preventDefault?: boolean;
    } = {}
) {
    const { enabled = true, preventDefault = true } = options;
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            const pressedKeys: string[] = [];

            if (event.ctrlKey || event.metaKey) pressedKeys.push('ctrl');
            if (event.shiftKey) pressedKeys.push('shift');
            if (event.altKey) pressedKeys.push('alt');
            pressedKeys.push(event.key.toLowerCase());

            const normalizedKeys = keys.map((k) => k.toLowerCase());
            const isMatch =
                normalizedKeys.length === pressedKeys.length &&
                normalizedKeys.every((key) => pressedKeys.includes(key));

            if (isMatch) {
                if (preventDefault) event.preventDefault();
                callbackRef.current(event);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [keys, enabled, preventDefault]);
}

/**
 * Hook for click outside detection
 */
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
        return () => document.removeEventListener('mousedown', handleClick);
    }, [callback]);

    return ref;
}

/**
 * Hook for window resize
 */
export function useWindowSize() {
    const [size, setSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });

    useEffect(() => {
        const handleResize = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return size;
}

/**
 * Hook for media query matching
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);
        setMatches(mediaQuery.matches);

        const handler = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, [query]);

    return matches;
}

/**
 * Hook for previous value
 */
export function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T>();

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}

/**
 * Hook for interval
 */
export function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (delay === null) return;

        const id = setInterval(() => savedCallback.current(), delay);
        return () => clearInterval(id);
    }, [delay]);
}

/**
 * Hook for toggle state
 */
export function useToggle(initialValue = false): [boolean, () => void] {
    const [value, setValue] = useState(initialValue);
    const toggle = useCallback(() => setValue((v) => !v), []);
    return [value, toggle];
}
