import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Layout, Toolbar, ToolbarButton, ToolbarDivider } from '@office/ui';

const ROWS = 100;
const COLS = 26;

type CellData = {
  value: string;
  formula?: string;
};

type SheetData = { [key: string]: CellData };

function getColumnLabel(col: number): string {
  return String.fromCharCode(65 + col);
}

function getCellId(row: number, col: number): string {
  return `${getColumnLabel(col)}${row + 1}`;
}

function parseCellRef(ref: string): { row: number; col: number } | null {
  const match = ref.match(/^([A-Z]+)(\d+)$/);
  if (!match) return null;
  const col = match[1].charCodeAt(0) - 65;
  const row = parseInt(match[2], 10) - 1;
  return { row, col };
}

function evaluateFormula(formula: string, data: SheetData, visited: Set<string> = new Set()): number | string {
  if (!formula.startsWith('=')) return formula;
  
  const expression = formula.substring(1).toUpperCase();
  
  // Handle SUM function
  const sumMatch = expression.match(/^SUM\(([A-Z]\d+):([A-Z]\d+)\)$/);
  if (sumMatch) {
    const start = parseCellRef(sumMatch[1]);
    const end = parseCellRef(sumMatch[2]);
    if (!start || !end) return '#ERROR!';
    
    let sum = 0;
    for (let r = start.row; r <= end.row; r++) {
      for (let c = start.col; c <= end.col; c++) {
        const cellId = getCellId(r, c);
        const cellValue = getCellValue(cellId, data, visited);
        const num = parseFloat(String(cellValue));
        if (!isNaN(num)) sum += num;
      }
    }
    return sum;
  }

  // Handle AVERAGE function
  const avgMatch = expression.match(/^AVERAGE\(([A-Z]\d+):([A-Z]\d+)\)$/);
  if (avgMatch) {
    const start = parseCellRef(avgMatch[1]);
    const end = parseCellRef(avgMatch[2]);
    if (!start || !end) return '#ERROR!';
    
    let sum = 0;
    let count = 0;
    for (let r = start.row; r <= end.row; r++) {
      for (let c = start.col; c <= end.col; c++) {
        const cellId = getCellId(r, c);
        const cellValue = getCellValue(cellId, data, visited);
        const num = parseFloat(String(cellValue));
        if (!isNaN(num)) {
          sum += num;
          count++;
        }
      }
    }
    return count > 0 ? sum / count : 0;
  }

  // Handle simple arithmetic with cell references
  let evalExpression = expression;
  const cellRefs = expression.match(/[A-Z]\d+/g) || [];
  
  for (const ref of cellRefs) {
    if (visited.has(ref)) return '#CIRCULAR!';
    const cellValue = getCellValue(ref, data, visited);
    const num = parseFloat(String(cellValue));
    evalExpression = evalExpression.replace(ref, isNaN(num) ? '0' : String(num));
  }

  try {
    // Simple eval for basic math - in production use a proper parser
    // Only allow numbers and basic operators
    if (/^[\d\s+\-*/().]+$/.test(evalExpression)) {
      const result = Function(`"use strict"; return (${evalExpression})`)();
      return typeof result === 'number' && !isNaN(result) ? result : '#ERROR!';
    }
    return '#ERROR!';
  } catch {
    return '#ERROR!';
  }
}

function getCellValue(cellId: string, data: SheetData, visited: Set<string> = new Set()): string | number {
  const cell = data[cellId];
  if (!cell) return '';
  
  if (cell.formula) {
    const newVisited = new Set(visited);
    newVisited.add(cellId);
    return evaluateFormula(cell.formula, data, newVisited);
  }
  
  return cell.value;
}

function App() {
  const [data, setData] = useState<SheetData>({
    'A1': { value: '100' },
    'A2': { value: '200' },
    'A3': { value: '300' },
    'A4': { value: '', formula: '=SUM(A1:A3)' },
    'B1': { value: 'Product A' },
    'B2': { value: 'Product B' },
    'B3': { value: 'Product C' },
    'B4': { value: 'Total' },
  });
  const [selectedCell, setSelectedCell] = useState<string | null>('A1');
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [sheetName, setSheetName] = useState('Sheet1');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingCell]);

  const handleCellClick = useCallback((cellId: string) => {
    setSelectedCell(cellId);
  }, []);

  const handleCellDoubleClick = useCallback((cellId: string) => {
    const cell = data[cellId];
    setEditingCell(cellId);
    setEditValue(cell?.formula || cell?.value || '');
  }, [data]);

  const handleCellBlur = useCallback(() => {
    if (editingCell) {
      const isFormula = editValue.startsWith('=');
      setData(prev => ({
        ...prev,
        [editingCell]: {
          value: isFormula ? '' : editValue,
          formula: isFormula ? editValue : undefined,
        }
      }));
      setEditingCell(null);
      setEditValue('');
    }
  }, [editingCell, editValue]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCellBlur();
      // Move to next row
      if (selectedCell) {
        const ref = parseCellRef(selectedCell);
        if (ref && ref.row < ROWS - 1) {
          setSelectedCell(getCellId(ref.row + 1, ref.col));
        }
      }
    } else if (e.key === 'Escape') {
      setEditingCell(null);
      setEditValue('');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleCellBlur();
      // Move to next column
      if (selectedCell) {
        const ref = parseCellRef(selectedCell);
        if (ref && ref.col < COLS - 1) {
          setSelectedCell(getCellId(ref.row, ref.col + 1));
        }
      }
    }
  }, [handleCellBlur, selectedCell]);

  const handleStartEdit = useCallback(() => {
    if (selectedCell && !editingCell) {
      const cell = data[selectedCell];
      setEditingCell(selectedCell);
      setEditValue(cell?.formula || cell?.value || '');
    }
  }, [selectedCell, editingCell, data]);

  const getCurrentCellDisplay = () => {
    if (!selectedCell) return '';
    const cell = data[selectedCell];
    return cell?.formula || cell?.value || '';
  };

  const header = (
    <div className="flex flex-col">
      <div className="flex items-center gap-4 px-4 py-2 bg-green-600">
        <span className="text-xl font-bold text-white">📊 Mini Excel</span>
        <input
          type="text"
          value={sheetName}
          onChange={(e) => setSheetName(e.target.value)}
          className="bg-green-500 text-white px-2 py-1 rounded border-none outline-none placeholder-green-200"
          placeholder="Sheet name"
        />
      </div>
      <Toolbar>
        <div className="flex items-center gap-2 px-2">
          <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm min-w-[50px]">
            {selectedCell || ''}
          </span>
          <input
            type="text"
            value={editingCell ? editValue : getCurrentCellDisplay()}
            onChange={(e) => {
              if (editingCell) {
                setEditValue(e.target.value);
              } else {
                handleStartEdit();
                setEditValue(e.target.value);
              }
            }}
            onKeyDown={handleKeyDown}
            onBlur={handleCellBlur}
            className="flex-1 border rounded px-2 py-1 text-sm min-w-[300px]"
            placeholder="Enter value or formula (e.g., =SUM(A1:A3))"
          />
        </div>
        <ToolbarDivider />
        <ToolbarButton tooltip="Bold">
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton tooltip="Italic">
          <em>I</em>
        </ToolbarButton>
        <ToolbarDivider />
        <ToolbarButton tooltip="Align Left">⬅️</ToolbarButton>
        <ToolbarButton tooltip="Align Center">↔️</ToolbarButton>
        <ToolbarButton tooltip="Align Right">➡️</ToolbarButton>
      </Toolbar>
    </div>
  );

  return (
    <Layout header={header}>
      <div className="overflow-auto h-full">
        <div className="spreadsheet inline-block" style={{ 
          gridTemplateColumns: `50px repeat(${COLS}, 100px)` 
        }}>
          {/* Header row */}
          <div className="cell cell-header row-header"></div>
          {Array.from({ length: COLS }, (_, col) => (
            <div key={`header-${col}`} className="cell cell-header">
              {getColumnLabel(col)}
            </div>
          ))}
          
          {/* Data rows */}
          {Array.from({ length: 50 }, (_, row) => (
            <React.Fragment key={`row-${row}`}>
              <div className="cell cell-header row-header">
                {row + 1}
              </div>
              {Array.from({ length: COLS }, (_, col) => {
                const cellId = getCellId(row, col);
                const isSelected = selectedCell === cellId;
                const isEditing = editingCell === cellId;
                const cellData = data[cellId];
                const displayValue = cellData 
                  ? getCellValue(cellId, data) 
                  : '';
                
                return (
                  <div
                    key={cellId}
                    className={`cell ${isSelected ? 'cell-selected' : ''}`}
                    onClick={() => handleCellClick(cellId)}
                    onDoubleClick={() => handleCellDoubleClick(cellId)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (!isEditing && e.key.length === 1) {
                        handleStartEdit();
                      }
                    }}
                  >
                    {isEditing ? (
                      <input
                        ref={inputRef}
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleCellBlur}
                        onKeyDown={handleKeyDown}
                        className="w-full h-full border-none outline-none bg-transparent"
                      />
                    ) : (
                      displayValue
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default App;
