import { useState, useRef, useCallback } from 'react';

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

  return (
    <div className="min-h-screen flex flex-col" data-theme="corporate">
      {/* Header */}
      <div className="navbar bg-primary text-primary-content">
        <div className="flex-1 gap-2">
          <span className="text-xl font-bold">📝 Word</span>
          <input
            type="text"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            className="input input-sm input-bordered bg-primary/80 text-primary-content border-primary"
            placeholder="Document title"
          />
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-base-200 p-2 flex flex-wrap gap-1 items-center border-b">
        <button className="btn btn-sm btn-ghost" onClick={() => execCommand('undo')} title="Undo">↩️</button>
        <button className="btn btn-sm btn-ghost" onClick={() => execCommand('redo')} title="Redo">↪️</button>
        
        <div className="divider divider-horizontal mx-1"></div>
        
        <select 
          className="select select-sm select-bordered"
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
          className="select select-sm select-bordered"
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
        
        <div className="divider divider-horizontal mx-1"></div>
        
        <button 
          className={`btn btn-sm ${activeFormats.has('bold') ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => execCommand('bold')} 
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button 
          className={`btn btn-sm ${activeFormats.has('italic') ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => execCommand('italic')} 
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <button 
          className={`btn btn-sm ${activeFormats.has('underline') ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => execCommand('underline')} 
          title="Underline (Ctrl+U)"
        >
          <u>U</u>
        </button>
        <button 
          className={`btn btn-sm ${activeFormats.has('strikeThrough') ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => execCommand('strikeThrough')} 
          title="Strikethrough"
        >
          <s>S</s>
        </button>
        
        <div className="divider divider-horizontal mx-1"></div>
        
        <button 
          className={`btn btn-sm ${activeFormats.has('justifyLeft') ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => execCommand('justifyLeft')} 
          title="Align Left"
        >
          ⬅️
        </button>
        <button 
          className={`btn btn-sm ${activeFormats.has('justifyCenter') ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => execCommand('justifyCenter')} 
          title="Align Center"
        >
          ↔️
        </button>
        <button 
          className={`btn btn-sm ${activeFormats.has('justifyRight') ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => execCommand('justifyRight')} 
          title="Align Right"
        >
          ➡️
        </button>
        <button 
          className={`btn btn-sm ${activeFormats.has('justifyFull') ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => execCommand('justifyFull')} 
          title="Justify"
        >
          ☰
        </button>
        
        <div className="divider divider-horizontal mx-1"></div>
        
        <button className="btn btn-sm btn-ghost" onClick={() => execCommand('insertUnorderedList')} title="Bullet List">
          • List
        </button>
        <button className="btn btn-sm btn-ghost" onClick={() => execCommand('insertOrderedList')} title="Numbered List">
          1. List
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1 bg-base-300 p-4 flex justify-center overflow-auto">
        <div
          ref={editorRef}
          className="document-editor bg-base-100 shadow-xl"
          contentEditable
          onKeyUp={updateActiveFormats}
          onMouseUp={updateActiveFormats}
          suppressContentEditableWarning
        >
          <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Welcome to Word</h1>
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
    </div>
  );
}

export default App;
