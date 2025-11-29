import { useCallback, useRef, useEffect, useState } from "react";
import { Flex, Box, Text, ScrollArea, Avatar } from "@radix-ui/themes";
import {
  FontBoldIcon,
  FontItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  PlusIcon,
  MinusIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
  MagnifyingGlassIcon,
  TableIcon,
  Share1Icon,
  DownloadIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";
import {
  Button,
  IconButton,
  Input,
  SimpleTooltip,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@office/ui";
import { useSheetStore, CellData } from "../store/sheetStore";

// Constants
const DEFAULT_COL_WIDTH = 100;
const DEFAULT_ROW_HEIGHT = 24;
const HEADER_WIDTH = 50;
const HEADER_HEIGHT = 24;
const VISIBLE_ROWS = 50;
const VISIBLE_COLS = 26;

// Cell component
function Cell({
  row,
  col,
  cell,
  isSelected,
  isInRange,
  width,
  height,
  showFormulas,
}: {
  row: number;
  col: number;
  cell: CellData | undefined;
  isSelected: boolean;
  isInRange: boolean;
  width: number;
  height: number;
  showFormulas: boolean;
}) {
  const {
    selectCell,
    startEditing,
    isEditing,
    editValue,
    setEditValue,
    commitEdit,
    cancelEdit,
    evaluateFormula,
    selectedCell,
  } = useSheetStore();

  const isCurrentlyEditing = isEditing && isSelected;

  // Get display value
  let displayValue = "";
  if (showFormulas && cell?.formula) {
    displayValue = cell.formula;
  } else if (cell?.formula) {
    const result = evaluateFormula(cell.formula, row, col);
    displayValue = String(result ?? "");
  } else {
    displayValue = String(cell?.value ?? "");
  }

  const handleDoubleClick = () => {
    startEditing();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      commitEdit();
      // Move to next row
      selectCell(row + 1, col);
    } else if (e.key === "Tab") {
      e.preventDefault();
      commitEdit();
      // Move to next column
      selectCell(row, col + 1);
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  const format = cell?.format ?? {};

  const cellStyle: React.CSSProperties = {
    width,
    height,
    fontWeight: format.bold ? "bold" : "normal",
    fontStyle: format.italic ? "italic" : "normal",
    textDecoration:
      [
        format.underline ? "underline" : "",
        format.strikethrough ? "line-through" : "",
      ]
        .filter(Boolean)
        .join(" ") || "none",
    color: format.textColor ?? "inherit",
    backgroundColor:
      format.backgroundColor ??
      (isSelected ? "#e3f2fd" : isInRange ? "#f3f4f6" : "white"),
    textAlign: format.textAlign ?? "left",
    fontFamily: format.fontFamily,
    fontSize: format.fontSize ? `${format.fontSize}pt` : undefined,
  };

  return (
    <div
      className={`cell ${isSelected ? "selected" : ""} ${
        isInRange ? "in-range" : ""
      }`}
      style={cellStyle}
      onClick={() => selectCell(row, col)}
      onDoubleClick={handleDoubleClick}
    >
      {isCurrentlyEditing ? (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commitEdit}
          className="cell-input"
          autoFocus
        />
      ) : (
        <span className="cell-content">{displayValue}</span>
      )}
    </div>
  );
}

// Column header component
function ColumnHeader({ col, width }: { col: number; width: number }) {
  const { columnToLetter, selectCell } = useSheetStore();

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className="column-header"
          style={{ width }}
          onClick={() => {
            // Select entire column
          }}
        >
          {columnToLetter(col)}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Insert column left</ContextMenuItem>
        <ContextMenuItem>Insert column right</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem destructive>Delete column</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Column width...</ContextMenuItem>
        <ContextMenuItem>Hide column</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

// Row header component
function RowHeader({ row, height }: { row: number; height: number }) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="row-header" style={{ height }}>
          {row + 1}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Insert row above</ContextMenuItem>
        <ContextMenuItem>Insert row below</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem destructive>Delete row</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Row height...</ContextMenuItem>
        <ContextMenuItem>Hide row</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

// Formula bar component
function FormulaBar() {
  const {
    selectedCell,
    getCell,
    columnToLetter,
    isEditing,
    editValue,
    setEditValue,
    startEditing,
    commitEdit,
    cancelEdit,
  } = useSheetStore();

  const cell = selectedCell
    ? getCell(selectedCell.row, selectedCell.col)
    : undefined;
  const cellRef = selectedCell
    ? `${columnToLetter(selectedCell.col)}${selectedCell.row + 1}`
    : "";

  const displayValue = isEditing
    ? editValue
    : cell?.formula ?? String(cell?.value ?? "");

  return (
    <Flex
      align="center"
      className="h-8 border-b border-gray-200 bg-white px-2 gap-2"
    >
      {/* Cell reference */}
      <Box className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center bg-gray-50">
        {cellRef}
      </Box>

      {/* fx label */}
      <Text className="text-gray-400 font-medium">fx</Text>

      {/* Formula input */}
      <input
        type="text"
        value={displayValue}
        onChange={(e) => setEditValue(e.target.value)}
        onFocus={() => !isEditing && startEditing()}
        onBlur={commitEdit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commitEdit();
          if (e.key === "Escape") cancelEdit();
        }}
        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        placeholder="Enter a value or formula"
      />
    </Flex>
  );
}

// Toolbar component
function SheetToolbar() {
  const { formatSelectedCells, selectedCell, getCell } = useSheetStore();

  const cell = selectedCell
    ? getCell(selectedCell.row, selectedCell.col)
    : undefined;
  const format = cell?.format ?? {};

  return (
    <Box className="border-b border-gray-200 bg-white px-4 py-2">
      {/* Tabs */}
      <Flex className="mb-2 border-b border-gray-100 pb-2">
        <button className="px-4 py-1 text-sm font-medium text-green-600 border-b-2 border-green-600">
          Home
        </button>
        <button className="px-4 py-1 text-sm text-gray-600 hover:text-gray-900">
          Insert
        </button>
        <button className="px-4 py-1 text-sm text-gray-600 hover:text-gray-900">
          Formulas
        </button>
        <button className="px-4 py-1 text-sm text-gray-600 hover:text-gray-900">
          Data
        </button>
        <button className="px-4 py-1 text-sm text-gray-600 hover:text-gray-900">
          View
        </button>
      </Flex>

      {/* Toolbar */}
      <Flex align="center" gap="4" wrap="wrap">
        {/* Font group */}
        <Flex direction="column" className="border-r border-gray-200 pr-4">
          <Flex gap="1" align="center" className="mb-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="1"
                  variant="ghost"
                  className="w-28 justify-between"
                >
                  <span className="truncate">
                    {format.fontFamily ?? "Arial"}
                  </span>
                  <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {[
                  "Arial",
                  "Calibri",
                  "Times New Roman",
                  "Verdana",
                  "Georgia",
                ].map((font) => (
                  <DropdownMenuItem
                    key={font}
                    onClick={() => formatSelectedCells({ fontFamily: font })}
                  >
                    <span style={{ fontFamily: font }}>{font}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="1"
                  variant="ghost"
                  className="w-14 justify-between"
                >
                  {format.fontSize ?? 10}
                  <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {[8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 36].map((size) => (
                  <DropdownMenuItem
                    key={size}
                    onClick={() => formatSelectedCells({ fontSize: size })}
                  >
                    {size}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </Flex>

          <Flex gap="1">
            <SimpleTooltip content="Bold (Ctrl+B)">
              <IconButton
                size="1"
                variant={format.bold ? "solid" : "ghost"}
                onClick={() => formatSelectedCells({ bold: !format.bold })}
              >
                <FontBoldIcon />
              </IconButton>
            </SimpleTooltip>
            <SimpleTooltip content="Italic (Ctrl+I)">
              <IconButton
                size="1"
                variant={format.italic ? "solid" : "ghost"}
                onClick={() => formatSelectedCells({ italic: !format.italic })}
              >
                <FontItalicIcon />
              </IconButton>
            </SimpleTooltip>
            <SimpleTooltip content="Underline (Ctrl+U)">
              <IconButton
                size="1"
                variant={format.underline ? "solid" : "ghost"}
                onClick={() =>
                  formatSelectedCells({ underline: !format.underline })
                }
              >
                <UnderlineIcon />
              </IconButton>
            </SimpleTooltip>
            <SimpleTooltip content="Strikethrough">
              <IconButton
                size="1"
                variant={format.strikethrough ? "solid" : "ghost"}
                onClick={() =>
                  formatSelectedCells({ strikethrough: !format.strikethrough })
                }
              >
                <StrikethroughIcon />
              </IconButton>
            </SimpleTooltip>
          </Flex>
          <Text size="1" className="text-gray-500 text-center mt-1">
            Font
          </Text>
        </Flex>

        {/* Alignment group */}
        <Flex direction="column" className="border-r border-gray-200 pr-4">
          <Flex gap="1" className="mb-1">
            <SimpleTooltip content="Align left">
              <IconButton
                size="1"
                variant={format.textAlign === "left" ? "solid" : "ghost"}
                onClick={() => formatSelectedCells({ textAlign: "left" })}
              >
                <TextAlignLeftIcon />
              </IconButton>
            </SimpleTooltip>
            <SimpleTooltip content="Center">
              <IconButton
                size="1"
                variant={format.textAlign === "center" ? "solid" : "ghost"}
                onClick={() => formatSelectedCells({ textAlign: "center" })}
              >
                <TextAlignCenterIcon />
              </IconButton>
            </SimpleTooltip>
            <SimpleTooltip content="Align right">
              <IconButton
                size="1"
                variant={format.textAlign === "right" ? "solid" : "ghost"}
                onClick={() => formatSelectedCells({ textAlign: "right" })}
              >
                <TextAlignRightIcon />
              </IconButton>
            </SimpleTooltip>
          </Flex>
          <Text size="1" className="text-gray-500 text-center mt-1">
            Alignment
          </Text>
        </Flex>

        {/* Number format group */}
        <Flex direction="column" className="border-r border-gray-200 pr-4">
          <Flex gap="1" className="mb-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="1" variant="ghost">
                  General
                  <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>General</DropdownMenuItem>
                <DropdownMenuItem>Number</DropdownMenuItem>
                <DropdownMenuItem>Currency</DropdownMenuItem>
                <DropdownMenuItem>Percent</DropdownMenuItem>
                <DropdownMenuItem>Date</DropdownMenuItem>
                <DropdownMenuItem>Time</DropdownMenuItem>
                <DropdownMenuItem>Text</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Flex>
          <Text size="1" className="text-gray-500 text-center mt-1">
            Number
          </Text>
        </Flex>

        {/* Cell colors group */}
        <Flex direction="column">
          <Flex gap="1" className="mb-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IconButton size="1" variant="ghost">
                  <Box
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{
                      backgroundColor: format.backgroundColor ?? "white",
                    }}
                  />
                </IconButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <Box className="p-2 grid grid-cols-5 gap-1">
                  {[
                    "#ffffff",
                    "#f3f4f6",
                    "#fef3c7",
                    "#d1fae5",
                    "#dbeafe",
                    "#fce7f3",
                    "#fee2e2",
                    "#e0e7ff",
                    "#fef9c3",
                    "#ccfbf1",
                  ].map((color) => (
                    <button
                      key={color}
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: color }}
                      onClick={() =>
                        formatSelectedCells({ backgroundColor: color })
                      }
                    />
                  ))}
                </Box>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IconButton size="1" variant="ghost">
                  <Text
                    style={{
                      color: format.textColor ?? "#000",
                      fontWeight: "bold",
                    }}
                  >
                    A
                  </Text>
                </IconButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <Box className="p-2 grid grid-cols-5 gap-1">
                  {[
                    "#000000",
                    "#ef4444",
                    "#22c55e",
                    "#3b82f6",
                    "#a855f7",
                    "#f97316",
                    "#06b6d4",
                    "#ec4899",
                    "#6b7280",
                    "#84cc16",
                  ].map((color) => (
                    <button
                      key={color}
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: color }}
                      onClick={() => formatSelectedCells({ textColor: color })}
                    />
                  ))}
                </Box>
              </DropdownMenuContent>
            </DropdownMenu>
          </Flex>
          <Text size="1" className="text-gray-500 text-center mt-1">
            Colors
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
}

// Sheet tabs component
function SheetTabs() {
  const {
    sheets,
    activeSheetId,
    setActiveSheet,
    addSheet,
    removeSheet,
    renameSheet,
  } = useSheetStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleStartRename = (id: string, name: string) => {
    setEditingId(id);
    setEditName(name);
  };

  const handleFinishRename = () => {
    if (editingId && editName.trim()) {
      renameSheet(editingId, editName.trim());
    }
    setEditingId(null);
  };

  return (
    <Flex
      align="center"
      className="h-8 border-t border-gray-200 bg-gray-50 px-2 gap-1"
    >
      <SimpleTooltip content="Add sheet">
        <IconButton size="1" variant="ghost" onClick={() => addSheet()}>
          <PlusIcon />
        </IconButton>
      </SimpleTooltip>

      <Flex className="flex-1 overflow-x-auto gap-1">
        {sheets.map((sheet) => (
          <ContextMenu key={sheet.id}>
            <ContextMenuTrigger>
              <button
                className={`px-4 py-1 text-sm rounded-t border-t border-l border-r whitespace-nowrap ${
                  sheet.id === activeSheetId
                    ? "bg-white border-gray-200 font-medium"
                    : "bg-gray-100 border-transparent hover:bg-gray-200"
                }`}
                onClick={() => setActiveSheet(sheet.id)}
                onDoubleClick={() => handleStartRename(sheet.id, sheet.name)}
              >
                {editingId === sheet.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={handleFinishRename}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleFinishRename();
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    className="w-20 px-1 text-sm border border-blue-500 rounded focus:outline-none"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  sheet.name
                )}
              </button>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem
                onClick={() => handleStartRename(sheet.id, sheet.name)}
              >
                Rename
              </ContextMenuItem>
              <ContextMenuItem onClick={() => addSheet()}>
                Insert
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem
                destructive
                onClick={() => removeSheet(sheet.id)}
              >
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </Flex>
    </Flex>
  );
}

// Header component
function SheetHeader() {
  const { sheets, activeSheetId } = useSheetStore();
  const activeSheet = sheets.find((s) => s.id === activeSheetId);

  return (
    <Flex align="center" className="h-12 px-4 bg-green-600 text-white">
      {/* Logo */}
      <Flex align="center" gap="2" className="mr-6">
        <TableIcon className="w-6 h-6" />
        <Text weight="bold" size="3">
          Sheet
        </Text>
      </Flex>

      {/* File menu */}
      <Flex gap="2" className="flex-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="1"
              variant="ghost"
              className="text-white hover:bg-green-700"
            >
              File
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>New</DropdownMenuItem>
            <DropdownMenuItem>Open</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Save</DropdownMenuItem>
            <DropdownMenuItem>Save As</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Export</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="1"
              variant="ghost"
              className="text-white hover:bg-green-700"
            >
              Edit
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem shortcut="Ctrl+Z">Undo</DropdownMenuItem>
            <DropdownMenuItem shortcut="Ctrl+Y">Redo</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem shortcut="Ctrl+X">Cut</DropdownMenuItem>
            <DropdownMenuItem shortcut="Ctrl+C">Copy</DropdownMenuItem>
            <DropdownMenuItem shortcut="Ctrl+V">Paste</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="1"
              variant="ghost"
              className="text-white hover:bg-green-700"
            >
              Insert
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Row above</DropdownMenuItem>
            <DropdownMenuItem>Row below</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Column left</DropdownMenuItem>
            <DropdownMenuItem>Column right</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Chart</DropdownMenuItem>
            <DropdownMenuItem>Image</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="1"
              variant="ghost"
              className="text-white hover:bg-green-700"
            >
              Format
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Number format</DropdownMenuItem>
            <DropdownMenuItem>Text formatting</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Column width</DropdownMenuItem>
            <DropdownMenuItem>Row height</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Flex>

      {/* Document title */}
      <Flex align="center" gap="2" className="mx-4">
        <input
          type="text"
          value={activeSheet?.name ?? "Untitled Spreadsheet"}
          className="bg-transparent border-none text-white text-sm font-medium focus:outline-none focus:ring-1 focus:ring-white/50 rounded px-2 py-1"
          readOnly
        />
      </Flex>

      {/* Right side */}
      <Flex align="center" gap="3">
        <Button size="1" className="bg-white text-green-600 hover:bg-green-50">
          <Share1Icon />
          Share
        </Button>
        <Avatar
          size="2"
          src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=64&h=64&fit=crop"
          fallback="U"
          radius="full"
        />
      </Flex>
    </Flex>
  );
}

// Main spreadsheet grid
function SpreadsheetGrid() {
  const {
    sheets,
    activeSheetId,
    selectedCell,
    selectedRange,
    getCell,
    selectCell,
    showGridlines,
    showFormulas,
    showHeaders,
    isEditing,
    startEditing,
    commitEdit,
    cancelEdit,
  } = useSheetStore();

  const activeSheet = sheets.find((s) => s.id === activeSheetId);
  const gridRef = useRef<HTMLDivElement>(null);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell) return;

      const { row, col } = selectedCell;

      if (isEditing) {
        if (e.key === "Enter") {
          commitEdit();
          selectCell(row + 1, col);
        } else if (e.key === "Tab") {
          e.preventDefault();
          commitEdit();
          selectCell(row, col + 1);
        } else if (e.key === "Escape") {
          cancelEdit();
        }
        return;
      }

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          if (row > 0) selectCell(row - 1, col, e.shiftKey);
          break;
        case "ArrowDown":
          e.preventDefault();
          selectCell(row + 1, col, e.shiftKey);
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (col > 0) selectCell(row, col - 1, e.shiftKey);
          break;
        case "ArrowRight":
          e.preventDefault();
          selectCell(row, col + 1, e.shiftKey);
          break;
        case "Enter":
          startEditing();
          break;
        case "Delete":
        case "Backspace":
          // Clear cell - would need to implement
          break;
        default:
          // Start editing with the pressed key
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            startEditing(e.key);
          }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCell, isEditing]);

  if (!activeSheet) return null;

  const getColumnWidth = (col: number) =>
    activeSheet.columnWidths.get(col) ?? DEFAULT_COL_WIDTH;
  const getRowHeight = (row: number) =>
    activeSheet.rowHeights.get(row) ?? DEFAULT_ROW_HEIGHT;

  const isInRange = (row: number, col: number) => {
    if (!selectedRange) return false;
    return (
      row >= selectedRange.startRow &&
      row <= selectedRange.endRow &&
      col >= selectedRange.startCol &&
      col <= selectedRange.endCol
    );
  };

  return (
    <Box className="flex-1 overflow-auto relative" ref={gridRef}>
      <div className="spreadsheet-grid">
        {/* Corner cell */}
        {showHeaders && (
          <div
            className="corner-cell"
            style={{ width: HEADER_WIDTH, height: HEADER_HEIGHT }}
          />
        )}

        {/* Column headers */}
        {showHeaders && (
          <div className="column-headers" style={{ marginLeft: HEADER_WIDTH }}>
            {Array.from({ length: VISIBLE_COLS }, (_, col) => (
              <ColumnHeader key={col} col={col} width={getColumnWidth(col)} />
            ))}
          </div>
        )}

        {/* Main grid area */}
        <div className="grid-body">
          {/* Row headers */}
          {showHeaders && (
            <div className="row-headers">
              {Array.from({ length: VISIBLE_ROWS }, (_, row) => (
                <RowHeader key={row} row={row} height={getRowHeight(row)} />
              ))}
            </div>
          )}

          {/* Cells */}
          <div
            className="cells-container"
            style={{ marginLeft: showHeaders ? HEADER_WIDTH : 0 }}
          >
            {Array.from({ length: VISIBLE_ROWS }, (_, row) => (
              <div
                key={row}
                className="cell-row"
                style={{ height: getRowHeight(row) }}
              >
                {Array.from({ length: VISIBLE_COLS }, (_, col) => {
                  const cell = getCell(row, col);
                  const isSelected =
                    selectedCell?.row === row && selectedCell?.col === col;

                  return (
                    <Cell
                      key={`${row}-${col}`}
                      row={row}
                      col={col}
                      cell={cell}
                      isSelected={isSelected}
                      isInRange={isInRange(row, col)}
                      width={getColumnWidth(col)}
                      height={getRowHeight(row)}
                      showFormulas={showFormulas}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Box>
  );
}

// Status bar
function StatusBar() {
  const { selectedCell, selectedRange, zoom, setZoom } = useSheetStore();

  let selectionText = "";
  if (selectedRange) {
    const rowCount = selectedRange.endRow - selectedRange.startRow + 1;
    const colCount = selectedRange.endCol - selectedRange.startCol + 1;
    selectionText = `${rowCount}R × ${colCount}C`;
  }

  return (
    <Flex
      align="center"
      justify="between"
      className="h-6 px-4 bg-gray-100 border-t border-gray-200 text-xs text-gray-600"
    >
      <Flex gap="4">
        {selectionText && <Text size="1">{selectionText}</Text>}
        <Text size="1">Ready</Text>
      </Flex>
      <Flex align="center" gap="2">
        <SimpleTooltip content="Zoom out">
          <IconButton
            size="1"
            variant="ghost"
            onClick={() => setZoom(zoom - 10)}
          >
            <MinusIcon />
          </IconButton>
        </SimpleTooltip>
        <Text className="w-12 text-center">{zoom}%</Text>
        <SimpleTooltip content="Zoom in">
          <IconButton
            size="1"
            variant="ghost"
            onClick={() => setZoom(zoom + 10)}
          >
            <PlusIcon />
          </IconButton>
        </SimpleTooltip>
      </Flex>
    </Flex>
  );
}

// Main Sheet App component
export function SheetApp() {
  return (
    <Flex direction="column" className="h-screen w-screen">
      <SheetHeader />
      <SheetToolbar />
      <FormulaBar />
      <SpreadsheetGrid />
      <SheetTabs />
      <StatusBar />
    </Flex>
  );
}
