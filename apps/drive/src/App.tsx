import { useState, useCallback, useRef } from 'react';

type FileType = 'folder' | 'document' | 'spreadsheet' | 'presentation' | 'image' | 'other';

type FileItem = {
  id: string;
  name: string;
  type: FileType;
  size?: number;
  modifiedAt: Date;
  parentId: string | null;
};

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getFileIcon(type: FileType): JSX.Element {
  const iconClass = "w-8 h-8";
  switch (type) {
    case 'folder':
      return <svg className={iconClass} fill="#fbbf24" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>;
    case 'document':
      return <svg className={iconClass} fill="#3b82f6" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z"/></svg>;
    case 'spreadsheet':
      return <svg className={iconClass} fill="#22c55e" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-2-2H7v-2h10v2zm0-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>;
    case 'presentation':
      return <svg className={iconClass} fill="#f97316" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM9 8h6v2H9V8zm0 4h6v2H9v-2z"/></svg>;
    case 'image':
      return <svg className={iconClass} fill="#8b5cf6" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>;
    default:
      return <svg className={iconClass} fill="#6b7280" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z"/></svg>;
  }
}

function App() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: 'root', name: 'My Files', type: 'folder', modifiedAt: new Date(), parentId: null },
    { id: generateId(), name: 'Documents', type: 'folder', modifiedAt: new Date(), parentId: 'root' },
    { id: generateId(), name: 'Photos', type: 'folder', modifiedAt: new Date(), parentId: 'root' },
    { id: generateId(), name: 'Presentations', type: 'folder', modifiedAt: new Date(), parentId: 'root' },
    { id: generateId(), name: 'Report 2024.docx', type: 'document', size: 25600, modifiedAt: new Date(), parentId: 'root' },
    { id: generateId(), name: 'Budget.xlsx', type: 'spreadsheet', size: 15200, modifiedAt: new Date(), parentId: 'root' },
    { id: generateId(), name: 'Quarterly Review.pptx', type: 'presentation', size: 2048000, modifiedAt: new Date(), parentId: 'root' },
  ]);

  const [currentFolderId, setCurrentFolderId] = useState<string>('root');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isDragging, setIsDragging] = useState(false);
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentFiles = files.filter(f => f.parentId === currentFolderId);
  const currentFolder = files.find(f => f.id === currentFolderId);

  const getBreadcrumb = useCallback((): FileItem[] => {
    const path: FileItem[] = [];
    let current = currentFolder;
    while (current) {
      path.unshift(current);
      current = files.find(f => f.id === current?.parentId);
    }
    return path;
  }, [currentFolder, files]);

  const navigateToFolder = useCallback((folderId: string) => {
    setCurrentFolderId(folderId);
    setSelectedFiles(new Set());
  }, []);

  const handleFileClick = useCallback((file: FileItem, e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      setSelectedFiles(prev => {
        const next = new Set(prev);
        if (next.has(file.id)) next.delete(file.id);
        else next.add(file.id);
        return next;
      });
    } else {
      setSelectedFiles(new Set([file.id]));
    }
  }, []);

  const handleFileDoubleClick = useCallback((file: FileItem) => {
    if (file.type === 'folder') navigateToFolder(file.id);
  }, [navigateToFolder]);

  const createFolder = useCallback(() => {
    if (!newFolderName.trim()) return;
    const newFolder: FileItem = {
      id: generateId(),
      name: newFolderName.trim(),
      type: 'folder',
      modifiedAt: new Date(),
      parentId: currentFolderId,
    };
    setFiles([...files, newFolder]);
    setNewFolderName('');
    setShowNewFolderDialog(false);
  }, [newFolderName, currentFolderId, files]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;

    const newFiles: FileItem[] = Array.from(uploadedFiles).map(file => {
      let type: FileType = 'other';
      if (file.type.startsWith('image/')) type = 'image';
      else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) type = 'document';
      else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) type = 'spreadsheet';
      else if (file.name.endsWith('.pptx') || file.name.endsWith('.ppt')) type = 'presentation';

      return {
        id: generateId(),
        name: file.name,
        type,
        size: file.size,
        modifiedAt: new Date(),
        parentId: currentFolderId,
      };
    });

    setFiles([...files, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [currentFolderId, files]);

  const deleteSelectedFiles = useCallback(() => {
    setFiles(files.filter(f => !selectedFiles.has(f.id)));
    setSelectedFiles(new Set());
  }, [files, selectedFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (!droppedFiles.length) return;

    const newFiles: FileItem[] = Array.from(droppedFiles).map(file => {
      let type: FileType = 'other';
      if (file.type.startsWith('image/')) type = 'image';
      else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) type = 'document';
      else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) type = 'spreadsheet';
      else if (file.name.endsWith('.pptx') || file.name.endsWith('.ppt')) type = 'presentation';

      return {
        id: generateId(),
        name: file.name,
        type,
        size: file.size,
        modifiedAt: new Date(),
        parentId: currentFolderId,
      };
    });

    setFiles([...files, ...newFiles]);
  }, [currentFolderId, files]);

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Header */}
      <header className="navbar bg-gradient-to-r from-info to-info/90 text-info-content shadow-lg">
        <div className="flex-1 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
              <span className="text-xl">☁️</span>
            </div>
            <span className="text-xl font-semibold tracking-tight">Drive</span>
          </div>
        </div>
        <div className="flex-none">
          <div className="form-control">
            <div className="input-group">
              <input
                type="text"
                placeholder="Search files..."
                className="input input-sm bg-white/10 border-white/20 text-info-content placeholder:text-white/60 focus:bg-white/20 w-64"
              />
              <button className="btn btn-sm bg-white/10 border-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="bg-base-100 px-4 py-2 flex items-center gap-1 border-b border-base-300 shadow-sm">
        <button className="btn btn-sm btn-primary gap-1" onClick={() => fileInputRef.current?.click()}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Upload
        </button>
        <button className="btn btn-sm btn-ghost gap-1" onClick={() => setShowNewFolderDialog(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          New Folder
        </button>
        
        {selectedFiles.size > 0 && (
          <>
            <div className="divider divider-horizontal mx-2 h-6"></div>
            <button className="btn btn-sm btn-error gap-1" onClick={deleteSelectedFiles}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete ({selectedFiles.size})
            </button>
          </>
        )}
        
        <div className="flex-1"></div>
        
        <div className="join">
          <button 
            className={`btn btn-sm join-item ${viewMode === 'grid' ? 'btn-active' : 'btn-ghost'}`}
            onClick={() => setViewMode('grid')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button 
            className={`btn btn-sm join-item ${viewMode === 'list' ? 'btn-active' : 'btn-ghost'}`}
            onClick={() => setViewMode('list')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 bg-base-100 border-r border-base-300 p-3">
          <nav className="space-y-1">
            <button
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                currentFolderId === 'root' ? 'bg-info/10 text-info' : 'hover:bg-base-200'
              }`}
              onClick={() => navigateToFolder('root')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <span className="font-medium">My Files</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-base-content/70 hover:bg-base-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span className="font-medium">Starred</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-base-content/70 hover:bg-base-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="font-medium">Trash</span>
            </button>
          </nav>
          
          <div className="mt-6 p-3 bg-base-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Storage</span>
              <span className="text-xs text-base-content/60">2.4 GB of 15 GB</span>
            </div>
            <div className="w-full bg-base-300 rounded-full h-2">
              <div className="bg-info h-2 rounded-full" style={{ width: '16%' }}></div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* New Folder Dialog */}
          {showNewFolderDialog && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-base-100 rounded-xl p-6 w-96 shadow-2xl">
                <h3 className="font-semibold text-lg mb-4">New Folder</h3>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Folder name"
                  className="input input-bordered w-full mb-4"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && createFolder()}
                />
                <div className="flex justify-end gap-2">
                  <button className="btn btn-ghost" onClick={() => setShowNewFolderDialog(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={createFolder}>Create</button>
                </div>
              </div>
            </div>
          )}

          {/* Breadcrumb */}
          <div className="flex items-center gap-1 mb-4 text-sm">
            {getBreadcrumb().map((folder, index, arr) => (
              <span key={folder.id} className="flex items-center gap-1">
                <button
                  onClick={() => navigateToFolder(folder.id)}
                  className={`hover:text-info transition-colors ${
                    index === arr.length - 1 ? 'font-semibold text-base-content' : 'text-base-content/60'
                  }`}
                >
                  {folder.name}
                </button>
                {index < arr.length - 1 && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </span>
            ))}
          </div>

          {/* Drop Zone */}
          <div
            className={`drop-zone p-6 mb-6 ${isDragging ? 'dragover' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center text-base-content/50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p>Drag and drop files here or click <button onClick={() => fileInputRef.current?.click()} className="text-info hover:underline">Upload</button></p>
            </div>
          </div>

          {/* Files */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {currentFiles.map(file => (
                <div
                  key={file.id}
                  className={`file-item p-4 bg-base-100 rounded-xl text-center group ${
                    selectedFiles.has(file.id) ? 'selected' : ''
                  }`}
                  onClick={(e) => handleFileClick(file, e)}
                  onDoubleClick={() => handleFileDoubleClick(file)}
                >
                  <div className="mb-3 flex justify-center">{getFileIcon(file.type)}</div>
                  <div className="text-sm font-medium truncate mb-1">{file.name}</div>
                  {file.size && (
                    <div className="text-xs text-base-content/50">{formatFileSize(file.size)}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-base-100 rounded-xl overflow-hidden shadow-sm">
              <table className="table">
                <thead>
                  <tr className="bg-base-200">
                    <th>Name</th>
                    <th>Modified</th>
                    <th>Size</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {currentFiles.map(file => (
                    <tr
                      key={file.id}
                      className={`cursor-pointer hover:bg-base-200 transition-colors ${
                        selectedFiles.has(file.id) ? 'bg-info/10' : ''
                      }`}
                      onClick={(e) => handleFileClick(file, e)}
                      onDoubleClick={() => handleFileDoubleClick(file)}
                    >
                      <td className="flex items-center gap-3">
                        {getFileIcon(file.type)}
                        <span className="font-medium">{file.name}</span>
                      </td>
                      <td className="text-base-content/60">{formatDate(file.modifiedAt)}</td>
                      <td className="text-base-content/60">{file.size ? formatFileSize(file.size) : '—'}</td>
                      <td className="text-base-content/60 capitalize">{file.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {currentFiles.length === 0 && (
            <div className="text-center py-16 text-base-content/50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg font-medium">This folder is empty</p>
              <p className="text-sm mt-1">Upload files or create a new folder to get started</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
