/*********************/
/* Black Hole Effect */
/*********************/

// SETTINGS
const RADIUS = 150;
const STRENGTH = 150;
const SWIRL_STRENGTH = 15;
const EVENT_HORIZON = 10;

// Toggle
const toggle = document.getElementById("blackhole-toggle");
let enabled = false;

// Select ALL paragraphs
const paragraphs = document.querySelectorAll(".warpable-text");

// Store all word elements
let words = [];

// 🔤 Convert paragraphs into WORD spans (ACCESSIBLE)
paragraphs.forEach((paragraph) => {
  const text = paragraph.innerText.trim();

  // Accessibility
  paragraph.setAttribute("aria-label", text);
  paragraph.setAttribute("role", "text");

  // Clear content
  paragraph.innerHTML = "";

  const wordList = text.split(" ");

  wordList.forEach((word, i) => {
    const span = document.createElement("span");
    span.className = "word";

    span.textContent = word;

    paragraph.appendChild(span);

    // Add space between words
    if (i < wordList.length - 1) {
      paragraph.appendChild(document.createTextNode(" "));
    }
  });
});

// Toggle behavior
toggle?.addEventListener("change", () => {
  enabled = toggle.checked;

  if (!enabled) {
    words.forEach(el => {
      el.style.transform = "translate(0px, 0px) scale(1)";
      el.style.opacity = 1;
    });
  }
});

// Cache positions
let basePositions = [];

function cachePositions() {
  words = Array.from(document.querySelectorAll(".word"));

  basePositions = words.map(word => {
    const rect = word.getBoundingClientRect();

    return {
      el: word,
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  });
}

// Initial cache
setTimeout(cachePositions, 100);

// Recalculate on resize
window.addEventListener("resize", () => {
  setTimeout(cachePositions, 100);
});

// Recalculate on scroll (important!)
window.addEventListener("scroll", () => {
  cachePositions();
});

// Mouse tracking
let mouse = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2
};

document.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Animation loop
function animate() {
  basePositions.forEach(obj => {
    const { el, x, y } = obj;

    let dx = mouse.x - x;
    let dy = mouse.y - y;

    let dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;

    if (enabled && dist < RADIUS) {
      let force = STRENGTH * Math.exp(-dist / 120);

      let angle = Math.atan2(dy, dx);
      let swirl = SWIRL_STRENGTH * Math.exp(-dist / 150);

      let sx = Math.cos(angle + swirl);
      let sy = Math.sin(angle + swirl);

      let tx = sx * force;
      let ty = sy * force;

      let scale = 1 - (RADIUS - dist) / RADIUS * 0.7;

      let opacity = dist < EVENT_HORIZON ? dist / EVENT_HORIZON : 1;

      el.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
      el.style.opacity = opacity;

    } else {
      el.style.transform = `translate(0px, 0px) scale(1)`;
      el.style.opacity = 1;
    }
  });

  requestAnimationFrame(animate);
}

animate();

window.addEventListener("scroll", () => {
  cachePositions();
});


/******************/
/* Cat Easter egg */
/******************/
const img = document.getElementById("cat");

function getRandomDelay() {
  return Math.random() * (30000 - 12000) + 12000;
}

// 🎯 Random vertical position
function setRandomHeight() {
  const viewportHeight = window.innerHeight;

  // Keep it within visible area (with margins)
  const min = viewportHeight * 0.2;
  const max = viewportHeight * 0.8;

  const randomY = Math.random() * (max - min) + min;

  img.style.top = `${randomY}px`;
}

const catAnimationDuration = 6000; // 6 seconds

function triggerAnimation() {
  img.classList.remove("animate");

  // Stop previous audio (if running)
  fadeOut(500);

  setRandomHeight();

  void img.offsetWidth;

  img.classList.add("animate");

  // Start sound (slightly quieter)
  fadeIn(1000);

  // Fade out BEFORE it reaches the end
  setTimeout(() => {
    fadeOut(1000);
  }, catAnimationDuration - 1000);

  setTimeout(triggerAnimation, getRandomDelay());
}

// Start
setTimeout(triggerAnimation, getRandomDelay());

// https://www.youtube.com/watch?v=2yJgwwDcgV8&t=10s
const audio = new Audio("sfx/cat.mp3"); // replace with your file
audio.loop = true;

let audioCtx = null;
let gainNode = null;

function initAudio() {
  if (audioCtx) return;

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioCtx.createMediaElementSource(audio);

  gainNode = audioCtx.createGain();
  gainNode.gain.value = 0; // start silent

  source.connect(gainNode);
  gainNode.connect(audioCtx.destination);
}

function fadeIn(duration = 2000) {
  initAudio();
  audio.play();

  const start = audioCtx.currentTime;
  gainNode.gain.setValueAtTime(0, start);
  gainNode.gain.linearRampToValueAtTime(.01, start + duration / 1000);
}

function fadeOut(duration = 2000) {
  if (!audioCtx) return;

  const start = audioCtx.currentTime;
  gainNode.gain.setValueAtTime(gainNode.gain.value, start);
  gainNode.gain.linearRampToValueAtTime(0, start + duration / 1000);

  setTimeout(() => {
    audio.pause();
    audio.currentTime = 0;
  }, duration);
}


/**************/
/* UFO Banner */
/**************/
const container = document.querySelector(".ufo-with-banner");

function setRandomY() {
  const min = 100;
  const max = window.innerHeight - 100;

  const randomY = Math.random() * (max - min) + min;
  container.style.top = `${randomY}px`;
}

function restartAnimation() {
  // Remove animation class
  container.classList.remove("ufo-animate");

  // Force reflow (important)
  void container.offsetWidth;

  // Set new random vertical position BEFORE restarting
  setRandomY();

  // Re-add animation class
  container.classList.add("ufo-animate");
}

// Initial run
restartAnimation();

// Repeat every 40 seconds (or 20 if you want continuous looping)
setInterval(restartAnimation, 40000);