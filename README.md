# 🏢 Office Web Suite

A modern, enterprise-level office productivity suite built as a pnpm monorepo with React, Radix UI, and Radix Themes. Features a crisp, professional interface designed for optimal user experience.

## 📦 Applications

| App | Description | Port |
|-----|-------------|------|
| **📝 Word** | Rich text editor with TipTap, formatting toolbar, and document management | 3001 |
| **📊 Sheet** | Spreadsheet with formula engine, cell formatting, and multi-sheet support | 3002 |
| **📽️ Slides** | Presentation builder with canvas editor and presentation mode | 3003 |
| **☁️ Drive** | File storage system with upload, folders, and grid/list views | 3004 |

## ✨ Features

- **Modern Enterprise UI** - Clean, professional design with Radix Themes
- **Radix UI Primitives** - Accessible, unstyled component primitives
- **Radix Themes** - Beautiful, consistent theming system
- **Zustand State Management** - Lightweight, powerful state management
- **Responsive Design** - Works across desktop and tablet devices
- **Radix Icons** - Comprehensive icon library

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

```bash
# Install dependencies
pnpm install

# Start all apps in development mode
pnpm dev

# Or start individual apps
pnpm --filter @office/word dev    # Start Word on port 3001
pnpm --filter @office/sheet dev   # Start Sheet on port 3002
pnpm --filter @office/slides dev  # Start Slides on port 3003
pnpm --filter @office/drive dev   # Start Drive on port 3004
```

### Building for Production

```bash
# Build all apps
pnpm build

# Build individual apps
pnpm --filter @office/word build
pnpm --filter @office/sheet build
pnpm --filter @office/slides build
pnpm --filter @office/drive build
```

## 📁 Project Structure

```
.
├── apps/
│   ├── word/              # Rich text editor (TipTap)
│   │   └── src/
│   │       ├── components/    # WordApp, Toolbar
│   │       └── store/         # Zustand word store
│   ├── sheet/             # Spreadsheet application
│   │   └── src/
│   │       ├── components/    # SheetApp, Grid, FormulaBar
│   │       └── store/         # Zustand sheet store
│   ├── slides/            # Presentation builder
│   │   └── src/
│   │       ├── components/    # SlidesApp, Canvas, SlidePanel
│   │       └── store/         # Zustand slides store
│   └── drive/             # File storage system
│       └── src/
│           ├── components/    # DriveApp, FileGrid, Sidebar
│           └── store/         # Zustand drive store
├── packages/
│   ├── core/              # Shared stores, types, utilities
│   │   └── src/
│   │       ├── stores/        # userStore, settingsStore, notificationStore
│   │       ├── types/         # Shared TypeScript types
│   │       ├── utils/         # Common utilities
│   │       └── hooks/         # Shared React hooks
│   └── ui/                # Shared UI components
│       └── src/
│           ├── components/    # Button, Modal, Dropdown, etc.
│           ├── hooks/         # UI-specific hooks
│           ├── theme/         # Radix Themes provider
│           └── utils/         # UI utilities (cn, etc.)
├── package.json           # Root package.json
└── pnpm-workspace.yaml    # pnpm workspace config
```

## 🎨 Design System

Each application features:
- **Radix Themes** with app-specific accent colors
- **Consistent toolbar styling** with Office-like ribbon interface
- **Modern card layouts** with subtle shadows
- **Responsive navigation** sidebars
- **Accessible components** with keyboard navigation

Color scheme per app:
- **Word** - Blue accent (`accentColor="blue"`)
- **Sheet** - Green accent (`accentColor="green"`)
- **Slides** - Orange accent (`accentColor="orange"`)
- **Drive** - Blue accent (`accentColor="blue"`)

## 🔧 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Radix UI** - Accessible component primitives
- **Radix Themes** - Theming and styled components
- **Radix Icons** - Icon library
- **Zustand** - State management
- **TipTap** - Rich text editor (Word app)
- **hot-formula-parser** - Formula engine (Sheet app)
- **pnpm** - Fast, disk space efficient package manager

## 📚 Key Dependencies

| Package | Purpose |
|---------|---------|
| `@radix-ui/themes` | Styled component library |
| `@radix-ui/react-*` | Accessible UI primitives |
| `@radix-ui/react-icons` | Icon library |
| `zustand` | State management |
| `@tiptap/react` | Rich text editor |
| `hot-formula-parser` | Spreadsheet formulas |

## 🔒 Security

- Formula evaluation in Sheet uses `hot-formula-parser` for safe formula execution
- No use of `eval()` or `Function()` constructors

## 📄 License

MIT
