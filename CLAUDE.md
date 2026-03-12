# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pisces Starmap — an interactive pixel-art birthday gift web game for Vivi (Pisces, March 14). The player clicks glowing stars on a dark sky canvas to unlock 5 constellations, each revealing a personalized message. Hosted on GitHub Pages.

## Tech Stack & Constraints

- **Pure vanilla HTML, CSS, JavaScript** — no frameworks, no build tools, no package manager
- Renders on an HTML `<canvas>` element
- Uses "Press Start 2P" font from Google Fonts (only external dependency)
- Must work by opening `index.html` directly in a browser — no server or build step
- All asset paths must be relative (GitHub Pages deployment)
- Mobile responsive; tap targets must be at least 44x44px

## Project Structure

```
index.html    — entry point, loads style.css and game.js
style.css     — styling, animations (twinkle, CRT scanline overlay, typewriter, glow)
game.js       — all game logic, canvas rendering, state management
README.md     — deployment instructions
```

## Architecture

The game flows through sequential screens: **Title Screen → Starmap → Ending Screen**.

### Core game loop (game.js):
1. **Title screen** with fade transition to starmap on click
2. **Starmap canvas** — 5 constellations (Pisces/5 stars, Lyra/5, Vela/6, Corona Borealis/5, Canis Minor/4 = 25 total stars)
3. Stars glow on hover; clicking selects them. When all stars in a constellation are selected, connecting lines animate with a glow effect
4. **Message card overlay** appears per completed constellation (pixel border, typewriter text, click-to-continue)
5. **Progress bar** tracks completed constellations
6. **Ending screen** triggers when all 5 constellations are unlocked and the last message card is dismissed

### Design tokens:
- Background: `#0a0a1a` (deep navy)
- Star/accent color: `#FFD700` (gold)
- Font: "Press Start 2P"
- CRT scanline overlay via CSS pseudo-element

## Implementation Sequence

The blueprint (`gemini-starmap-blueprint.md`) defines 5 sequential prompts to build the project incrementally:
1. Scaffold & visual setup (HTML/CSS/canvas structure, stars, CRT overlay)
2. Constellation data & star selection logic
3. Message card overlays with typewriter effect
4. Title screen & ending screen
5. Polish, mobile optimization, GitHub Pages prep

## Deployment

Push to GitHub → Settings → Pages → Deploy from `main` branch root. No build step needed.
