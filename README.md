# CosmicMindmap

A mindmapping tool that allows you to think in outer space. Built with React, TypeScript, and Three.js.

## Features

- 🌌 Interactive cosmos background with distant starfield
- 📝 Click anywhere to create notes
- 🔗 Drag from notes to create connections
- ⌨️ Press Enter to edit notes
- 🖱️ Subtle mouse parallax effect for depth

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
npm install
```

### Development

Run the development server with hot reload:

```bash
npm run dev
```

The app will open at http://localhost:3000

### Building

Build the TypeScript project:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

### Testing

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run tests with UI:

```bash
npm run test:ui
```

### Linting

Check for linting errors:

```bash
npm run lint
```

Fix linting errors automatically:

```bash
npm run lint:fix
```

### Type Checking

Run TypeScript type checking without emitting files:

```bash
npm run type-check
```

## Project Structure

```
CosmicMindmap/
├── src/
│   ├── components/      # React components
│   │   ├── CosmosBackground.tsx  # Three.js starfield
│   │   ├── Note.tsx              # Note component
│   │   └── ArrowCanvas.tsx       # Arrow rendering
│   ├── App.tsx          # Main application
│   ├── main.tsx         # React entry point
│   └── types.ts         # TypeScript types
├── dist/                # Build output (generated)
└── node_modules/        # Dependencies (generated)
```

## How to Use

1. **Create a note**: Click anywhere on the canvas
2. **Edit a note**: Press Enter when a note is selected
3. **Create a connection**: Click and drag from a note to create an arrow
4. **Explore the cosmos**: Move your mouse to see the subtle parallax effect
