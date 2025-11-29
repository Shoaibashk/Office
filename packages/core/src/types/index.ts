// User types
export interface User {
    id: string;
    email: string;
    displayName: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    language: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
    autoSave: boolean;
    autoSaveInterval: number; // in seconds
}

// File types
export type FileType = 'document' | 'spreadsheet' | 'presentation' | 'folder' | 'image' | 'pdf' | 'other';

export interface FileItem {
    id: string;
    name: string;
    type: FileType;
    mimeType?: string;
    size: number;
    parentId: string | null;
    path: string[];
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    modifiedBy: string;
    isStarred: boolean;
    isTrashed: boolean;
    trashedAt?: Date;
    sharedWith: SharedUser[];
    metadata?: Record<string, unknown>;
}

export interface SharedUser {
    userId: string;
    email: string;
    displayName: string;
    permission: 'view' | 'edit' | 'admin';
    sharedAt: Date;
}

// Document types (Word)
export interface Document {
    id: string;
    title: string;
    content: string; // HTML or JSON content
    wordCount: number;
    characterCount: number;
    pageCount: number;
    createdAt: Date;
    updatedAt: Date;
    lastSavedAt?: Date;
}

export interface DocumentFormatting {
    fontFamily: string;
    fontSize: number;
    fontColor: string;
    backgroundColor: string;
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
    subscript: boolean;
    superscript: boolean;
    textAlign: 'left' | 'center' | 'right' | 'justify';
    lineHeight: number;
    letterSpacing: number;
}

// Spreadsheet types (Sheet)
export interface Spreadsheet {
    id: string;
    title: string;
    sheets: Sheet[];
    activeSheetId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Sheet {
    id: string;
    name: string;
    cells: Record<string, Cell>;
    columnWidths: Record<number, number>;
    rowHeights: Record<number, number>;
    frozenRows: number;
    frozenColumns: number;
    hiddenRows: number[];
    hiddenColumns: number[];
}

export interface Cell {
    value: CellValue;
    formula?: string;
    format: CellFormat;
    comment?: string;
    validation?: CellValidation;
}

export type CellValue = string | number | boolean | null | Date;

export interface CellFormat {
    fontFamily?: string;
    fontSize?: number;
    fontColor?: string;
    backgroundColor?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    textAlign?: 'left' | 'center' | 'right';
    verticalAlign?: 'top' | 'middle' | 'bottom';
    numberFormat?: string;
    wrapText?: boolean;
    borderTop?: Border;
    borderRight?: Border;
    borderBottom?: Border;
    borderLeft?: Border;
}

export interface Border {
    style: 'thin' | 'medium' | 'thick' | 'dashed' | 'dotted';
    color: string;
}

export interface CellValidation {
    type: 'list' | 'number' | 'date' | 'text' | 'custom';
    rule: unknown;
    errorMessage?: string;
}

export interface CellRange {
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
}

// Presentation types (Slides)
export interface Presentation {
    id: string;
    title: string;
    slides: Slide[];
    activeSlideId: string;
    theme: PresentationTheme;
    createdAt: Date;
    updatedAt: Date;
}

export interface Slide {
    id: string;
    order: number;
    elements: SlideElement[];
    background: SlideBackground;
    notes: string;
    transition: SlideTransition;
}

export interface SlideElement {
    id: string;
    type: 'text' | 'image' | 'shape' | 'chart' | 'table' | 'video';
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    zIndex: number;
    locked: boolean;
    opacity: number;
    content: unknown;
    style: Record<string, unknown>;
}

export interface SlideBackground {
    type: 'solid' | 'gradient' | 'image';
    value: string;
}

export interface SlideTransition {
    type: 'none' | 'fade' | 'slide' | 'zoom' | 'flip';
    duration: number;
    direction?: 'left' | 'right' | 'up' | 'down';
}

export interface PresentationTheme {
    id: string;
    name: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
    headingFontFamily: string;
}

// Notification types
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
    createdAt: Date;
}

// Command palette types
export interface Command {
    id: string;
    label: string;
    description?: string;
    icon?: string;
    shortcut?: string[];
    action: () => void;
    category?: string;
}

// History types for undo/redo
export interface HistoryState<T> {
    past: T[];
    present: T;
    future: T[];
}
