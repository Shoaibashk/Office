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

function getFileIcon(type: FileType): string {
  switch (type) {
    case 'folder': return '📁';
    case 'document': return '📝';
    case 'spreadsheet': return '📊';
    case 'presentation': return '📽️';
    case 'image': return '🖼️';
    default: return '📄';
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
        if (next.has(file.id)) {
          next.delete(file.id);
        } else {
          next.add(file.id);
        }
        return next;
      });
    } else {
      setSelectedFiles(new Set([file.id]));
    }
  }, []);

  const handleFileDoubleClick = useCallback((file: FileItem) => {
    if (file.type === 'folder') {
      navigateToFolder(file.id);
    }
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
    <div className="min-h-screen flex flex-col" data-theme="corporate">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Header */}
      <div className="navbar bg-info text-info-content">
        <div className="flex-1">
          <span className="text-xl font-bold">☁️ Drive</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-base-200 p-2 flex flex-wrap gap-1 items-center border-b">
        <button className="btn btn-sm btn-ghost" onClick={() => fileInputRef.current?.click()} title="Upload Files">
          ⬆️ Upload
        </button>
        <button className="btn btn-sm btn-ghost" onClick={() => setShowNewFolderDialog(true)} title="New Folder">
          📁 New Folder
        </button>
        
        {selectedFiles.size > 0 && (
          <>
            <div className="divider divider-horizontal mx-1"></div>
            <button className="btn btn-sm btn-error" onClick={deleteSelectedFiles} title="Delete">
              🗑️ Delete
            </button>
          </>
        )}
        
        <div className="flex-1"></div>
        
        <div className="btn-group">
          <button 
            className={`btn btn-sm ${viewMode === 'grid' ? 'btn-active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid View"
          >
            ⊞
          </button>
          <button 
            className={`btn btn-sm ${viewMode === 'list' ? 'btn-active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List View"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-52 bg-base-200 border-r p-2">
          <ul className="menu menu-compact">
            <li>
              <button
                className={currentFolderId === 'root' ? 'active' : ''}
                onClick={() => navigateToFolder('root')}
              >
                📁 My Files
              </button>
            </li>
            <li><button>⭐ Recent</button></li>
            <li><button>🗑️ Trash</button></li>
          </ul>
        </aside>

        {/* Content */}
        <main className="flex-1 p-4 overflow-auto bg-base-100">
          {/* New Folder Dialog */}
          {showNewFolderDialog && (
            <div className="modal modal-open">
              <div className="modal-box">
                <h3 className="font-bold text-lg">New Folder</h3>
                <div className="py-4">
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Folder name"
                    className="input input-bordered w-full"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && createFolder()}
                  />
                </div>
                <div className="modal-action">
                  <button className="btn btn-ghost" onClick={() => setShowNewFolderDialog(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={createFolder}>Create</button>
                </div>
              </div>
            </div>
          )}

          {/* Breadcrumb */}
          <div className="breadcrumbs text-sm mb-4">
            <ul>
              {getBreadcrumb().map((folder) => (
                <li key={folder.id}>
                  <button onClick={() => navigateToFolder(folder.id)} className="link">
                    {folder.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 mb-4 text-center transition-colors ${
              isDragging ? 'border-primary bg-primary/10' : 'border-base-300'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <p className="text-base-content/60">
              Drag and drop files here or click Upload to add files
            </p>
          </div>

          {/* Files */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {currentFiles.map(file => (
                <div
                  key={file.id}
                  className={`card bg-base-200 cursor-pointer hover:bg-base-300 transition-colors ${
                    selectedFiles.has(file.id) ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={(e) => handleFileClick(file, e)}
                  onDoubleClick={() => handleFileDoubleClick(file)}
                >
                  <div className="card-body items-center text-center p-4">
                    <div className="text-4xl mb-2">{getFileIcon(file.type)}</div>
                    <div className="text-sm font-medium truncate w-full">{file.name}</div>
                    {file.size && (
                      <div className="text-xs text-base-content/60">{formatFileSize(file.size)}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
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
                      className={`cursor-pointer hover ${selectedFiles.has(file.id) ? 'bg-primary/10' : ''}`}
                      onClick={(e) => handleFileClick(file, e)}
                      onDoubleClick={() => handleFileDoubleClick(file)}
                    >
                      <td className="flex items-center gap-2">
                        <span>{getFileIcon(file.type)}</span>
                        <span className="truncate">{file.name}</span>
                      </td>
                      <td>{formatDate(file.modifiedAt)}</td>
                      <td>{file.size ? formatFileSize(file.size) : '—'}</td>
                      <td className="capitalize">{file.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {currentFiles.length === 0 && (
            <div className="text-center py-12 text-base-content/60">
              <div className="text-4xl mb-4">📂</div>
              <p>This folder is empty</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
