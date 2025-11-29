# 🏢 Office Web Suite

A modern, enterprise-level office productivity suite built as a pnpm monorepo with React and DaisyUI v5. Features a crisp, professional interface designed for optimal user experience.

## 📦 Applications

| App | Description | Port |
|-----|-------------|------|
| **📝 Word** | Rich text editor with formatting tools, font selection, and alignment | 3001 |
| **📊 Sheet** | Spreadsheet with formula support (SUM, AVERAGE, arithmetic) | 3002 |
| **📽️ Slides** | Presentation builder with drag-and-drop elements | 3003 |
| **☁️ Drive** | File storage system with upload, folders, and grid/list views | 3004 |

## ✨ Features

- **Modern Enterprise UI** - Clean, professional design with consistent styling
- **DaisyUI v5** - Latest component library with Tailwind CSS v4
- **Responsive Design** - Works across desktop and tablet devices
- **Gradient Headers** - Each app has a distinct color identity
- **SVG Icons** - Crisp, scalable icons throughout the interface

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

## 🎨 Design System

Each application features:
- **Gradient header bars** with app-specific colors
- **Consistent toolbar styling** with grouped buttons
- **Modern card layouts** with subtle shadows
- **Responsive navigation** sidebars

Color scheme per app:
- **Word** - Primary blue gradient
- **Sheet** - Success green gradient  
- **Slides** - Warning orange gradient
- **Drive** - Info cyan gradient

## 🔧 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool with Tailwind CSS v4 plugin
- **Tailwind CSS v4** - Utility-first CSS framework
- **DaisyUI v5** - Modern component library
- **pnpm** - Fast, disk space efficient package manager

## 🔒 Security

- Formula evaluation in Sheet uses a custom recursive descent parser instead of `eval()` to prevent code injection

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.