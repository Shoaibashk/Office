import { useState, useCallback } from "react";
import {
  Flex,
  Box,
  Text,
  Heading,
  ScrollArea,
  Avatar,
  Badge,
} from "@radix-ui/themes";
import {
  FileIcon,
  FolderIcon,
  StarIcon,
  StarFilledIcon,
  TrashIcon,
  ClockIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  GridIcon,
  ListBulletIcon,
  DotsHorizontalIcon,
  PlusIcon,
  UploadIcon,
  DownloadIcon,
  Share1Icon,
  Pencil1Icon,
  CopyIcon,
  ChevronRightIcon,
  FileTextIcon,
  TableIcon,
  ImageIcon,
  VideoIcon,
} from "@radix-ui/react-icons";
import {
  Button,
  IconButton,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  Input,
  SimpleTooltip,
} from "@office/ui";
import { useDriveStore, FileType } from "../store/driveStore";
import { formatFileSize, formatDate } from "@office/ui/utils";

// File type icon component
function FileTypeIcon({ type, size = 32 }: { type: FileType; size?: number }) {
  const style = { width: size, height: size };

  switch (type) {
    case "folder":
      return <FolderIcon style={style} className="text-yellow-500" />;
    case "document":
      return <FileTextIcon style={style} className="text-blue-600" />;
    case "spreadsheet":
      return <TableIcon style={style} className="text-green-600" />;
    case "presentation":
      return <FileIcon style={style} className="text-orange-500" />;
    case "image":
      return <ImageIcon style={style} className="text-purple-500" />;
    case "pdf":
      return <FileIcon style={style} className="text-red-500" />;
    default:
      return <FileIcon style={style} className="text-gray-500" />;
  }
}

// Breadcrumb component
function Breadcrumbs() {
  const { path, navigateToFolder } = useDriveStore();

  return (
    <Flex align="center" gap="1" className="text-sm">
      {path.map((item, index) => (
        <Flex key={item.id ?? "root"} align="center" gap="1">
          {index > 0 && <ChevronRightIcon className="text-gray-400" />}
          <button
            onClick={() => navigateToFolder(item.id)}
            className={`px-2 py-1 rounded hover:bg-gray-100 ${
              index === path.length - 1
                ? "font-medium text-gray-900"
                : "text-gray-600"
            }`}
          >
            {index === 0 ? <HomeIcon className="w-4 h-4" /> : item.name}
          </button>
        </Flex>
      ))}
    </Flex>
  );
}

// Sidebar component
function DriveSidebar() {
  const {
    currentFolderId,
    navigateToFolder,
    getStarredItems,
    getTrashedItems,
    addItem,
  } = useDriveStore();
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const starredCount = getStarredItems().length;
  const trashedCount = getTrashedItems().length;

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      addItem({
        name: newFolderName.trim(),
        type: "folder",
        parentId: currentFolderId,
        size: 0,
        isStarred: false,
        isTrashed: false,
      });
      setNewFolderName("");
      setShowNewFolderModal(false);
    }
  };

  const navItems = [
    {
      id: "my-drive",
      label: "My Drive",
      icon: <HomeIcon />,
      action: () => navigateToFolder(null),
    },
    {
      id: "starred",
      label: "Starred",
      icon: <StarFilledIcon />,
      badge: starredCount,
    },
    { id: "recent", label: "Recent", icon: <ClockIcon /> },
    { id: "trash", label: "Trash", icon: <TrashIcon />, badge: trashedCount },
  ];

  return (
    <Box className="w-60 border-r border-gray-200 bg-gray-50 flex flex-col h-full">
      {/* New button */}
      <Box className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="3" className="w-full">
              <PlusIcon />
              New
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              icon={<FolderIcon />}
              onClick={() => setShowNewFolderModal(true)}
            >
              New Folder
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem icon={<FileTextIcon />}>
              Document
            </DropdownMenuItem>
            <DropdownMenuItem icon={<TableIcon />}>
              Spreadsheet
            </DropdownMenuItem>
            <DropdownMenuItem icon={<FileIcon />}>
              Presentation
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem icon={<UploadIcon />}>
              File Upload
            </DropdownMenuItem>
            <DropdownMenuItem icon={<FolderIcon />}>
              Folder Upload
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Box>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <Box className="px-2 py-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={item.action}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-200 transition-colors"
            >
              {item.icon}
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <Badge size="1" color="gray">
                  {item.badge}
                </Badge>
              )}
            </button>
          ))}
        </Box>

        {/* Storage info */}
        <Box className="px-4 py-4 mt-4 border-t border-gray-200">
          <Text size="2" className="text-gray-500 block mb-2">
            Storage
          </Text>
          <Box className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <Box className="h-full w-1/4 bg-blue-500 rounded-full" />
          </Box>
          <Text size="1" className="text-gray-500 mt-1">
            2.5 GB of 15 GB used
          </Text>
        </Box>
      </ScrollArea>

      {/* New Folder Modal */}
      <Modal open={showNewFolderModal} onOpenChange={setShowNewFolderModal}>
        <ModalContent size="sm">
          <ModalHeader>
            <ModalTitle>New Folder</ModalTitle>
          </ModalHeader>
          <Input
            placeholder="Folder name"
            value={newFolderName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewFolderName(e.target.value)
            }
            onKeyDown={(e: React.KeyboardEvent) =>
              e.key === "Enter" && handleCreateFolder()
            }
          />
          <ModalFooter>
            <Button
              variant="soft"
              color="gray"
              onClick={() => setShowNewFolderModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>Create</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

// File grid item
function FileGridItem({
  item,
}: {
  item: ReturnType<typeof useDriveStore>["items"][0];
}) {
  const {
    selectItem,
    selectedIds,
    navigateToFolder,
    toggleStar,
    trashItem,
    renameItem,
  } = useDriveStore();
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(item.name);

  const isSelected = selectedIds.includes(item.id);

  const handleDoubleClick = () => {
    if (item.type === "folder") {
      navigateToFolder(item.id);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    selectItem(item.id, e.ctrlKey || e.metaKey);
  };

  const handleRename = () => {
    if (newName.trim() && newName !== item.name) {
      renameItem(item.id, newName.trim());
    }
    setIsRenaming(false);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Box
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          className={`
            relative p-4 rounded-lg cursor-pointer transition-all
            ${
              isSelected
                ? "bg-blue-100 ring-2 ring-blue-500"
                : "hover:bg-gray-100"
            }
          `}
        >
          {/* Star indicator */}
          {item.isStarred && (
            <StarFilledIcon className="absolute top-2 right-2 w-4 h-4 text-yellow-500" />
          )}

          {/* Icon */}
          <Flex justify="center" className="mb-3">
            <FileTypeIcon type={item.type} size={48} />
          </Flex>

          {/* Name */}
          {isRenaming ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
              className="w-full text-center text-sm border border-blue-500 rounded px-1 py-0.5 focus:outline-none"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <Text
              size="2"
              className="block text-center truncate"
              title={item.name}
            >
              {item.name}
            </Text>
          )}
        </Box>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem icon={<FolderIcon />} onClick={handleDoubleClick}>
          Open
        </ContextMenuItem>
        <ContextMenuItem
          icon={<Pencil1Icon />}
          onClick={() => setIsRenaming(true)}
        >
          Rename
        </ContextMenuItem>
        <ContextMenuItem
          icon={item.isStarred ? <StarIcon /> : <StarFilledIcon />}
          onClick={() => toggleStar(item.id)}
        >
          {item.isStarred ? "Remove from Starred" : "Add to Starred"}
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem icon={<CopyIcon />}>Make a Copy</ContextMenuItem>
        <ContextMenuItem icon={<DownloadIcon />}>Download</ContextMenuItem>
        <ContextMenuItem icon={<Share1Icon />}>Share</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          icon={<TrashIcon />}
          destructive
          onClick={() => trashItem(item.id)}
        >
          Move to Trash
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

// File list item
function FileListItem({
  item,
}: {
  item: ReturnType<typeof useDriveStore>["items"][0];
}) {
  const { selectItem, selectedIds, navigateToFolder, toggleStar, trashItem } =
    useDriveStore();
  const isSelected = selectedIds.includes(item.id);

  const handleDoubleClick = () => {
    if (item.type === "folder") {
      navigateToFolder(item.id);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    selectItem(item.id, e.ctrlKey || e.metaKey);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Flex
          align="center"
          gap="3"
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          className={`
            px-4 py-2 cursor-pointer transition-colors border-b border-gray-100
            ${isSelected ? "bg-blue-50" : "hover:bg-gray-50"}
          `}
        >
          <FileTypeIcon type={item.type} size={24} />
          <Text className="flex-1 truncate">{item.name}</Text>
          <Text size="2" className="text-gray-500 w-24">
            {item.type === "folder" ? "—" : formatFileSize(item.size)}
          </Text>
          <Text size="2" className="text-gray-500 w-32">
            {formatDate(item.updatedAt)}
          </Text>
          <Flex gap="1">
            <SimpleTooltip
              content={item.isStarred ? "Remove star" : "Add star"}
            >
              <IconButton
                size="1"
                variant="ghost"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  toggleStar(item.id);
                }}
              >
                {item.isStarred ? (
                  <StarFilledIcon className="text-yellow-500" />
                ) : (
                  <StarIcon className="text-gray-400" />
                )}
              </IconButton>
            </SimpleTooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IconButton
                  size="1"
                  variant="ghost"
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                >
                  <DotsHorizontalIcon />
                </IconButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem icon={<Pencil1Icon />}>
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem icon={<CopyIcon />}>
                  Make a Copy
                </DropdownMenuItem>
                <DropdownMenuItem icon={<Share1Icon />}>Share</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  icon={<TrashIcon />}
                  destructive
                  onClick={() => trashItem(item.id)}
                >
                  Move to Trash
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Flex>
        </Flex>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem icon={<FolderIcon />} onClick={handleDoubleClick}>
          Open
        </ContextMenuItem>
        <ContextMenuItem icon={<Pencil1Icon />}>Rename</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          icon={<TrashIcon />}
          destructive
          onClick={() => trashItem(item.id)}
        >
          Move to Trash
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

// Main Drive App component
export function DriveApp() {
  const {
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    getCurrentItems,
    selectedIds,
    clearSelection,
  } = useDriveStore();

  const items = getCurrentItems();

  return (
    <Flex className="h-screen w-screen">
      <DriveSidebar />

      <Flex direction="column" className="flex-1 overflow-hidden">
        {/* Header */}
        <Flex
          align="center"
          justify="between"
          className="h-16 px-6 border-b border-gray-200 shrink-0"
        >
          {/* Search */}
          <Box className="flex-1 max-w-xl">
            <Input
              placeholder="Search in Drive"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
              leftIcon={<MagnifyingGlassIcon />}
            />
          </Box>

          {/* User */}
          <Flex align="center" gap="3">
            <Avatar
              size="2"
              src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=64&h=64&fit=crop"
              fallback="U"
              radius="full"
            />
          </Flex>
        </Flex>

        {/* Toolbar */}
        <Flex
          align="center"
          justify="between"
          className="h-12 px-6 border-b border-gray-100 shrink-0"
        >
          <Breadcrumbs />

          <Flex gap="2">
            <SimpleTooltip content="Grid view">
              <IconButton
                variant={viewMode === "grid" ? "solid" : "ghost"}
                onClick={() => setViewMode("grid")}
              >
                <GridIcon />
              </IconButton>
            </SimpleTooltip>
            <SimpleTooltip content="List view">
              <IconButton
                variant={viewMode === "list" ? "solid" : "ghost"}
                onClick={() => setViewMode("list")}
              >
                <ListBulletIcon />
              </IconButton>
            </SimpleTooltip>
          </Flex>
        </Flex>

        {/* Content */}
        <ScrollArea className="flex-1">
          {items.length === 0 ? (
            <Flex
              direction="column"
              align="center"
              justify="center"
              className="h-full"
            >
              <FolderIcon className="w-24 h-24 text-gray-300 mb-4" />
              <Heading size="4" className="text-gray-500 mb-2">
                This folder is empty
              </Heading>
              <Text className="text-gray-400">
                Drop files here or use the "New" button
              </Text>
            </Flex>
          ) : viewMode === "grid" ? (
            <Box className="p-6">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2">
                {items.map((item) => (
                  <FileGridItem key={item.id} item={item} />
                ))}
              </div>
            </Box>
          ) : (
            <Box>
              {/* List header */}
              <Flex
                align="center"
                gap="3"
                className="px-4 py-2 border-b border-gray-200 bg-gray-50 text-sm font-medium text-gray-600"
              >
                <Box className="w-6" />
                <Text className="flex-1">Name</Text>
                <Text className="w-24">Size</Text>
                <Text className="w-32">Modified</Text>
                <Box className="w-16" />
              </Flex>
              {items.map((item) => (
                <FileListItem key={item.id} item={item} />
              ))}
            </Box>
          )}
        </ScrollArea>

        {/* Status bar */}
        <Flex
          align="center"
          className="h-8 px-6 bg-gray-50 border-t border-gray-200 text-sm text-gray-500 shrink-0"
        >
          <Text size="1">
            {items.length} items
            {selectedIds.length > 0 && ` • ${selectedIds.length} selected`}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
