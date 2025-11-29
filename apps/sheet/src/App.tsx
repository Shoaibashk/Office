import React, { useState, useCallback, useRef, useEffect } from 'react';

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
    // Safe math expression parser - only allows numbers and basic operators
    const result = safeEvaluateMath(evalExpression);
    return result !== null ? result : '#ERROR!';
  } catch {
    return '#ERROR!';
  }
}

// Safe math expression parser that doesn't use eval or Function constructor
function safeEvaluateMath(expr: string): number | null {
  // Remove all whitespace
  expr = expr.replace(/\s+/g, '');
  
  // Validate that expression only contains safe characters
  if (!/^[\d+\-*/().]+$/.test(expr)) {
    return null;
  }
  
  try {
    return parseExpression(expr);
  } catch {
    return null;
  }
}

function parseExpression(expr: string): number {
  let pos = 0;
  
  function parseNumber(): number {
    let numStr = '';
    while (pos < expr.length && (expr[pos] >= '0' && expr[pos] <= '9' || expr[pos] === '.')) {
      numStr += expr[pos++];
    }
    if (numStr === '') throw new Error('Expected number');
    return parseFloat(numStr);
  }
  
  function parseFactor(): number {
    if (expr[pos] === '(') {
      pos++; // skip '('
      const result = parseAddSub();
      if (expr[pos] !== ')') throw new Error('Expected )');
      pos++; // skip ')'
      return result;
    }
    if (expr[pos] === '-') {
      pos++;
      return -parseFactor();
    }
    if (expr[pos] === '+') {
      pos++;
      return parseFactor();
    }
    return parseNumber();
  }
  
  function parseMulDiv(): number {
    let left = parseFactor();
    while (pos < expr.length && (expr[pos] === '*' || expr[pos] === '/')) {
      const op = expr[pos++];
      const right = parseFactor();
      if (op === '*') left *= right;
      else left /= right;
    }
    return left;
  }
  
  function parseAddSub(): number {
    let left = parseMulDiv();
    while (pos < expr.length && (expr[pos] === '+' || expr[pos] === '-')) {
      const op = expr[pos++];
      const right = parseMulDiv();
      if (op === '+') left += right;
      else left -= right;
    }
    return left;
  }
  
  const result = parseAddSub();
  if (pos !== expr.length) throw new Error('Unexpected character');
  return result;
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

  return (
    <div className="min-h-screen flex flex-col" data-theme="corporate">
      {/* Header */}
      <div className="navbar bg-success text-success-content">
        <div className="flex-1 gap-2">
          <span className="text-xl font-bold">📊 Sheet</span>
          <input
            type="text"
            value={sheetName}
            onChange={(e) => setSheetName(e.target.value)}
            className="input input-sm bg-success/80 text-success-content"
            placeholder="Sheet name"
          />
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-base-200 p-2 flex flex-wrap gap-2 items-center border-b">
        <div className="badge badge-neutral font-mono">{selectedCell || ''}</div>
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
          className="input input-sm input-bordered flex-1 min-w-[300px]"
          placeholder="Enter value or formula (e.g., =SUM(A1:A3))"
        />
        
        <div className="divider divider-horizontal mx-1"></div>
        
        <button className="btn btn-sm btn-ghost" title="Bold"><strong>B</strong></button>
        <button className="btn btn-sm btn-ghost" title="Italic"><em>I</em></button>
        
        <div className="divider divider-horizontal mx-1"></div>
        
        <button className="btn btn-sm btn-ghost" title="Align Left">⬅️</button>
        <button className="btn btn-sm btn-ghost" title="Align Center">↔️</button>
        <button className="btn btn-sm btn-ghost" title="Align Right">➡️</button>
      </div>

      {/* Spreadsheet */}
      <div className="flex-1 overflow-auto bg-base-100">
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
    </div>
  );
}

export default App;
