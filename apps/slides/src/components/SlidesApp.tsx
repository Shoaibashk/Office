import { useEffect, useRef, useCallback, useState } from "react";
import { Flex, Box, Text, ScrollArea, Avatar } from "@radix-ui/themes";
import {
  PlayIcon,
  PlusIcon,
  MinusIcon,
  CopyIcon,
  TrashIcon,
  TextIcon,
  SquareIcon,
  ImageIcon,
  Share1Icon,
  DownloadIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExitIcon,
  DotsHorizontalIcon,
  SpeakerLoudIcon,
  VideoIcon,
  TableIcon,
} from "@radix-ui/react-icons";
import {
  Button,
  IconButton,
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
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
} from "@office/ui";
import { useSlidesStore } from "../store/slidesStore";

// Slide thumbnail component
function SlideThumbnail({
  slide,
  index,
  isActive,
  onClick,
}: {
  slide: any;
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const { duplicateSlide, deleteSlide, presentation } = useSlidesStore();

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Flex
          gap="2"
          align="center"
          className={`p-2 cursor-pointer rounded-lg transition-colors ${
            isActive ? "bg-orange-100" : "hover:bg-gray-100"
          }`}
          onClick={onClick}
        >
          <Text size="1" className="text-gray-500 w-4">
            {index + 1}
          </Text>
          <Box
            className={`w-32 h-20 bg-white border-2 rounded shadow-sm overflow-hidden ${
              isActive ? "border-orange-500" : "border-gray-200"
            }`}
            style={{ backgroundColor: slide.background }}
          >
            {/* Mini preview of slide content */}
            <Box
              className="w-full h-full relative"
              style={{ transform: "scale(0.15)", transformOrigin: "top left" }}
            >
              {slide.elements?.map((el: any) => (
                <Box
                  key={el.id}
                  className="absolute"
                  style={{
                    left: el.x,
                    top: el.y,
                    width: el.width,
                    height: el.height,
                  }}
                >
                  {el.type === "text" && (
                    <Text
                      style={{
                        fontSize: el.data?.fontSize ?? 24,
                        color: el.data?.fill ?? "#000",
                        fontWeight: el.data?.fontWeight,
                      }}
                    >
                      {el.data?.text}
                    </Text>
                  )}
                  {el.type === "shape" && (
                    <Box
                      className="w-full h-full"
                      style={{
                        backgroundColor: el.data?.fill ?? "#3b82f6",
                        borderRadius:
                          el.data?.shapeType === "circle" ? "50%" : undefined,
                      }}
                    />
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        </Flex>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => duplicateSlide(index)}>
          <CopyIcon className="mr-2" /> Duplicate
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          destructive
          onClick={() => deleteSlide(index)}
          disabled={presentation.slides.length <= 1}
        >
          <TrashIcon className="mr-2" /> Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

// Slide panel (left sidebar)
function SlidePanel() {
  const { presentation, currentSlideIndex, setCurrentSlide, addSlide } =
    useSlidesStore();

  return (
    <Box className="w-48 border-r border-gray-200 bg-gray-50 flex flex-col h-full">
      <Flex
        align="center"
        justify="between"
        className="p-2 border-b border-gray-200"
      >
        <Text weight="medium" size="2">
          Slides
        </Text>
        <SimpleTooltip content="Add slide">
          <IconButton
            size="1"
            variant="ghost"
            onClick={() => addSlide(currentSlideIndex)}
          >
            <PlusIcon />
          </IconButton>
        </SimpleTooltip>
      </Flex>

      <ScrollArea className="flex-1">
        <Box className="p-2">
          {presentation.slides.map((slide, index) => (
            <SlideThumbnail
              key={slide.id}
              slide={slide}
              index={index}
              isActive={index === currentSlideIndex}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </Box>
      </ScrollArea>
    </Box>
  );
}

// Toolbar component
function SlidesToolbar() {
  const { addElement, selectedElementIds, deleteElements, zoom, setZoom } =
    useSlidesStore();

  return (
    <Box className="border-b border-gray-200 bg-white px-4 py-2">
      {/* Tabs */}
      <Flex className="mb-2 border-b border-gray-100 pb-2">
        <button className="px-4 py-1 text-sm font-medium text-orange-600 border-b-2 border-orange-600">
          Home
        </button>
        <button className="px-4 py-1 text-sm text-gray-600 hover:text-gray-900">
          Insert
        </button>
        <button className="px-4 py-1 text-sm text-gray-600 hover:text-gray-900">
          Design
        </button>
        <button className="px-4 py-1 text-sm text-gray-600 hover:text-gray-900">
          Transitions
        </button>
        <button className="px-4 py-1 text-sm text-gray-600 hover:text-gray-900">
          Animations
        </button>
        <button className="px-4 py-1 text-sm text-gray-600 hover:text-gray-900">
          Slide Show
        </button>
      </Flex>

      {/* Toolbar buttons */}
      <Flex align="center" gap="4" wrap="wrap">
        {/* Insert group */}
        <Flex direction="column" className="border-r border-gray-200 pr-4">
          <Flex gap="1" className="mb-1">
            <SimpleTooltip content="Insert text box">
              <IconButton
                size="2"
                variant="ghost"
                onClick={() => addElement("text")}
              >
                <TextIcon />
              </IconButton>
            </SimpleTooltip>
            <SimpleTooltip content="Insert shape">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <IconButton size="2" variant="ghost">
                    <SquareIcon />
                  </IconButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() =>
                      addElement("shape", { shapeType: "rectangle" })
                    }
                  >
                    Rectangle
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => addElement("shape", { shapeType: "circle" })}
                  >
                    Circle
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      addElement("shape", { shapeType: "triangle" })
                    }
                  >
                    Triangle
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => addElement("shape", { shapeType: "arrow" })}
                  >
                    Arrow
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SimpleTooltip>
            <SimpleTooltip content="Insert image">
              <IconButton
                size="2"
                variant="ghost"
                onClick={() => addElement("image")}
              >
                <ImageIcon />
              </IconButton>
            </SimpleTooltip>
          </Flex>
          <Text size="1" className="text-gray-500 text-center">
            Insert
          </Text>
        </Flex>

        {/* Format group */}
        <Flex direction="column" className="border-r border-gray-200 pr-4">
          <Flex gap="1" className="mb-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="1" variant="ghost">
                  Font
                  <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Arial</DropdownMenuItem>
                <DropdownMenuItem>Calibri</DropdownMenuItem>
                <DropdownMenuItem>Times New Roman</DropdownMenuItem>
                <DropdownMenuItem>Georgia</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="1" variant="ghost">
                  24
                  <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {[12, 14, 18, 24, 32, 44, 60].map((size) => (
                  <DropdownMenuItem key={size}>{size}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </Flex>
          <Text size="1" className="text-gray-500 text-center">
            Font
          </Text>
        </Flex>

        {/* Actions */}
        {selectedElementIds.length > 0 && (
          <Flex direction="column">
            <Flex gap="1" className="mb-1">
              <SimpleTooltip content="Delete selected">
                <IconButton
                  size="2"
                  variant="ghost"
                  color="red"
                  onClick={() => deleteElements(selectedElementIds)}
                >
                  <TrashIcon />
                </IconButton>
              </SimpleTooltip>
              <SimpleTooltip content="Duplicate">
                <IconButton size="2" variant="ghost">
                  <CopyIcon />
                </IconButton>
              </SimpleTooltip>
            </Flex>
            <Text size="1" className="text-gray-500 text-center">
              Actions
            </Text>
          </Flex>
        )}
      </Flex>
    </Box>
  );
}

// Header component
function SlidesHeader() {
  const { presentation, setTitle, startPresentation, save, isDirty } =
    useSlidesStore();

  return (
    <Flex align="center" className="h-12 px-4 bg-orange-500 text-white">
      {/* Logo */}
      <Flex align="center" gap="2" className="mr-6">
        <PlayIcon className="w-6 h-6" />
        <Text weight="bold" size="3">
          Slides
        </Text>
      </Flex>

      {/* File menu */}
      <Flex gap="2" className="flex-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="1"
              variant="ghost"
              className="text-white hover:bg-orange-600"
            >
              File
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>New</DropdownMenuItem>
            <DropdownMenuItem>Open</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={save}>Save</DropdownMenuItem>
            <DropdownMenuItem>Save As</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem icon={<DownloadIcon />}>Export</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="1"
              variant="ghost"
              className="text-white hover:bg-orange-600"
            >
              Edit
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem shortcut="Ctrl+Z">Undo</DropdownMenuItem>
            <DropdownMenuItem shortcut="Ctrl+Y">Redo</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem shortcut="Ctrl+C">Copy</DropdownMenuItem>
            <DropdownMenuItem shortcut="Ctrl+V">Paste</DropdownMenuItem>
            <DropdownMenuItem shortcut="Del">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="1"
              variant="ghost"
              className="text-white hover:bg-orange-600"
            >
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Normal</DropdownMenuItem>
            <DropdownMenuItem>Slide Sorter</DropdownMenuItem>
            <DropdownMenuItem>Notes Page</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Zoom In</DropdownMenuItem>
            <DropdownMenuItem>Zoom Out</DropdownMenuItem>
            <DropdownMenuItem>Fit to Window</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="1"
              variant="ghost"
              className="text-white hover:bg-orange-600"
            >
              Slide Show
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => startPresentation(0)}>
              From Beginning
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => startPresentation()}>
              From Current Slide
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Presenter View</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Flex>

      {/* Document title */}
      <Flex align="center" gap="2" className="mx-4">
        <input
          type="text"
          value={presentation.title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-transparent border-none text-white text-sm font-medium focus:outline-none focus:ring-1 focus:ring-white/50 rounded px-2 py-1"
        />
        {isDirty && (
          <Text size="1" className="text-orange-200">
            Unsaved
          </Text>
        )}
      </Flex>

      {/* Right side */}
      <Flex align="center" gap="3">
        <Button
          size="1"
          className="bg-white text-orange-500 hover:bg-orange-50"
          onClick={() => startPresentation()}
        >
          <PlayIcon />
          Present
        </Button>
        <Button
          size="1"
          className="bg-white text-orange-500 hover:bg-orange-50"
        >
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

// Main slide canvas
function SlideCanvas() {
  const {
    getCurrentSlide,
    currentSlideIndex,
    selectedElementIds,
    selectElement,
    clearSelection,
    updateElement,
    zoom,
  } = useSlidesStore();

  const slide = getCurrentSlide();
  const canvasRef = useRef<HTMLDivElement>(null);

  if (!slide) return null;

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      clearSelection();
    }
  };

  return (
    <Box className="flex-1 overflow-auto bg-gray-200 p-8">
      <Box className="flex items-center justify-center min-h-full">
        {/* Slide container */}
        <Box
          ref={canvasRef}
          className="relative bg-white shadow-xl"
          style={{
            width: 960,
            height: 540,
            backgroundColor: slide.background,
            transform: `scale(${zoom / 100})`,
            transformOrigin: "center center",
          }}
          onClick={handleCanvasClick}
        >
          {/* Elements */}
          {slide.elements.map((element) => {
            const isSelected = selectedElementIds.includes(element.id);

            return (
              <Box
                key={element.id}
                className={`absolute cursor-move ${
                  isSelected ? "ring-2 ring-blue-500" : ""
                }`}
                style={{
                  left: element.x,
                  top: element.y,
                  width: element.width,
                  height: element.height,
                  transform: element.rotation
                    ? `rotate(${element.rotation}deg)`
                    : undefined,
                  zIndex: element.zIndex,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  selectElement(element.id, e.shiftKey);
                }}
              >
                {element.type === "text" && (
                  <Box
                    className="w-full h-full flex items-center"
                    style={{
                      fontFamily: element.data?.fontFamily ?? "Arial",
                      fontSize: element.data?.fontSize ?? 24,
                      fontWeight: element.data?.fontWeight ?? "normal",
                      color: element.data?.fill ?? "#000",
                      textAlign: element.data?.textAlign ?? "left",
                      justifyContent:
                        element.data?.textAlign === "center"
                          ? "center"
                          : element.data?.textAlign === "right"
                          ? "flex-end"
                          : "flex-start",
                    }}
                    contentEditable={isSelected}
                    suppressContentEditableWarning
                  >
                    {element.data?.text}
                  </Box>
                )}
                {element.type === "shape" && (
                  <Box
                    className="w-full h-full"
                    style={{
                      backgroundColor: element.data?.fill ?? "#3b82f6",
                      border: element.data?.stroke
                        ? `${element.data?.strokeWidth ?? 2}px solid ${
                            element.data?.stroke
                          }`
                        : undefined,
                      borderRadius:
                        element.data?.shapeType === "circle"
                          ? "50%"
                          : undefined,
                    }}
                  />
                )}
                {element.type === "image" && element.data?.src && (
                  <img
                    src={element.data.src}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                )}

                {/* Selection handles */}
                {isSelected && (
                  <>
                    <Box className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-blue-500 cursor-nw-resize" />
                    <Box className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-blue-500 cursor-ne-resize" />
                    <Box className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-blue-500 cursor-sw-resize" />
                    <Box className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-blue-500 cursor-se-resize" />
                  </>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

// Notes panel
function NotesPanel() {
  const { getCurrentSlide, currentSlideIndex, setSlideNotes } =
    useSlidesStore();
  const slide = getCurrentSlide();

  return (
    <Box className="h-32 border-t border-gray-200 bg-white p-4">
      <Text size="2" weight="medium" className="mb-2 block text-gray-600">
        Speaker Notes
      </Text>
      <textarea
        className="w-full h-16 text-sm resize-none border border-gray-200 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
        placeholder="Click to add speaker notes..."
        value={slide?.notes ?? ""}
        onChange={(e) => setSlideNotes(currentSlideIndex, e.target.value)}
      />
    </Box>
  );
}

// Presentation mode
function PresentationMode() {
  const {
    getCurrentSlide,
    currentSlideIndex,
    presentation,
    nextSlide,
    previousSlide,
    stopPresentation,
  } = useSlidesStore();

  const slide = getCurrentSlide();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case "Space":
        case "Enter":
          nextSlide();
          break;
        case "ArrowLeft":
        case "Backspace":
          previousSlide();
          break;
        case "Escape":
          stopPresentation();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!slide) return null;

  return (
    <Box
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      onClick={nextSlide}
    >
      {/* Slide */}
      <Box
        className="relative"
        style={{
          width: "100vw",
          height: "100vh",
          maxWidth: "177.78vh", // 16:9 aspect ratio
          maxHeight: "56.25vw",
          backgroundColor: slide.background,
        }}
      >
        {/* Elements */}
        {slide.elements.map((element) => (
          <Box
            key={element.id}
            className="absolute"
            style={{
              left: `${(element.x / 960) * 100}%`,
              top: `${(element.y / 540) * 100}%`,
              width: `${(element.width / 960) * 100}%`,
              height: `${(element.height / 540) * 100}%`,
              zIndex: element.zIndex,
            }}
          >
            {element.type === "text" && (
              <Box
                className="w-full h-full flex items-center"
                style={{
                  fontFamily: element.data?.fontFamily ?? "Arial",
                  fontSize: `calc(${
                    element.data?.fontSize ?? 24
                  }px * (100vw / 960))`,
                  fontWeight: element.data?.fontWeight ?? "normal",
                  color: element.data?.fill ?? "#000",
                  textAlign: element.data?.textAlign ?? "left",
                  justifyContent:
                    element.data?.textAlign === "center"
                      ? "center"
                      : element.data?.textAlign === "right"
                      ? "flex-end"
                      : "flex-start",
                }}
              >
                {element.data?.text}
              </Box>
            )}
            {element.type === "shape" && (
              <Box
                className="w-full h-full"
                style={{
                  backgroundColor: element.data?.fill ?? "#3b82f6",
                  borderRadius:
                    element.data?.shapeType === "circle" ? "50%" : undefined,
                }}
              />
            )}
          </Box>
        ))}
      </Box>

      {/* Controls */}
      <Flex
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 rounded-full px-4 py-2 text-white"
        gap="4"
        align="center"
      >
        <IconButton
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            previousSlide();
          }}
        >
          <ChevronLeftIcon className="text-white" />
        </IconButton>
        <Text>
          {currentSlideIndex + 1} / {presentation.slides.length}
        </Text>
        <IconButton
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
        >
          <ChevronRightIcon className="text-white" />
        </IconButton>
        <IconButton
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            stopPresentation();
          }}
        >
          <ExitIcon className="text-white" />
        </IconButton>
      </Flex>
    </Box>
  );
}

// Status bar
function StatusBar() {
  const { currentSlideIndex, presentation, zoom, setZoom } = useSlidesStore();

  return (
    <Flex
      align="center"
      justify="between"
      className="h-6 px-4 bg-gray-100 border-t border-gray-200 text-xs text-gray-600"
    >
      <Text size="1">
        Slide {currentSlideIndex + 1} of {presentation.slides.length}
      </Text>
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

// Main Slides App component
export function SlidesApp() {
  const { isPresenting } = useSlidesStore();

  if (isPresenting) {
    return <PresentationMode />;
  }

  return (
    <Flex direction="column" className="h-screen w-screen">
      <SlidesHeader />
      <SlidesToolbar />
      <Flex className="flex-1 overflow-hidden">
        <SlidePanel />
        <Flex direction="column" className="flex-1">
          <SlideCanvas />
          <NotesPanel />
        </Flex>
      </Flex>
      <StatusBar />
    </Flex>
  );
}
