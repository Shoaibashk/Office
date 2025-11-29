import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using clsx and tailwind-merge
 * Handles Tailwind class conflicts intelligently
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

/**
 * Creates keyboard shortcut display string
 */
export function formatShortcut(keys: string[]): string {
    const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

    return keys
        .map((key) => {
            switch (key.toLowerCase()) {
                case 'ctrl':
                    return isMac ? '⌘' : 'Ctrl';
                case 'alt':
                    return isMac ? '⌥' : 'Alt';
                case 'shift':
                    return isMac ? '⇧' : 'Shift';
                case 'enter':
                    return isMac ? '↵' : 'Enter';
                case 'backspace':
                    return isMac ? '⌫' : 'Backspace';
                case 'escape':
                    return 'Esc';
                case 'arrowup':
                    return '↑';
                case 'arrowdown':
                    return '↓';
                case 'arrowleft':
                    return '←';
                case 'arrowright':
                    return '→';
                default:
                    return key.charAt(0).toUpperCase() + key.slice(1);
            }
        })
        .join(isMac ? '' : '+');
}

/**
 * Generates consistent component IDs
 */
let idCounter = 0;
export function generateComponentId(prefix = 'ui'): string {
    return `${prefix}-${++idCounter}`;
}

/**
 * Generate unique ID
 */
export function generateId(): string {
    return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format date
 */
export function formatDate(date: Date | string, format: 'short' | 'long' | 'relative' = 'short'): string {
    const d = typeof date === 'string' ? new Date(date) : date;

    if (format === 'relative') {
        const now = new Date();
        const diff = now.getTime() - d.getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) return 'Just now';
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    }

    if (format === 'long') {
        return d.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle = false;

    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Get file extension
 */
export function getFileExtension(filename: string): string {
    const parts = filename.split('.');
    return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';
}

/**
 * Get file type from extension
 */
export type FileType = 'document' | 'spreadsheet' | 'presentation' | 'image' | 'video' | 'audio' | 'archive' | 'code' | 'folder' | 'other';

export function getFileType(filename: string): FileType {
    const ext = getFileExtension(filename);

    const typeMap: Record<string, FileType> = {
        doc: 'document', docx: 'document', pdf: 'document', txt: 'document', rtf: 'document', odt: 'document',
        xls: 'spreadsheet', xlsx: 'spreadsheet', csv: 'spreadsheet', ods: 'spreadsheet',
        ppt: 'presentation', pptx: 'presentation', odp: 'presentation',
        jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', bmp: 'image', svg: 'image', webp: 'image',
        mp4: 'video', avi: 'video', mov: 'video', wmv: 'video', mkv: 'video', webm: 'video',
        mp3: 'audio', wav: 'audio', flac: 'audio', aac: 'audio', ogg: 'audio',
        zip: 'archive', rar: 'archive', '7z': 'archive', tar: 'archive', gz: 'archive',
        js: 'code', ts: 'code', jsx: 'code', tsx: 'code', html: 'code', css: 'code', json: 'code', py: 'code',
    };

    return typeMap[ext] || 'other';
}

/**
 * Download file
 */
export function downloadFile(content: string | Blob, filename: string, type = 'text/plain') {
    const blob = content instanceof Blob ? content : new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Read file as text
 */
export function readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

/**
 * Read file as data URL
 */
export function readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * RGB to Hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

/**
 * Hex to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
}

/**
 * Get column letter from index (for spreadsheets)
 */
export function getColumnLetter(index: number): string {
    let letter = '';
    let temp = index;
    while (temp >= 0) {
        letter = String.fromCharCode((temp % 26) + 65) + letter;
        temp = Math.floor(temp / 26) - 1;
    }
    return letter;
}

/**
 * Get column index from letter
 */
export function getColumnIndex(letter: string): number {
    let index = 0;
    for (let i = 0; i < letter.length; i++) {
        index = index * 26 + (letter.charCodeAt(i) - 64);
    }
    return index - 1;
}

/**
 * Parse cell reference (e.g., "A1" -> { col: 0, row: 0 })
 */
export function parseCellReference(ref: string): { col: number; row: number } | null {
    const match = ref.match(/^([A-Z]+)(\d+)$/i);
    if (!match) return null;
    return {
        col: getColumnIndex(match[1].toUpperCase()),
        row: parseInt(match[2], 10) - 1,
    };
}

/**
 * Get cell reference from col/row
 */
export function getCellReference(col: number, row: number): string {
    return getColumnLetter(col) + (row + 1);
}

/**
 * Truncate text
 */
export function truncate(text: string, length: number, ellipsis = '...'): string {
    if (text.length <= length) return text;
    return text.substring(0, length - ellipsis.length) + ellipsis;
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * HTML to plain text
 */
export function htmlToPlainText(html: string): string {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
}

/**
 * Escape HTML
 */
export function escapeHtml(text: string): string {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Check if color is light
 */
export function isLightColor(hex: string): boolean {
    const rgb = hexToRgb(hex);
    if (!rgb) return true;
    const { r, g, b } = rgb;
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
}

/**
 * Office app colors
 */
export const officeColors = {
    word: '#2B579A',
    excel: '#217346',
    powerpoint: '#D24726',
    onedrive: '#0078D4',
} as const;

/**
 * Type-safe variant helper for cva (class-variance-authority)
 */
export type VariantProps<T extends (...args: unknown[]) => unknown> =
    T extends (props: infer P) => unknown ? P : never;
