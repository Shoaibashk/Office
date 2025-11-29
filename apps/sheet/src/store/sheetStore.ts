import { create } from 'zustand';
import { Parser } from 'hot-formula-parser';

export interface CellData {
    value: string | number | null;
    formula?: string;
    format?: CellFormat;
    computedValue?: string | number | null;
    error?: string;
}

export interface CellFormat {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    fontFamily?: string;
    fontSize?: number;
    textColor?: string;
    backgroundColor?: string;
    textAlign?: 'left' | 'center' | 'right';
    verticalAlign?: 'top' | 'middle' | 'bottom';
    numberFormat?: string; // e.g., "currency", "percent", "date"
    wrap?: boolean;
    borders?: {
        top?: string;
        right?: string;
        bottom?: string;
        left?: string;
    };
}

export interface CellRange {
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
}

export interface Sheet {
    id: string;
    name: string;
    cells: Map<string, CellData>;
    columnWidths: Map<number, number>;
    rowHeights: Map<number, number>;
    frozenRows: number;
    frozenCols: number;
}

export interface SheetStore {
    // Spreadsheet data
    sheets: Sheet[];
    activeSheetId: string;

    // Selection state
    selectedCell: { row: number; col: number } | null;
    selectedRange: CellRange | null;
    isEditing: boolean;
    editValue: string;

    // View state
    scrollPosition: { x: number; y: number };
    zoom: number;
    showGridlines: boolean;
    showFormulas: boolean;
    showHeaders: boolean;

    // Formula parser
    parser: Parser;

    // Sheet actions
    addSheet: (name?: string) => void;
    removeSheet: (id: string) => void;
    renameSheet: (id: string, name: string) => void;
    setActiveSheet: (id: string) => void;
    duplicateSheet: (id: string) => void;

    // Cell actions
    getCell: (row: number, col: number) => CellData | undefined;
    setCell: (row: number, col: number, value: string | number | null) => void;
    setCellFormula: (row: number, col: number, formula: string) => void;
    setCellFormat: (row: number, col: number, format: Partial<CellFormat>) => void;
    clearCell: (row: number, col: number) => void;
    clearRange: (range: CellRange) => void;

    // Selection actions
    selectCell: (row: number, col: number, extend?: boolean) => void;
    selectRange: (range: CellRange) => void;
    clearSelection: () => void;

    // Editing actions
    startEditing: (value?: string) => void;
    setEditValue: (value: string) => void;
    commitEdit: () => void;
    cancelEdit: () => void;

    // Row/Column actions
    setColumnWidth: (col: number, width: number) => void;
    setRowHeight: (row: number, height: number) => void;
    insertRow: (afterRow: number) => void;
    insertColumn: (afterCol: number) => void;
    deleteRow: (row: number) => void;
    deleteColumn: (col: number) => void;

    // View actions
    setZoom: (zoom: number) => void;
    setScrollPosition: (pos: { x: number; y: number }) => void;
    toggleGridlines: () => void;
    toggleFormulas: () => void;
    toggleHeaders: () => void;

    // Format actions
    formatSelectedCells: (format: Partial<CellFormat>) => void;

    // Utility
    getCellKey: (row: number, col: number) => string;
    parseCellKey: (key: string) => { row: number; col: number };
    columnToLetter: (col: number) => string;
    letterToColumn: (letter: string) => number;
    evaluateFormula: (formula: string, row: number, col: number) => any;
}

// Helper functions
function columnToLetter(col: number): string {
    let result = '';
    while (col >= 0) {
        result = String.fromCharCode((col % 26) + 65) + result;
        col = Math.floor(col / 26) - 1;
    }
    return result;
}

function letterToColumn(letter: string): number {
    let col = 0;
    for (let i = 0; i < letter.length; i++) {
        col = col * 26 + letter.charCodeAt(i) - 64;
    }
    return col - 1;
}

function getCellKey(row: number, col: number): string {
    return `${columnToLetter(col)}${row + 1}`;
}

function parseCellKey(key: string): { row: number; col: number } {
    const match = key.match(/^([A-Z]+)(\d+)$/);
    if (!match) return { row: 0, col: 0 };
    return {
        row: parseInt(match[2]) - 1,
        col: letterToColumn(match[1]),
    };
}

// Create initial sheet
function createSheet(name: string): Sheet {
    return {
        id: crypto.randomUUID(),
        name,
        cells: new Map(),
        columnWidths: new Map(),
        rowHeights: new Map(),
        frozenRows: 0,
        frozenCols: 0,
    };
}

// Initialize with sample data
function createInitialSheets(): Sheet[] {
    const sheet = createSheet('Sheet1');

    // Add some sample data
    const sampleData: [number, number, string | number][] = [
        [0, 0, 'Product'],
        [0, 1, 'Q1'],
        [0, 2, 'Q2'],
        [0, 3, 'Q3'],
        [0, 4, 'Q4'],
        [0, 5, 'Total'],
        [1, 0, 'Widget A'],
        [1, 1, 1200],
        [1, 2, 1500],
        [1, 3, 1800],
        [1, 4, 2100],
        [2, 0, 'Widget B'],
        [2, 1, 800],
        [2, 2, 950],
        [2, 3, 1100],
        [2, 4, 1250],
        [3, 0, 'Widget C'],
        [3, 1, 500],
        [3, 2, 620],
        [3, 3, 750],
        [3, 4, 880],
        [4, 0, 'Total'],
    ];

    sampleData.forEach(([row, col, value]) => {
        const key = getCellKey(row, col);
        sheet.cells.set(key, { value });
    });

    // Add formulas for totals
    sheet.cells.set('F2', { value: null, formula: '=SUM(B2:E2)' });
    sheet.cells.set('F3', { value: null, formula: '=SUM(B3:E3)' });
    sheet.cells.set('F4', { value: null, formula: '=SUM(B4:E4)' });
    sheet.cells.set('B5', { value: null, formula: '=SUM(B2:B4)' });
    sheet.cells.set('C5', { value: null, formula: '=SUM(C2:C4)' });
    sheet.cells.set('D5', { value: null, formula: '=SUM(D2:D4)' });
    sheet.cells.set('E5', { value: null, formula: '=SUM(E2:E4)' });
    sheet.cells.set('F5', { value: null, formula: '=SUM(F2:F4)' });

    // Format header row
    for (let col = 0; col <= 5; col++) {
        const key = getCellKey(0, col);
        const cell = sheet.cells.get(key);
        if (cell) {
            cell.format = { bold: true, backgroundColor: '#e5e7eb' };
        }
    }

    return [sheet];
}

export const useSheetStore = create<SheetStore>((set, get) => {
    const parser = new Parser();

    // Configure parser to get cell values
    parser.on('callCellValue', (cellCoord: { row: { index: number }; column: { index: number } }, done: (value: any) => void) => {
        const state = get();
        const sheet = state.sheets.find(s => s.id === state.activeSheetId);
        if (!sheet) {
            done(null);
            return;
        }

        const key = getCellKey(cellCoord.row.index, cellCoord.column.index);
        const cell = sheet.cells.get(key);

        if (cell?.formula) {
            // Recursively evaluate formula
            const result = state.evaluateFormula(cell.formula, cellCoord.row.index, cellCoord.column.index);
            done(result);
        } else {
            done(cell?.value ?? null);
        }
    });

    // Configure parser to get cell range values
    parser.on('callRangeValue', (startCoord: any, endCoord: any, done: (values: any[][]) => void) => {
        const state = get();
        const sheet = state.sheets.find(s => s.id === state.activeSheetId);
        if (!sheet) {
            done([]);
            return;
        }

        const values: any[][] = [];
        for (let row = startCoord.row.index; row <= endCoord.row.index; row++) {
            const rowValues: any[] = [];
            for (let col = startCoord.column.index; col <= endCoord.column.index; col++) {
                const key = getCellKey(row, col);
                const cell = sheet.cells.get(key);
                if (cell?.formula) {
                    rowValues.push(state.evaluateFormula(cell.formula, row, col));
                } else {
                    rowValues.push(cell?.value ?? null);
                }
            }
            values.push(rowValues);
        }
        done(values);
    });

    const initialSheets = createInitialSheets();

    return {
        sheets: initialSheets,
        activeSheetId: initialSheets[0].id,
        selectedCell: { row: 0, col: 0 },
        selectedRange: null,
        isEditing: false,
        editValue: '',
        scrollPosition: { x: 0, y: 0 },
        zoom: 100,
        showGridlines: true,
        showFormulas: false,
        showHeaders: true,
        parser,

        // Sheet actions
        addSheet: (name) => set((state) => {
            const sheetNum = state.sheets.length + 1;
            const newSheet = createSheet(name ?? `Sheet${sheetNum}`);
            return {
                sheets: [...state.sheets, newSheet],
                activeSheetId: newSheet.id,
            };
        }),

        removeSheet: (id) => set((state) => {
            if (state.sheets.length <= 1) return state;
            const newSheets = state.sheets.filter(s => s.id !== id);
            return {
                sheets: newSheets,
                activeSheetId: state.activeSheetId === id ? newSheets[0].id : state.activeSheetId,
            };
        }),

        renameSheet: (id, name) => set((state) => ({
            sheets: state.sheets.map(s => s.id === id ? { ...s, name } : s),
        })),

        setActiveSheet: (id) => set({ activeSheetId: id, selectedCell: { row: 0, col: 0 }, selectedRange: null }),

        duplicateSheet: (id) => set((state) => {
            const sheet = state.sheets.find(s => s.id === id);
            if (!sheet) return state;

            const newSheet: Sheet = {
                ...sheet,
                id: crypto.randomUUID(),
                name: `${sheet.name} (Copy)`,
                cells: new Map(sheet.cells),
                columnWidths: new Map(sheet.columnWidths),
                rowHeights: new Map(sheet.rowHeights),
            };

            return {
                sheets: [...state.sheets, newSheet],
                activeSheetId: newSheet.id,
            };
        }),

        // Cell actions
        getCell: (row, col) => {
            const state = get();
            const sheet = state.sheets.find(s => s.id === state.activeSheetId);
            if (!sheet) return undefined;
            return sheet.cells.get(getCellKey(row, col));
        },

        setCell: (row, col, value) => set((state) => {
            const sheet = state.sheets.find(s => s.id === state.activeSheetId);
            if (!sheet) return state;

            const key = getCellKey(row, col);
            const existingCell = sheet.cells.get(key);

            const newCells = new Map(sheet.cells);
            newCells.set(key, {
                ...existingCell,
                value,
                formula: undefined, // Clear formula when setting direct value
            });

            return {
                sheets: state.sheets.map(s =>
                    s.id === state.activeSheetId ? { ...s, cells: newCells } : s
                ),
            };
        }),

        setCellFormula: (row, col, formula) => set((state) => {
            const sheet = state.sheets.find(s => s.id === state.activeSheetId);
            if (!sheet) return state;

            const key = getCellKey(row, col);
            const existingCell = sheet.cells.get(key);

            const newCells = new Map(sheet.cells);
            newCells.set(key, {
                ...existingCell,
                value: null,
                formula,
            });

            return {
                sheets: state.sheets.map(s =>
                    s.id === state.activeSheetId ? { ...s, cells: newCells } : s
                ),
            };
        }),

        setCellFormat: (row, col, format) => set((state) => {
            const sheet = state.sheets.find(s => s.id === state.activeSheetId);
            if (!sheet) return state;

            const key = getCellKey(row, col);
            const existingCell = sheet.cells.get(key) ?? { value: null };

            const newCells = new Map(sheet.cells);
            newCells.set(key, {
                ...existingCell,
                format: { ...existingCell.format, ...format },
            });

            return {
                sheets: state.sheets.map(s =>
                    s.id === state.activeSheetId ? { ...s, cells: newCells } : s
                ),
            };
        }),

        clearCell: (row, col) => set((state) => {
            const sheet = state.sheets.find(s => s.id === state.activeSheetId);
            if (!sheet) return state;

            const key = getCellKey(row, col);
            const newCells = new Map(sheet.cells);
            newCells.delete(key);

            return {
                sheets: state.sheets.map(s =>
                    s.id === state.activeSheetId ? { ...s, cells: newCells } : s
                ),
            };
        }),

        clearRange: (range) => set((state) => {
            const sheet = state.sheets.find(s => s.id === state.activeSheetId);
            if (!sheet) return state;

            const newCells = new Map(sheet.cells);
            for (let row = range.startRow; row <= range.endRow; row++) {
                for (let col = range.startCol; col <= range.endCol; col++) {
                    newCells.delete(getCellKey(row, col));
                }
            }

            return {
                sheets: state.sheets.map(s =>
                    s.id === state.activeSheetId ? { ...s, cells: newCells } : s
                ),
            };
        }),

        // Selection actions
        selectCell: (row, col, extend = false) => set((state) => {
            if (extend && state.selectedCell) {
                return {
                    selectedRange: {
                        startRow: Math.min(state.selectedCell.row, row),
                        startCol: Math.min(state.selectedCell.col, col),
                        endRow: Math.max(state.selectedCell.row, row),
                        endCol: Math.max(state.selectedCell.col, col),
                    },
                };
            }
            return {
                selectedCell: { row, col },
                selectedRange: null,
                isEditing: false,
            };
        }),

        selectRange: (range) => set({ selectedRange: range }),

        clearSelection: () => set({ selectedCell: null, selectedRange: null }),

        // Editing actions
        startEditing: (value) => set((state) => {
            const cell = state.selectedCell ? state.getCell(state.selectedCell.row, state.selectedCell.col) : undefined;
            return {
                isEditing: true,
                editValue: value ?? cell?.formula ?? String(cell?.value ?? ''),
            };
        }),

        setEditValue: (value) => set({ editValue: value }),

        commitEdit: () => {
            const state = get();
            if (!state.selectedCell || !state.isEditing) return;

            const { row, col } = state.selectedCell;
            const value = state.editValue.trim();

            if (value.startsWith('=')) {
                state.setCellFormula(row, col, value);
            } else {
                const numValue = parseFloat(value);
                state.setCell(row, col, isNaN(numValue) ? value : numValue);
            }

            set({ isEditing: false, editValue: '' });
        },

        cancelEdit: () => set({ isEditing: false, editValue: '' }),

        // Row/Column actions
        setColumnWidth: (col, width) => set((state) => {
            const sheet = state.sheets.find(s => s.id === state.activeSheetId);
            if (!sheet) return state;

            const newWidths = new Map(sheet.columnWidths);
            newWidths.set(col, Math.max(30, width));

            return {
                sheets: state.sheets.map(s =>
                    s.id === state.activeSheetId ? { ...s, columnWidths: newWidths } : s
                ),
            };
        }),

        setRowHeight: (row, height) => set((state) => {
            const sheet = state.sheets.find(s => s.id === state.activeSheetId);
            if (!sheet) return state;

            const newHeights = new Map(sheet.rowHeights);
            newHeights.set(row, Math.max(20, height));

            return {
                sheets: state.sheets.map(s =>
                    s.id === state.activeSheetId ? { ...s, rowHeights: newHeights } : s
                ),
            };
        }),

        insertRow: (afterRow) => set((state) => {
            const sheet = state.sheets.find(s => s.id === state.activeSheetId);
            if (!sheet) return state;

            // Shift all cells down
            const newCells = new Map<string, CellData>();
            sheet.cells.forEach((cell, key) => {
                const { row, col } = parseCellKey(key);
                if (row > afterRow) {
                    newCells.set(getCellKey(row + 1, col), cell);
                } else {
                    newCells.set(key, cell);
                }
            });

            return {
                sheets: state.sheets.map(s =>
                    s.id === state.activeSheetId ? { ...s, cells: newCells } : s
                ),
            };
        }),

        insertColumn: (afterCol) => set((state) => {
            const sheet = state.sheets.find(s => s.id === state.activeSheetId);
            if (!sheet) return state;

            // Shift all cells right
            const newCells = new Map<string, CellData>();
            sheet.cells.forEach((cell, key) => {
                const { row, col } = parseCellKey(key);
                if (col > afterCol) {
                    newCells.set(getCellKey(row, col + 1), cell);
                } else {
                    newCells.set(key, cell);
                }
            });

            return {
                sheets: state.sheets.map(s =>
                    s.id === state.activeSheetId ? { ...s, cells: newCells } : s
                ),
            };
        }),

        deleteRow: (row) => set((state) => {
            const sheet = state.sheets.find(s => s.id === state.activeSheetId);
            if (!sheet) return state;

            const newCells = new Map<string, CellData>();
            sheet.cells.forEach((cell, key) => {
                const parsed = parseCellKey(key);
                if (parsed.row < row) {
                    newCells.set(key, cell);
                } else if (parsed.row > row) {
                    newCells.set(getCellKey(parsed.row - 1, parsed.col), cell);
                }
                // Skip cells in the deleted row
            });

            return {
                sheets: state.sheets.map(s =>
                    s.id === state.activeSheetId ? { ...s, cells: newCells } : s
                ),
            };
        }),

        deleteColumn: (col) => set((state) => {
            const sheet = state.sheets.find(s => s.id === state.activeSheetId);
            if (!sheet) return state;

            const newCells = new Map<string, CellData>();
            sheet.cells.forEach((cell, key) => {
                const parsed = parseCellKey(key);
                if (parsed.col < col) {
                    newCells.set(key, cell);
                } else if (parsed.col > col) {
                    newCells.set(getCellKey(parsed.row, parsed.col - 1), cell);
                }
                // Skip cells in the deleted column
            });

            return {
                sheets: state.sheets.map(s =>
                    s.id === state.activeSheetId ? { ...s, cells: newCells } : s
                ),
            };
        }),

        // View actions
        setZoom: (zoom) => set({ zoom: Math.max(25, Math.min(400, zoom)) }),

        setScrollPosition: (pos) => set({ scrollPosition: pos }),

        toggleGridlines: () => set((state) => ({ showGridlines: !state.showGridlines })),

        toggleFormulas: () => set((state) => ({ showFormulas: !state.showFormulas })),

        toggleHeaders: () => set((state) => ({ showHeaders: !state.showHeaders })),

        // Format actions
        formatSelectedCells: (format) => {
            const state = get();
            if (!state.selectedCell) return;

            if (state.selectedRange) {
                for (let row = state.selectedRange.startRow; row <= state.selectedRange.endRow; row++) {
                    for (let col = state.selectedRange.startCol; col <= state.selectedRange.endCol; col++) {
                        state.setCellFormat(row, col, format);
                    }
                }
            } else {
                state.setCellFormat(state.selectedCell.row, state.selectedCell.col, format);
            }
        },

        // Utility
        getCellKey,
        parseCellKey,
        columnToLetter,
        letterToColumn,

        evaluateFormula: (formula, row, col) => {
            const state = get();
            try {
                const result = state.parser.parse(formula.slice(1)); // Remove leading '='
                if (result.error) {
                    return `#${result.error}`;
                }
                return result.result;
            } catch (e) {
                return '#ERROR!';
            }
        },
    };
});
