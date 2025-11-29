# 🏢 Mini Office Web Suite

A modern, React-based office suite built as a pnpm monorepo. This project includes four core web applications that provide essential office productivity tools.

## 📦 Applications

| App | Description | Port |
|-----|-------------|------|
| **📝 Mini Word** | Rich text editor with formatting tools | 3001 |
| **📊 Mini Excel** | Spreadsheet with formula support (SUM, AVERAGE) | 3002 |
| **📽️ Mini PowerPoint** | Slide builder with drag-and-drop elements | 3003 |
| **☁️ Mini OneDrive** | File storage system with upload/download | 3004 |

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
pnpm dev:word       # Start Mini Word on port 3001
pnpm dev:excel      # Start Mini Excel on port 3002
pnpm dev:powerpoint # Start Mini PowerPoint on port 3003
pnpm dev:onedrive   # Start Mini OneDrive on port 3004
```

### Building for Production

```bash
# Build all apps
pnpm build

# Build individual apps
pnpm build:word
pnpm build:excel
pnpm build:powerpoint
pnpm build:onedrive
```

## 📁 Project Structure

```
.
├── apps/
│   ├── mini-word/         # Rich text editor
│   ├── mini-excel/        # Spreadsheet application
│   ├── mini-powerpoint/   # Presentation builder
│   └── mini-onedrive/     # File storage system
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
- **pnpm** - Fast, disk space efficient package manager

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.