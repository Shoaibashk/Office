import { useEffect, useCallback } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import FontFamily from "@tiptap/extension-font-family";
import { Flex, Box, Text, Avatar } from "@radix-ui/themes";
import {
  FontBoldIcon,
  FontItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  TextAlignJustifyIcon,
  ListBulletIcon,
  ChevronDownIcon,
  FileIcon,
  Pencil1Icon,
  ReaderIcon,
  MagnifyingGlassIcon,
  Share1Icon,
  DownloadIcon,
  PlusIcon,
  MinusIcon,
  ReloadIcon,
  ChatBubbleIcon,
  RulerHorizontalIcon,
  ViewVerticalIcon,
} from "@radix-ui/react-icons";
import { useWordStore } from "../store/wordStore";

// Font options
const FONTS = [
  "Arial",
  "Calibri",
  "Times New Roman",
  "Georgia",
  "Verdana",
  "Courier New",
  "Comic Sans MS",
  "Impact",
];

const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];

// Toolbar component (Google Docs style)
function WordToolbar({ editor }: { editor: Editor | null }) {
  const { format, setFontFamily, setFontSize } = useWordStore();

  if (!editor) return null;

  return (
    <Box className="border-b border-gray-200 bg-white px-3 py-2">
      {/* Ribbon tabs */}
      <Flex className="mb-1 border-b border-gray-200 pb-1 text-sm text-gray-600">
        <button className="px-3 py-1 font-medium text-blue-600 border-b-2 border-blue-600">
          Home
        </button>
        <button className="px-3 py-1 hover:text-gray-900">Insert</button>
        <button className="px-3 py-1 hover:text-gray-900">Layout</button>
        <button className="px-3 py-1 hover:text-gray-900">Review</button>
        <button className="px-3 py-1 hover:text-gray-900">View</button>
      </Flex>

      {/* Toolbar */}
      <Flex align="center" gap="3" wrap="wrap" className="mt-1">
        {/* Font group */}
        <Flex direction="column" className="border-r border-gray-200 pr-3">
          <Flex gap="2" align="center" className="mb-1">
            <select
              className="w-32 rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700"
              value={format.fontFamily}
              onChange={(e) => {
                const font = e.target.value;
                setFontFamily(font);
                editor.chain().focus().setFontFamily(font).run();
              }}
            >
              {FONTS.map((font) => (
                <option key={font} value={font} className="font-sans">
                  {font}
                </option>
              ))}
            </select>

            <select
              className="w-16 rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700"
              value={format.fontSize}
              onChange={(e) => {
                const size = Number(e.target.value);
                setFontSize(size);
                editor
                  .chain()
                  .focus()
                  .setMark("textStyle", { fontSize: `${size}pt` })
                  .run();
              }}
            >
              {FONT_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </Flex>

          <Flex gap="1" className="mt-1">
            <button
              className={`flex h-7 w-7 items-center justify-center rounded text-xs hover:bg-gray-100 ${
                editor.isActive("bold") ? "bg-blue-50 text-blue-600" : ""
              }`}
              onClick={() => editor.chain().focus().toggleBold().run()}
              aria-label="Bold"
            >
              <FontBoldIcon />
            </button>
            <button
              className={`flex h-7 w-7 items-center justify-center rounded text-xs hover:bg-gray-100 ${
                editor.isActive("italic") ? "bg-blue-50 text-blue-600" : ""
              }`}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              aria-label="Italic"
            >
              <FontItalicIcon />
            </button>
            <button
              className={`flex h-7 w-7 items-center justify-center rounded text-xs hover:bg-gray-100 ${
                editor.isActive("underline") ? "bg-blue-50 text-blue-600" : ""
              }`}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              aria-label="Underline"
            >
              <UnderlineIcon />
            </button>
            <button
              className={`flex h-7 w-7 items-center justify-center rounded text-xs hover:bg-gray-100 ${
                editor.isActive("strike") ? "bg-blue-50 text-blue-600" : ""
              }`}
              onClick={() => editor.chain().focus().toggleStrike().run()}
              aria-label="Strikethrough"
            >
              <StrikethroughIcon />
            </button>
          </Flex>
        </Flex>

        {/* Paragraph group */}
        <Flex direction="column" className="border-r border-gray-200 pr-3">
          <Flex gap="1" className="mb-1">
            <button
              className={`flex h-7 w-7 items-center justify-center rounded text-xs hover:bg-gray-100 ${
                editor.isActive("bulletList") ? "bg-blue-50 text-blue-600" : ""
              }`}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              aria-label="Bulleted list"
            >
              <ListBulletIcon />
            </button>
            <button
              className={`flex h-7 w-7 items-center justify-center rounded text-xs hover:bg-gray-100 ${
                editor.isActive("orderedList") ? "bg-blue-50 text-blue-600" : ""
              }`}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              aria-label="Numbered list"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="currentColor"
              >
                <path d="M2.5 2.5V5H2V5.5H3.5V5H3V3.5H2V2.5H2.5ZM6 4H13V5H6V4ZM6 7H13V8H6V7ZM6 10H13V11H6V10ZM2 7V10H3V9H3.5V8.5H3V7.5H3.5V7H2ZM2 11V13H3.5V12.5H3V12H3.5V11.5H3.5V11H2Z" />
              </svg>
            </button>
          </Flex>
          <Flex gap="1">
            <button
              className={`flex h-7 w-7 items-center justify-center rounded text-xs hover:bg-gray-100 ${
                editor.isActive({ textAlign: "left" })
                  ? "bg-blue-50 text-blue-600"
                  : ""
              }`}
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              aria-label="Align left"
            >
              <TextAlignLeftIcon />
            </button>
            <button
              className={`flex h-7 w-7 items-center justify-center rounded text-xs hover:bg-gray-100 ${
                editor.isActive({ textAlign: "center" })
                  ? "bg-blue-50 text-blue-600"
                  : ""
              }`}
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              aria-label="Align center"
            >
              <TextAlignCenterIcon />
            </button>
            <button
              className={`flex h-7 w-7 items-center justify-center rounded text-xs hover:bg-gray-100 ${
                editor.isActive({ textAlign: "right" })
                  ? "bg-blue-50 text-blue-600"
                  : ""
              }`}
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              aria-label="Align right"
            >
              <TextAlignRightIcon />
            </button>
            <button
              className={`flex h-7 w-7 items-center justify-center rounded text-xs hover:bg-gray-100 ${
                editor.isActive({ textAlign: "justify" })
                  ? "bg-blue-50 text-blue-600"
                  : ""
              }`}
              onClick={() =>
                editor.chain().focus().setTextAlign("justify").run()
              }
              aria-label="Justify"
            >
              <TextAlignJustifyIcon />
            </button>
          </Flex>
        </Flex>

        {/* Styles group */}
        <Flex direction="column">
          <Flex gap="1" className="mb-1">
            <button className="rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700">
              Normal text
            </button>
            <button className="rounded border border-transparent px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100">
              Heading 1
            </button>
            <button className="rounded border border-transparent px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100">
              Heading 2
            </button>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}

// Header (Google Docs style)
function WordHeader() {
  const { document, setTitle } = useWordStore();

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <FileIcon className="h-6 w-6 text-blue-600" />
          <span className="text-sm font-semibold text-gray-700">Docs</span>
        </div>
        <div className="ml-4 flex flex-col">
          <input
            type="text"
            value={document.title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-56 rounded px-1 py-0.5 text-sm text-gray-900 hover:bg-gray-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            placeholder="Untitled document"
          />
          <span className="text-xs text-gray-500">Saved to Office</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100">
          <ChatBubbleIcon />
        </button>
        <button className="flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700">
          <Share1Icon />
          <span>Share</span>
        </button>
        <Avatar
          size="2"
          src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=64&h=64&fit=crop"
          fallback="U"
          radius="full"
        />
      </div>
    </header>
  );
}

// Status bar component
function StatusBar() {
  const { document, editor, setZoom } = useWordStore();

  return (
    <Flex
      align="center"
      justify="between"
      className="h-6 border-t border-gray-200 bg-gray-100 px-4 text-xs text-gray-600"
    >
      <Flex gap="4">
        <Text>
          Page {editor.currentPage} of {document.pageCount}
        </Text>
        <Text>{document.wordCount} words</Text>
        <Text>{document.characterCount} characters</Text>
      </Flex>
      <Flex align="center" gap="2">
        <button
          className="flex h-5 w-5 items-center justify-center rounded hover:bg-gray-200"
          onClick={() => setZoom(editor.zoom - 10)}
          aria-label="Zoom out"
        >
          <MinusIcon />
        </button>
        <Text className="w-12 text-center">{editor.zoom}%</Text>
        <button
          className="flex h-5 w-5 items-center justify-center rounded hover:bg-gray-200"
          onClick={() => setZoom(editor.zoom + 10)}
          aria-label="Zoom in"
        >
          <PlusIcon />
        </button>
      </Flex>
    </Flex>
  );
}

// Main Word App component
export function WordApp() {
  const {
    document,
    setContent,
    editor: editorState,
    pushHistory,
  } = useWordStore();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      FontFamily,
    ],
    content: document.content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
    },
    onSelectionUpdate: () => {
      // Update format state based on selection
    },
  });

  // Auto-save effect
  useEffect(() => {
    if (!document.isModified) return;

    const timeout = setTimeout(() => {
      pushHistory("Auto-save");
    }, 30000); // Auto-save every 30 seconds

    return () => clearTimeout(timeout);
  }, [document.content, document.isModified]);

  return (
    <div className="flex h-screen w-screen flex-col bg-gray-100">
      <WordHeader />

      {/* Menu bar */}
      <nav className="flex h-8 items-center gap-2 border-b border-gray-200 bg-white px-3 text-xs text-gray-700">
        {[
          "File",
          "Edit",
          "View",
          "Insert",
          "Format",
          "Tools",
          "Extensions",
          "Help",
        ].map((item) => (
          <button
            key={item}
            className="rounded px-1.5 py-0.5 hover:bg-gray-100"
          >
            {item}
          </button>
        ))}
      </nav>

      <WordToolbar editor={editor} />

      {/* Document area */}
      <main className="flex flex-1 justify-center overflow-auto bg-gray-100 py-6">
        <div className="relative flex min-h-full w-[8.5in] max-w-full justify-center bg-transparent">
          <div className="page relative w-full bg-white px-10 py-8 shadow-md">
            <EditorContent
              editor={editor}
              className="prose prose-sm max-w-none outline-none"
            />
          </div>
        </div>
      </main>

      <StatusBar />
    </div>
  );
}
