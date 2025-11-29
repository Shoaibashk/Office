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
    <div className="min-h-screen flex flex-col bg-base-200">
      {/* Header */}
      <header className="navbar bg-gradient-to-r from-primary to-primary/90 text-primary-content shadow-lg">
        <div className="flex-1 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
              <span className="text-xl">📝</span>
            </div>
            <span className="text-xl font-semibold tracking-tight">Word</span>
          </div>
          <input
            type="text"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            className="input input-sm bg-white/10 border-white/20 text-primary-content placeholder:text-white/60 focus:bg-white/20 focus:border-white/40 w-64 font-medium"
            placeholder="Document title"
          />
        </div>
        <div className="flex-none gap-2">
          <button className="btn btn-sm btn-ghost text-primary-content hover:bg-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="bg-base-100 px-4 py-2 flex flex-wrap gap-1 items-center border-b border-base-300 shadow-sm">
        <div className="join">
          <button className="btn btn-sm btn-ghost join-item" onClick={() => execCommand('undo')} title="Undo">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a4 4 0 014 4v2M3 10l4 4m-4-4l4-4" />
            </svg>
          </button>
          <button className="btn btn-sm btn-ghost join-item" onClick={() => execCommand('redo')} title="Redo">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a4 4 0 00-4 4v2m14-6l-4 4m4-4l-4-4" />
            </svg>
          </button>
        </div>
        
        <div className="divider divider-horizontal mx-1 h-6"></div>
        
        <select 
          className="select select-sm select-bordered font-medium"
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
          className="select select-sm select-bordered w-20"
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
        
        <div className="divider divider-horizontal mx-1 h-6"></div>
        
        <div className="join">
          <button 
            className={`btn btn-sm join-item ${activeFormats.has('bold') ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => execCommand('bold')} 
            title="Bold (Ctrl+B)"
          >
            <strong className="text-base">B</strong>
          </button>
          <button 
            className={`btn btn-sm join-item ${activeFormats.has('italic') ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => execCommand('italic')} 
            title="Italic (Ctrl+I)"
          >
            <em className="text-base">I</em>
          </button>
          <button 
            className={`btn btn-sm join-item ${activeFormats.has('underline') ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => execCommand('underline')} 
            title="Underline (Ctrl+U)"
          >
            <u className="text-base">U</u>
          </button>
          <button 
            className={`btn btn-sm join-item ${activeFormats.has('strikeThrough') ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => execCommand('strikeThrough')} 
            title="Strikethrough"
          >
            <s className="text-base">S</s>
          </button>
        </div>
        
        <div className="divider divider-horizontal mx-1 h-6"></div>
        
        <div className="join">
          <button 
            className={`btn btn-sm join-item ${activeFormats.has('justifyLeft') ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => execCommand('justifyLeft')} 
            title="Align Left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h14" />
            </svg>
          </button>
          <button 
            className={`btn btn-sm join-item ${activeFormats.has('justifyCenter') ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => execCommand('justifyCenter')} 
            title="Align Center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M5 18h14" />
            </svg>
          </button>
          <button 
            className={`btn btn-sm join-item ${activeFormats.has('justifyRight') ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => execCommand('justifyRight')} 
            title="Align Right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M6 18h14" />
            </svg>
          </button>
          <button 
            className={`btn btn-sm join-item ${activeFormats.has('justifyFull') ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => execCommand('justifyFull')} 
            title="Justify"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        <div className="divider divider-horizontal mx-1 h-6"></div>
        
        <div className="join">
          <button className="btn btn-sm btn-ghost join-item" onClick={() => execCommand('insertUnorderedList')} title="Bullet List">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h.01M8 6h12M4 12h.01M8 12h12M4 18h.01M8 18h12" />
            </svg>
          </button>
          <button className="btn btn-sm btn-ghost join-item" onClick={() => execCommand('insertOrderedList')} title="Numbered List">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 6h13M7 12h13M7 18h13M3 6h.01M3 12h.01M3 18h.01" />
            </svg>
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 p-8 flex justify-center overflow-auto">
        <div
          ref={editorRef}
          className="document-editor"
          contentEditable
          onKeyUp={updateActiveFormats}
          onMouseUp={updateActiveFormats}
          suppressContentEditableWarning
        >
          <h1 style={{ fontSize: '28px', marginBottom: '20px', fontWeight: 600, color: '#1f2937' }}>Welcome to Word</h1>
          <p style={{ marginBottom: '16px', lineHeight: 1.7, color: '#374151' }}>
            This is a modern rich text editor with a clean, enterprise-level interface. You can format text using the toolbar above.
          </p>
          <p style={{ marginBottom: '16px', lineHeight: 1.7, color: '#374151' }}>
            Try selecting some text and making it <strong>bold</strong>, <em>italic</em>, or <u>underlined</u>.
          </p>
          <p style={{ lineHeight: 1.7, color: '#374151' }}>
            You can also change the font, size, and alignment of your text. The interface is designed to be intuitive and professional.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
