# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A cosmic mindmap web application built with React, TypeScript, and Three.js. Users can create interconnected notes on a canvas with an interactive cosmos background that responds to mouse movement.

## Development Commands

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev          # Run Vite dev server with hot reload on port 3000
```

### Building
```bash
npm run build        # TypeScript compilation + Vite build
npm run preview      # Preview production build locally
```

### Testing
```bash
npm test             # Run tests once
npm run test:watch   # Run tests in watch mode
npm run test:ui      # Open Vitest UI
```

**Running a single test file:**
```bash
npx vitest path/to/file.test.ts
```

### Code Quality
```bash
npm run lint         # Check for linting errors
npm run lint:fix     # Auto-fix linting errors
npm run type-check   # Run TypeScript compiler without emitting files
```

## Architecture

### Key Concepts

**Mindmap Interaction Model:**
- Single click on canvas → Creates a new note at cursor position
- Drag from a note → Creates an arrow connection
- Release drag → Creates a second note at release position, connected by arrow
- Double-click on note → Edit note text
- Mouse movement → Swirls the cosmos background

### Directory Structure
- `src/`
  - `components/` - React components
    - `CosmosBackground.tsx` - Three.js animated cosmos with particles and galaxy
    - `Note.tsx` - Individual note component with editing and drag capabilities
    - `ArrowCanvas.tsx` - Canvas-based arrow rendering system
  - `App.tsx` - Main application orchestrating all interactions
  - `main.tsx` - React entry point
  - `types.ts` - TypeScript type definitions for Note and Arrow

### Component Architecture

**App.tsx** - Central state management
- Manages notes array, arrows array, mouse position, and drag state
- Coordinates interactions between cosmos, notes, and arrows
- Handles click-to-create and drag-to-connect logic

**CosmosBackground.tsx** - Three.js scene
- Creates particle-based star field (5000 stars)
- Generates spiral galaxy effect (3000 particles)
- Responds to mouse position via normalized coordinates (-1 to 1)
- Applies smooth interpolation for swirling effect

**Note.tsx** - Interactive note cards
- Editable text with double-click activation
- Drag initiation for creating arrows
- Visual states: selected, editing, normal
- Glassmorphic purple/blue gradient styling

**ArrowCanvas.tsx** - SVG/Canvas arrow renderer
- Draws arrows between connected notes
- Shows temporary dashed arrow during drag
- Arrowhead rendering with glow effects
- Updates on note position changes

### State Flow

1. **Creating Notes**: Click → App creates note → Renders in absolute position
2. **Creating Connections**: MouseDown on note → DragState active → MouseMove updates temp arrow → MouseUp creates new note + arrow
3. **Cosmos Effect**: MouseMove → Normalized coordinates → CosmosBackground rotates galaxy/stars

### TypeScript Configuration
- Module system: ESNext with bundler resolution (Vite)
- JSX: react-jsx transform
- Target: ES2022
- Strict type checking enabled
- DOM and DOM.Iterable libs included

### Styling Approach
- Inline styles with React (no CSS files)
- Glassmorphic effects: backdrop-filter, rgba backgrounds
- Cosmic color palette: purples, blues, whites
- Responsive to viewport dimensions
