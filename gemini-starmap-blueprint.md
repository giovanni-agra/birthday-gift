# 🌟 Gemini Starmap — Claude Code Blueprint

A pixel art birthday gift web game hosted on GitHub Pages.
The player clicks stars to unlock constellations, each revealing a personal message.

---

## 📁 Project Structure

```
gemini-starmap/
├── index.html
├── style.css
├── game.js
└── README.md
```

---

## 🤖 Claude Code Prompts (Run in Order)

### Prompt 1 — Scaffold & Visual Setup

```
Create a pixel art web game called "Gemini Starmap".
It's a birthday gift — a dark starry night sky (deep navy/black)
where the player clicks on glowing pixel stars to connect constellations.

Requirements:
- Pure HTML, CSS, and vanilla JS (no frameworks)
- Use the "Press Start 2P" font from Google Fonts
- Dark navy background (#0a0a1a)
- Gold/yellow pixel stars (#FFD700) with a subtle CSS twinkle animation
- CRT scanline overlay effect using a CSS pseudo-element
- Stars are rendered on an HTML <canvas> element
- Mobile responsive (works on phone screens too)
- No build step required — must work by opening index.html directly
```

---

### Prompt 2 — Constellations & Star Logic

```
Add 5 constellations to the starmap canvas.
Each constellation has a set of star (x, y) positions and connecting lines.

Constellations:
1. Gemini (the Twins) — 6 stars
2. Lyra (the Lyre) — 5 stars
3. Vela (the Sails) — 6 stars
4. Corona Borealis (the Crown) — 5 stars
5. Canis Minor (the Little Star) — 4 stars

Behavior:
- Stars glow gold when hovered
- Player clicks individual stars to "select" them
- When all stars in a constellation are selected (any order),
  draw the connecting lines with an animated glowing effect
- After lines finish drawing, show a message card for that constellation
- Track which constellations are completed with a pixel-art progress bar at the top
```

---

### Prompt 3 — Message Cards

```
Add pixel-art dialog box message cards that appear after each constellation is unlocked.

Each card should:
- Appear centered on screen as an overlay
- Have a retro pixel border (double-line gold border style)
- Show the constellation name as the title
- Display the message below with a typewriter text effect
- Have a "[ Press Enter / Click to Continue ]" blinking prompt

Messages for each constellation:

Gemini:
Title: "The Twins ✦ Your Sign"
Message: "[FILL IN — something about who she is, her duality, her personality]"

Lyra:
Title: "Lyra ✦ The Lyre"
Message: "[FILL IN — something about her love for music and singing]"

Vela:
Title: "Vela ✦ The Sails"
Message: "[FILL IN — something about her fashion sense and aesthetic]"

Corona Borealis:
Title: "Corona ✦ The Crown"
Message: "[FILL IN — a sincere compliment about her worth]"

Canis Minor:
Title: "Canis Minor ✦ The Little Star"
Message: "[FILL IN — your birthday wish and dedication to her]"
```

> ✏️ **Replace all `[FILL IN — ...]` placeholders with your actual messages before running this prompt.**

---

### Prompt 4 — Title Screen & Ending

```
Add a title screen and a final ending screen.

Title Screen:
- Appears first before the starmap
- Pixel art text: "✦ GEMINI STARMAP ✦"
- Subtitle: "For [Her Name]" (replace with her actual name)
- Blinking prompt: "[ Click anywhere to begin ]"
- Subtle animated stars drifting slowly in background
- Transition to starmap with a fade effect on click

Ending Screen (appears when all 5 constellations are unlocked):
- Full screen dark background with floating pixel stars animation
- Large pixel text: "Happy Birthday"
- Her name below in gold
- A final short message (1–2 lines) from the sender
- A small pixel art Gemini twins symbol or two stars side by side
- Soft pulsing glow effect on the text
```

---

### Prompt 5 — Polish & GitHub Pages Prep

```
Polish the game and prepare it for GitHub Pages deployment.

Polish:
- Make sure all animations are smooth and consistent
- Add a subtle ambient star shimmer effect in the background (not distracting)
- Ensure tap targets are large enough for mobile (at least 44x44px hit area per star)
- Confirm the CRT scanline overlay doesn't break on small screens
- Test that all 5 constellations can be completed in sequence without bugs

GitHub Pages prep:
- All asset paths must be relative (no absolute paths)
- No server required — must run from index.html with no build step
- Create a README.md with:
  - Project title
  - How to deploy on GitHub Pages (Settings > Pages > Deploy from main branch)
  - A note: "Made with love as a birthday gift 💛"
```

---

## 💌 Message Writing Guide

Since your relationship is warm and close, aim for **sincere over poetic** — say what you actually feel.

| Constellation | Suggested Tone | Example Opener |
|---|---|---|
| Gemini | Reflective, personal | *"You carry two worlds in you effortlessly..."* |
| Lyra | Warm, specific | *"Your voice is one of those things people don't forget..."* |
| Vela | Light, appreciative | *"You make everything you wear look like it was made for you..."* |
| Corona Borealis | Genuine, affirming | *"You deserve every good thing that comes to you..."* |
| Canis Minor | Heartfelt, closing | *"Happy Birthday. I'm really glad you exist."* |

---

## 🚀 GitHub Pages Deployment

1. Push the project folder to a GitHub repo (e.g. `gemini-starmap`)
2. Go to **Settings → Pages**
3. Under **Source**, select `Deploy from a branch`
4. Choose `main` branch → `/ (root)` → Save
5. Your site will be live at:
   `https://[your-username].github.io/gemini-starmap/`

Share that link with her on her birthday. 🎂

---

## ✅ Checklist Before Sharing

- [ ] All 5 message placeholders filled in with real, personal text
- [ ] Her name added to the title screen and ending screen
- [ ] Tested on mobile (open on your phone browser)
- [ ] All 5 constellations complete without errors
- [ ] GitHub Pages link is live and loads correctly
- [ ] You've read through all the messages one more time 💛

---

*Made with Claude Code. A gift built star by star.*
