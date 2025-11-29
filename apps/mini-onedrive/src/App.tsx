import { useState, useCallback, useRef } from 'react';
import { Layout, Toolbar, ToolbarButton, ToolbarDivider, Sidebar, SidebarItem, Button } from '@office/ui';

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

  const header = (
    <div className="flex flex-col">
      <div className="flex items-center gap-4 px-4 py-2 bg-blue-500">
        <span className="text-xl font-bold text-white">☁️ Mini OneDrive</span>
      </div>
      <Toolbar>
        <ToolbarButton onClick={() => fileInputRef.current?.click()} tooltip="Upload Files">
          ⬆️ Upload
        </ToolbarButton>
        <ToolbarButton onClick={() => setShowNewFolderDialog(true)} tooltip="New Folder">
          📁 New Folder
        </ToolbarButton>
        <ToolbarDivider />
        {selectedFiles.size > 0 && (
          <ToolbarButton onClick={deleteSelectedFiles} tooltip="Delete">
            🗑️ Delete
          </ToolbarButton>
        )}
        <div className="flex-1" />
        <ToolbarButton 
          onClick={() => setViewMode('grid')} 
          active={viewMode === 'grid'}
          tooltip="Grid View"
        >
          ⊞
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => setViewMode('list')} 
          active={viewMode === 'list'}
          tooltip="List View"
        >
          ☰
        </ToolbarButton>
      </Toolbar>
    </div>
  );

  const sidebar = (
    <Sidebar width="200px">
      <div className="p-2">
        <SidebarItem
          active={currentFolderId === 'root'}
          onClick={() => navigateToFolder('root')}
          icon="📁"
        >
          My Files
        </SidebarItem>
        <SidebarItem icon="⭐">Recent</SidebarItem>
        <SidebarItem icon="🗑️">Trash</SidebarItem>
      </div>
    </Sidebar>
  );

  return (
    <Layout header={header} sidebar={sidebar}>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* New Folder Dialog */}
      {showNewFolderDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">New Folder</h2>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="w-full border rounded px-3 py-2 mb-4"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && createFolder()}
            />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowNewFolderDialog(false)}>
                Cancel
              </Button>
              <Button onClick={createFolder}>Create</Button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-sm">
          {getBreadcrumb().map((folder, index, arr) => (
            <span key={folder.id} className="flex items-center gap-2">
              <span
                className={index < arr.length - 1 ? 'breadcrumb-item' : 'font-semibold'}
                onClick={() => index < arr.length - 1 && navigateToFolder(folder.id)}
              >
                {folder.name}
              </span>
              {index < arr.length - 1 && <span className="text-gray-400">/</span>}
            </span>
          ))}
        </div>

        {/* Drop Zone */}
        <div
          className={`drop-zone rounded-lg p-8 mb-4 ${isDragging ? 'dragover' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <p className="text-center text-gray-500">
            Drag and drop files here or click Upload to add files
          </p>
        </div>

        {/* Files */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {currentFiles.map(file => (
              <div
                key={file.id}
                className={`file-item p-4 rounded-lg border text-center ${
                  selectedFiles.has(file.id) ? 'selected border-blue-500' : 'border-gray-200'
                }`}
                onClick={(e) => handleFileClick(file, e)}
                onDoubleClick={() => handleFileDoubleClick(file)}
              >
                <div className="text-4xl mb-2">{getFileIcon(file.type)}</div>
                <div className="text-sm font-medium truncate">{file.name}</div>
                {file.size && (
                  <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border">
            <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-50 font-semibold text-sm border-b">
              <div className="col-span-6">Name</div>
              <div className="col-span-2">Modified</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-2">Type</div>
            </div>
            {currentFiles.map(file => (
              <div
                key={file.id}
                className={`file-item grid grid-cols-12 gap-4 px-4 py-2 text-sm ${
                  selectedFiles.has(file.id) ? 'selected' : ''
                }`}
                onClick={(e) => handleFileClick(file, e)}
                onDoubleClick={() => handleFileDoubleClick(file)}
              >
                <div className="col-span-6 flex items-center gap-2">
                  <span>{getFileIcon(file.type)}</span>
                  <span className="truncate">{file.name}</span>
                </div>
                <div className="col-span-2 text-gray-500">{formatDate(file.modifiedAt)}</div>
                <div className="col-span-2 text-gray-500">
                  {file.size ? formatFileSize(file.size) : '—'}
                </div>
                <div className="col-span-2 text-gray-500 capitalize">{file.type}</div>
              </div>
            ))}
          </div>
        )}

        {currentFiles.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">📂</div>
            <p>This folder is empty</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default App;
