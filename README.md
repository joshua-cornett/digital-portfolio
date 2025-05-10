# Oortfolio: A 3D, Space-Themed Developer Portfolio Presentation GUI

The Oortfolio is a developer portfolio interface built as a technical and creative alternative to traditional portfolio interfaces. It presents project walkthroughs, developer narratives, and engineering system overviews through an interactive, 3D radial interface called GalaGUI.

Rather than simply listing past work, this interface was designed to structure and guide live presentations. It allows audiences to explore technical projects as modular “nodes,” each anchored in real engineering deliverables.

---

## Purpose

- Present real-world engineering work in an engaging, structured way
- Demonstrate architectural and UI depth through the medium itself
- Deliver a portfolio experience that reflects how I think as both a developer and systems designer

---

## Stack Overview

- **React + Vite** for modular app structure and performance
- **React Three Fiber / Three.js** for interactive 3D rendering
- **Zustand** for state management across canvases and interaction layers
- **React Spring** for animation timing and transitions
- **SCSS Modules** for themeable, maintainable styling

---

## How It Works

### GalaGUI: Radial 3D Presentation Interface

- Built using React Three Fiber and layered canvases
- Designed to orient users in a spatial map of project topics
- Supports mouse, touch, and keyboard input with physics-inspired rotation
- Highlights selected project “nodes” which trigger project slides or interactions

### Node-Based Project Slides (Presentation Mode)

- Each node launches a dedicated slide interface
- Slides walk through key engineering work with code, architecture, and problem breakdowns
- Used for both live interviews and async walkthroughs

---

## Technical Architecture

- **Two-canvas rendering pipeline** separates animation and UI layers
- **Custom interaction abstraction** for pointer, drag, scroll, and touch gestures
- **Decoupled UI state** allows future expansion (game modes, galleries, or docs)
- **Scene organization tools** for 3D node positioning, camera alignment, and label rendering

---

## Development Timeline Highlights

### Phase 1: Structure & Layout

- Refactored default CRA boilerplate into component-driven layout
- Introduced centralized context and hook systems
- Built core presentation routes and dialogue state manager

### Phase 2: Rendering Pipeline & State Management

- Migrated to Vite for performance and dev ergonomics
- Added Zustand to manage global interaction state
- Implemented dual-canvas layout for independent rendering flows

### Phase 3: GalaGUI System

- Created node-based radial 3D GUI with hover and selection math
- Integrated animated feedback, camera-facing labels, and connecting lines
- @TODO: Optimize touch and mobile interactions with gesture normalization

### Phase 4: Presentation Layer

- Part DOS, part space systems, part retro game aesthetic utilizing the GalaGUI system
- @TODO: clean node-to-slide presentation of project deep dives
- @TODO: Modular slide engine that maps directly to real project overviews
- @TODO: UI polish, loading, and input transitions

---

## Archived: Storyfall Prototype

_Storyfall_ was to be an early experiment in gamifying developer narration. If implemented, it will feature a pixel-art mini-game where narration transitions into shootable, falling text—intended as a metaphor for building from ideas into action. The concept was ultimately archived in favor of a more presentation-focused approach, but remains in the codebase as a reminder and baseline for potential future development.

---

## Reflections

> This project became a platform for both storytelling and architecture. While it began as a creative experiment, its direction shifted toward modular clarity and reusable presentation logic. It reflects how I think about frontend systems: not just as visual components, but as structures for guiding interaction, insight, and flow.

---

## Demo Coming Soon

This project will likely be an ongoing iterative development. A live demo is deployed at:

[joshua-cornett.github.io/digital-portfolio](https://joshua-cornett.github.io/digital-portfolio)

---

## 📬 Contact

**Joshua Cornett**  
Seattle, WA  
[joshua.m.cornett@proton.me](mailto:joshua.m.cornett@proton.me)  
[LinkedIn](https://linkedin.com/in/joshua-cornett)  
[Portfolio](https://joshua-cornett.github.io/digital-portfolio)
