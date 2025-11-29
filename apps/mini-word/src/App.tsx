import { useState, useRef, useCallback } from 'react';
import { Layout, Toolbar, ToolbarButton, ToolbarDivider } from '@office/ui';

type FormatCommand = 'bold' | 'italic' | 'underline' | 'strikeThrough' | 
  'justifyLeft' | 'justifyCenter' | 'justifyRight' | 'justifyFull' |
  'insertUnorderedList' | 'insertOrderedList' | 'undo' | 'redo';

function App() {
  const [documentTitle, setDocumentTitle] = useState('Untitled Document');
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = useCallback((command: FormatCommand, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateActiveFormats();
  }, []);

  const updateActiveFormats = useCallback(() => {
    const formats = new Set<string>();
    if (document.queryCommandState('bold')) formats.add('bold');
    if (document.queryCommandState('italic')) formats.add('italic');
    if (document.queryCommandState('underline')) formats.add('underline');
    if (document.queryCommandState('strikeThrough')) formats.add('strikeThrough');
    if (document.queryCommandState('justifyLeft')) formats.add('justifyLeft');
    if (document.queryCommandState('justifyCenter')) formats.add('justifyCenter');
    if (document.queryCommandState('justifyRight')) formats.add('justifyRight');
    if (document.queryCommandState('justifyFull')) formats.add('justifyFull');
    setActiveFormats(formats);
  }, []);

  const handleFontSize = (size: string) => {
    document.execCommand('fontSize', false, size);
    editorRef.current?.focus();
  };

  const handleFontFamily = (font: string) => {
    document.execCommand('fontName', false, font);
    editorRef.current?.focus();
  };

  const header = (
    <div className="flex flex-col">
      <div className="flex items-center gap-4 px-4 py-2 bg-blue-600">
        <span className="text-xl font-bold text-white">📝 Mini Word</span>
        <input
          type="text"
          value={documentTitle}
          onChange={(e) => setDocumentTitle(e.target.value)}
          className="bg-blue-500 text-white px-2 py-1 rounded border-none outline-none placeholder-blue-200"
          placeholder="Document title"
        />
      </div>
      <Toolbar>
        <ToolbarButton onClick={() => execCommand('undo')} tooltip="Undo">
          ↩️
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('redo')} tooltip="Redo">
          ↪️
        </ToolbarButton>
        <ToolbarDivider />
        <select 
          className="px-2 py-1 border rounded text-sm"
          onChange={(e) => handleFontFamily(e.target.value)}
          defaultValue="Arial"
        >
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
          <option value="Verdana">Verdana</option>
        </select>
        <select 
          className="px-2 py-1 border rounded text-sm"
          onChange={(e) => handleFontSize(e.target.value)}
          defaultValue="3"
        >
          <option value="1">8</option>
          <option value="2">10</option>
          <option value="3">12</option>
          <option value="4">14</option>
          <option value="5">18</option>
          <option value="6">24</option>
          <option value="7">36</option>
        </select>
        <ToolbarDivider />
        <ToolbarButton 
          onClick={() => execCommand('bold')} 
          active={activeFormats.has('bold')}
          tooltip="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => execCommand('italic')} 
          active={activeFormats.has('italic')}
          tooltip="Italic (Ctrl+I)"
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => execCommand('underline')} 
          active={activeFormats.has('underline')}
          tooltip="Underline (Ctrl+U)"
        >
          <u>U</u>
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => execCommand('strikeThrough')} 
          active={activeFormats.has('strikeThrough')}
          tooltip="Strikethrough"
        >
          <s>S</s>
        </ToolbarButton>
        <ToolbarDivider />
        <ToolbarButton 
          onClick={() => execCommand('justifyLeft')} 
          active={activeFormats.has('justifyLeft')}
          tooltip="Align Left"
        >
          ⬅️
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => execCommand('justifyCenter')} 
          active={activeFormats.has('justifyCenter')}
          tooltip="Align Center"
        >
          ↔️
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => execCommand('justifyRight')} 
          active={activeFormats.has('justifyRight')}
          tooltip="Align Right"
        >
          ➡️
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => execCommand('justifyFull')} 
          active={activeFormats.has('justifyFull')}
          tooltip="Justify"
        >
          ☰
        </ToolbarButton>
        <ToolbarDivider />
        <ToolbarButton 
          onClick={() => execCommand('insertUnorderedList')} 
          tooltip="Bullet List"
        >
          • List
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => execCommand('insertOrderedList')} 
          tooltip="Numbered List"
        >
          1. List
        </ToolbarButton>
      </Toolbar>
    </div>
  );

  return (
    <Layout header={header}>
      <div className="p-4 flex justify-center overflow-auto min-h-full bg-gray-200">
        <div
          ref={editorRef}
          className="document-editor"
          contentEditable
          onKeyUp={updateActiveFormats}
          onMouseUp={updateActiveFormats}
          suppressContentEditableWarning
        >
          <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Welcome to Mini Word</h1>
          <p style={{ marginBottom: '12px' }}>
            This is a simple rich text editor. You can format text using the toolbar above.
          </p>
          <p style={{ marginBottom: '12px' }}>
            Try selecting some text and making it <strong>bold</strong>, <em>italic</em>, or <u>underlined</u>.
          </p>
          <p>
            You can also change the font, size, and alignment of your text.
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default App;
