# 🏢 Mini Office Web Suite

A modern, React-based office suite built as a pnpm monorepo with DaisyUI components. This project includes four core web applications that provide essential office productivity tools.

## 📦 Applications

| App | Description | Port |
|-----|-------------|------|
| **📝 Word** | Rich text editor with formatting tools | 3001 |
| **📊 Sheet** | Spreadsheet with formula support (SUM, AVERAGE) | 3002 |
| **📽️ Slides** | Slide builder with drag-and-drop elements | 3003 |
| **☁️ Drive** | File storage system with upload/download | 3004 |

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
pnpm dev:word    # Start Word on port 3001
pnpm dev:sheet   # Start Sheet on port 3002
pnpm dev:slides  # Start Slides on port 3003
pnpm dev:drive   # Start Drive on port 3004
```

### Building for Production

```bash
# Build all apps
pnpm build

# Build individual apps
pnpm build:word
pnpm build:sheet
pnpm build:slides
pnpm build:drive
```

## 📁 Project Structure

```
.
├── apps/
│   ├── word/              # Rich text editor
│   ├── sheet/             # Spreadsheet application
│   ├── slides/            # Presentation builder
│   └── drive/             # File storage system
├── packages/
│   └── ui/                # Shared UI components
├── package.json           # Root package.json
└── pnpm-workspace.yaml    # pnpm workspace config
```

## 🎨 Shared UI Package

The `@office/ui` package contains reusable components used across all applications:

- **Button** - Styled buttons with variants (primary, secondary, ghost)
- **Card** - Container component with optional title
- **Toolbar** - Horizontal toolbar with buttons and dividers
- **Sidebar** - Vertical sidebar with navigation items
- **Layout** - Page layout with header and sidebar support

## 🔧 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Tailwind CSS component library
- **pnpm** - Fast, disk space efficient package manager

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.