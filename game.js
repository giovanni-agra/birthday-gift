/* ==============================================
   PISCES STARMAP — Game Logic
   A pixel-art birthday gift for Vivi
   ============================================== */

(function () {
  'use strict';

  // --- Canvas Setup ---
  const canvas = document.getElementById('starmap');
  const ctx = canvas.getContext('2d');

  // --- DOM References ---
  const titleScreen = document.getElementById('title-screen');
  const progressBar = document.getElementById('progress-bar');
  const messageCard = document.getElementById('message-card');
  const cardTitle = document.getElementById('card-title');
  const cardMessage = document.getElementById('card-message');
  const endingScreen = document.getElementById('ending-screen');
  const endingMessage = endingScreen.querySelector('.ending-message');

  // --- Constants ---
  const GOLD = '#FFD700';
  const GOLD_DIM = '#b8960f';
  const GOLD_GLOW = 'rgba(255, 215, 0, 0.6)';
  const STAR_RADIUS = 5;
  const HIT_RADIUS = 28; // >= 44px diameter for mobile tap targets
  const BG_STAR_COUNT = 120;

  // --- Game State ---
  let gameState = 'title'; // title | playing | message | ending
  let mouseX = -1;
  let mouseY = -1;
  let hoveredStar = null;
  let lineAnimProgress = 0;
  let lineAnimating = false;
  let activeConstellationIndex = -1;
  let backgroundStars = [];
  let dpr = 1;
  let hintVisible = true;

  // --- Constellation Data ---
  // All 5 groups together form the Pisces constellation:
  //   Northern fish (top-left) → upper cord → junction → long cord → circlet (right)
  //                                            junction → lower fish V-shape (bottom-left)
  // Positions are fractions of canvas width/height (0-1).
  const constellations = [
    {
      name: 'Pisces',
      title: 'Pisces ✦ The Fish — Your Sign',
      message: "You are an amazing empath. You're able to understand the other point of view and try to see the best in others.",
      // The Circlet — ring of stars, upper-right
      stars: [
        { rx: 0.70, ry: 0.28 },
        { rx: 0.80, ry: 0.22 },
        { rx: 0.88, ry: 0.30 },
        { rx: 0.84, ry: 0.40 },
        { rx: 0.72, ry: 0.40 },
      ],
      connections: [[0,1],[1,2],[2,3],[3,4],[4,0]],
      completed: false,
      selectedStars: [],
    },
    {
      name: 'Lyra',
      title: 'Lyra ✦ The Lyre',
      message: "You have this way of making people feel like they know you by just how social, caring, and adaptive.",
      // The Cord — long line from junction to circlet
      stars: [
        { rx: 0.30, ry: 0.52 },
        { rx: 0.40, ry: 0.48 },
        { rx: 0.50, ry: 0.44 },
        { rx: 0.58, ry: 0.40 },
        { rx: 0.64, ry: 0.36 },
      ],
      connections: [[0,1],[1,2],[2,3],[3,4]],
      completed: false,
      selectedStars: [],
    },
    {
      name: 'Vela',
      title: 'Vela ✦ The Sails',
      message: "You've been through so much the past year. But you persevered, and I know that God is rewarding that level of resilience with blessings that continuously pour everyday.",
      // The Lower Fish — V/fork shape, bottom-left
      stars: [
        { rx: 0.26, ry: 0.58 },
        { rx: 0.20, ry: 0.66 },
        { rx: 0.14, ry: 0.74 },
        { rx: 0.34, ry: 0.66 },
        { rx: 0.40, ry: 0.74 },
        { rx: 0.44, ry: 0.82 },
      ],
      connections: [[0,1],[1,2],[0,3],[3,4],[4,5]],
      completed: false,
      selectedStars: [],
    },
    {
      name: 'Corona Borealis',
      title: 'Corona ✦ The Crown',
      message: "You are an amazing person. You are loved and cared for by everyone that knows you. From back in AIIAS, all the way to Manjo and District M \u263a\ufe0f",
      // The Upper Cord — line from junction up to northern fish
      stars: [
        { rx: 0.24, ry: 0.44 },
        { rx: 0.22, ry: 0.36 },
        { rx: 0.18, ry: 0.30 },
        { rx: 0.16, ry: 0.24 },
        { rx: 0.18, ry: 0.17 },
      ],
      connections: [[0,1],[1,2],[2,3],[3,4]],
      completed: false,
      selectedStars: [],
    },
    {
      name: 'Canis Minor',
      title: 'Canis Minor ✦ The Little Star',
      message: "Every star on this map was placed here for you because you are THE star hehehe. It's your birthday so keep that shine ON!!!!!",
      // The Northern Fish — small diamond, top-left
      stars: [
        { rx: 0.15, ry: 0.08 },
        { rx: 0.09, ry: 0.13 },
        { rx: 0.15, ry: 0.18 },
        { rx: 0.21, ry: 0.12 },
      ],
      connections: [[0,1],[1,2],[2,3],[3,0]],
      completed: false,
      selectedStars: [],
    },
  ];

  // Bridge lines connecting adjacent groups into the full Pisces shape.
  // Each bridge draws when both its constellations are completed.
  const bridges = [
    { fromGroup: 0, fromStar: 4, toGroup: 1, toStar: 4 }, // Circlet → Cord
    { fromGroup: 1, fromStar: 0, toGroup: 2, toStar: 0 }, // Cord → Lower Fish
    { fromGroup: 1, fromStar: 0, toGroup: 3, toStar: 0 }, // Cord → Upper Cord
    { fromGroup: 3, fromStar: 4, toGroup: 4, toStar: 2 }, // Upper Cord → Northern Fish
  ];

  const ENDING_MESSAGE = "Happiest birthday Viviii!!! May this year's birthday be the beginning of amazing birthdays that are to come! You are such a strong, kind, courageous lady. And I could never be more proud of you in all that you've doonnee! Thank you for being with me and I pray that you had an amazing birthday!!! \ud83d\udc96\ud83d\udc96\ud83d\udc96\ud83e\udd73\ud83e\udd73\ud83e\udd73\ud83c\udf81\ud83c\udf81\ud83c\udf81";

  // --- Utility ---
  function resizeCanvas() {
    dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function generateBackgroundStars() {
    backgroundStars = [];
    for (let i = 0; i < BG_STAR_COUNT; i++) {
      backgroundStars.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 1.8 + 0.5,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }
  }

  function getStarPos(star) {
    return {
      x: star.rx * window.innerWidth,
      y: star.ry * window.innerHeight,
    };
  }

  function dist(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  // --- Drawing ---
  function drawBackgroundStars(time) {
    for (const s of backgroundStars) {
      const alpha = 0.3 + 0.4 * Math.sin(time * s.twinkleSpeed + s.twinkleOffset);
      ctx.fillStyle = `rgba(240, 230, 211, ${alpha})`;
      ctx.fillRect(
        s.x * window.innerWidth,
        s.y * window.innerHeight,
        s.size,
        s.size
      );
    }
  }

  function drawStar(x, y, radius, selected, hovered) {
    ctx.save();
    if (selected) {
      // Bright selected star with glow
      ctx.shadowColor = GOLD;
      ctx.shadowBlur = 18;
      ctx.fillStyle = GOLD;
      ctx.beginPath();
      ctx.arc(x, y, radius * 1.5, 0, Math.PI * 2);
      ctx.fill();
      // Inner bright core
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.6, 0, Math.PI * 2);
      ctx.fill();
    } else if (hovered) {
      // Hover glow
      ctx.shadowColor = GOLD;
      ctx.shadowBlur = 14;
      ctx.fillStyle = GOLD;
      ctx.beginPath();
      ctx.arc(x, y, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Normal gold star
      ctx.shadowColor = GOLD_GLOW;
      ctx.shadowBlur = 6;
      ctx.fillStyle = GOLD_DIM;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawConnectionLine(x1, y1, x2, y2, progress) {
    ctx.save();
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 2;
    ctx.shadowColor = GOLD;
    ctx.shadowBlur = 10;
    ctx.globalAlpha = 0.8;

    const ex = x1 + (x2 - x1) * progress;
    const ey = y1 + (y2 - y1) * progress;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(ex, ey);
    ctx.stroke();
    ctx.restore();
  }

  function drawConstellationLabel(constellation) {
    // Find center of constellation stars
    let cx = 0, cy = 0;
    for (const star of constellation.stars) {
      const pos = getStarPos(star);
      cx += pos.x;
      cy += pos.y;
    }
    cx /= constellation.stars.length;
    cy /= constellation.stars.length;

    ctx.save();
    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = GOLD;
    ctx.globalAlpha = 0.6;
    ctx.textAlign = 'center';
    ctx.fillText(constellation.name, cx, cy + 35);
    ctx.restore();
  }

  // --- Rendering Loop ---
  function render(time) {
    if (gameState === 'title' || gameState === 'ending') {
      requestAnimationFrame(render);
      return;
    }

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Background stars
    drawBackgroundStars(time);

    // Constellation stars and connections
    hoveredStar = null;
    for (const c of constellations) {
      // Draw completed connections
      if (c.completed) {
        for (const [i, j] of c.connections) {
          const p1 = getStarPos(c.stars[i]);
          const p2 = getStarPos(c.stars[j]);
          drawConnectionLine(p1.x, p1.y, p2.x, p2.y, 1);
        }
        drawConstellationLabel(c);
      }
    }

    // Draw bridge lines between completed adjacent groups
    for (const b of bridges) {
      if (constellations[b.fromGroup].completed && constellations[b.toGroup].completed) {
        const p1 = getStarPos(constellations[b.fromGroup].stars[b.fromStar]);
        const p2 = getStarPos(constellations[b.toGroup].stars[b.toStar]);
        drawConnectionLine(p1.x, p1.y, p2.x, p2.y, 1);
      }
    }

    for (const c of constellations) {

      // Draw animating connections
      if (lineAnimating && c === constellations[activeConstellationIndex]) {
        for (const [i, j] of c.connections) {
          const p1 = getStarPos(c.stars[i]);
          const p2 = getStarPos(c.stars[j]);
          drawConnectionLine(p1.x, p1.y, p2.x, p2.y, Math.min(lineAnimProgress, 1));
        }
      }

      // Draw stars
      for (let si = 0; si < c.stars.length; si++) {
        const pos = getStarPos(c.stars[si]);
        const selected = c.selectedStars.includes(si) || c.completed;
        const d = dist(mouseX, mouseY, pos.x, pos.y);
        const isHovered = d < HIT_RADIUS && gameState === 'playing' && !c.completed && !lineAnimating;

        if (isHovered && !hoveredStar) {
          hoveredStar = { constellation: c, starIndex: si };
        }

        drawStar(pos.x, pos.y, STAR_RADIUS, selected, isHovered);
      }
    }

    // Line animation
    if (lineAnimating) {
      lineAnimProgress += 0.025;
      if (lineAnimProgress >= 1) {
        lineAnimating = false;
        lineAnimProgress = 0;
        constellations[activeConstellationIndex].completed = true;
        updateProgressBar();
        showMessageCard(activeConstellationIndex);
      }
    }

    // Hint text
    if (hintVisible && !lineAnimating) {
      ctx.save();
      ctx.font = '9px "Press Start 2P"';
      ctx.fillStyle = GOLD_DIM;
      ctx.globalAlpha = 0.5;
      ctx.textAlign = 'center';
      ctx.fillText('Tap the stars to form constellations', window.innerWidth / 2, window.innerHeight - 30);
      ctx.restore();
    }

    // Cursor style
    canvas.style.cursor = hoveredStar ? 'pointer' : 'default';

    requestAnimationFrame(render);
  }

  // --- Progress Bar ---
  function updateProgressBar() {
    const segments = progressBar.querySelectorAll('.progress-segment');
    for (let i = 0; i < constellations.length; i++) {
      if (constellations[i].completed) {
        segments[i].classList.add('filled');
      }
    }
  }

  function allConstellationsComplete() {
    return constellations.every(c => c.completed);
  }

  // --- Message Card ---
  function showMessageCard(index) {
    const c = constellations[index];
    gameState = 'message';
    cardTitle.textContent = c.title;
    cardMessage.textContent = '';
    messageCard.classList.remove('hidden');

    // Typewriter effect
    let charIndex = 0;
    const text = c.message;
    function typeNext() {
      if (charIndex < text.length) {
        cardMessage.textContent += text[charIndex];
        charIndex++;
        setTimeout(typeNext, 35);
      }
    }
    typeNext();
  }

  function dismissMessageCard() {
    messageCard.classList.add('hidden');
    activeConstellationIndex = -1;

    if (allConstellationsComplete()) {
      setTimeout(showEnding, 600);
    } else {
      gameState = 'playing';
    }
  }

  // --- Title Screen ---
  function startGame() {
    if (gameState !== 'title') return;
    titleScreen.classList.add('fade-out');
    setTimeout(() => {
      titleScreen.style.display = 'none';
      progressBar.classList.add('visible');
      gameState = 'playing';
    }, 800);
  }

  // --- Ending Screen ---
  function showEnding() {
    gameState = 'ending';
    endingScreen.classList.remove('hidden');

    // Typewriter for ending message
    let charIndex = 0;
    function typeNext() {
      if (charIndex < ENDING_MESSAGE.length) {
        endingMessage.textContent += ENDING_MESSAGE[charIndex];
        charIndex++;
        setTimeout(typeNext, 30);
      }
    }
    setTimeout(typeNext, 1500);

    // Spawn floating stars
    spawnFloatingStars();
  }

  function spawnFloatingStars() {
    const container = endingScreen;
    function createStar() {
      const star = document.createElement('div');
      star.className = 'floating-star';
      star.textContent = '✦';
      star.style.left = Math.random() * 100 + '%';
      star.style.bottom = '-20px';
      star.style.animationDuration = (Math.random() * 4 + 4) + 's';
      star.style.animationDelay = Math.random() * 2 + 's';
      star.style.opacity = Math.random() * 0.5 + 0.3;
      star.style.fontSize = (Math.random() * 10 + 8) + 'px';
      container.appendChild(star);
      star.addEventListener('animationend', () => star.remove());
    }
    // Initial burst
    for (let i = 0; i < 15; i++) {
      createStar();
    }
    // Continuous
    setInterval(createStar, 600);
  }

  // --- Star Click Logic ---
  function handleStarClick(x, y) {
    if (gameState !== 'playing' || lineAnimating) return;

    for (const c of constellations) {
      if (c.completed) continue;
      for (let si = 0; si < c.stars.length; si++) {
        if (c.selectedStars.includes(si)) continue;
        const pos = getStarPos(c.stars[si]);
        if (dist(x, y, pos.x, pos.y) < HIT_RADIUS) {
          c.selectedStars.push(si);
          hintVisible = false;

          // Check if constellation is complete
          if (c.selectedStars.length === c.stars.length) {
            activeConstellationIndex = constellations.indexOf(c);
            lineAnimating = true;
            lineAnimProgress = 0;
          }
          return; // Only select one star per click
        }
      }
    }
  }

  // --- Event Listeners ---
  function getEventPos(e) {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  }

  titleScreen.addEventListener('click', startGame);

  canvas.addEventListener('click', function (e) {
    const pos = getEventPos(e);
    handleStarClick(pos.x, pos.y);
  });

  canvas.addEventListener('touchstart', function (e) {
    e.preventDefault();
    if (gameState !== 'playing') return;
    const pos = getEventPos(e);
    handleStarClick(pos.x, pos.y);
  }, { passive: false });

  canvas.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  messageCard.addEventListener('click', function () {
    if (gameState === 'message') {
      dismissMessageCard();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      if (gameState === 'title') startGame();
      else if (gameState === 'message') dismissMessageCard();
    }
  });

  window.addEventListener('resize', resizeCanvas);

  // --- Init ---
  resizeCanvas();
  generateBackgroundStars();
  requestAnimationFrame(render);
})();
