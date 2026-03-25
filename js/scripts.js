// Blackhole effect is gemaakt met ChatGPT, waardes zijn zelf ingevoerd
// Prompt: Could you create a fish eye lens?
// Prompt 2 :Could you make it look more like it gets sucked up like a blackhole, the blackhole being the mouse. I am kind of aiming for a fish lens kind of effect
// Daarna waren nog meerdere prompts om te tweaken

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

// Convert paragraphs into WORD spans 
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

// Random vertical position
function setRandomHeight() {
  const viewportHeight = window.innerHeight;

  const min = viewportHeight * 0.2;
  const max = viewportHeight * 0.8;

  const randomY = Math.random() * (max - min) + min;

  img.style.top = `${randomY}px`;
}

const catAnimationDuration = 6000; // 6 seconds

// Cat Audio
let audioCtx;
let audio;
let gainNode;

function initAudio() {
  if (audioCtx) return;

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

// Start sound with fade in
function startSound() {
  initAudio();

  audio = new Audio("sfx/cat.mp3");
  audio.loop = false;

  const source = audioCtx.createMediaElementSource(audio);

  gainNode = audioCtx.createGain();
  gainNode.gain.value = 0;

  source.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  audio.play().catch(() => {});

  const now = audioCtx.currentTime;

  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.01, now + 1);
}

// Fade out + stop + reset
function stopSound() {
  if (!audioCtx || !audio) return;

  const now = audioCtx.currentTime;

  gainNode.gain.cancelScheduledValues(now);
  gainNode.gain.setValueAtTime(gainNode.gain.value, now);
  gainNode.gain.linearRampToValueAtTime(0, now + 0.5);

  setTimeout(() => {
    audio.pause();
    audio.currentTime = 0;
    audio = null;
  }, 500);
}

function triggerAnimation() {
  img.classList.remove("animate");

  setRandomHeight();

  // Force reflow
  void img.offsetWidth;

  img.classList.add("animate");

  startSound();

  // Fade out shortly before animation ends
  setTimeout(() => {
    stopSound();
  }, catAnimationDuration - 500);

  // Schedule next run
  setTimeout(triggerAnimation, getRandomDelay());
}

document.addEventListener(
  "click",
  () => {
    initAudio();

    // Unlock audio context
    const unlock = new Audio("sfx/cat.mp3");
    unlock.play().then(() => {
      unlock.pause();
      unlock.currentTime = 0;
    });
  },
  { once: true }
);

setTimeout(triggerAnimation, getRandomDelay());


/*********************/
/* Animatie Typewriter */
/*********************/

// document.addEventListener("DOMContentLoaded", () => {
//   const title = document.querySelector("h1");
//   const text = title.textContent;

//   function typeWriter(text, element, speed = 70) {
//       let i = 0;
//       element.textContent = '';
//       element.style.borderRight = "2px solid white";

//       function typing() {
//           if (i < text.length) {
//               element.textContent += text.charAt(i);
//               i++;
//               setTimeout(typing, speed);
//           } else {
//               element.style.borderRight = "none";
//           }
//       }

//       typing();
//   }

//   typeWriter(text, title, 70);
// });

/***************************/
/* Letter verschijn effect */
/***************************/

function decodeText(){
  const text = document.querySelector('.decode-text');
  const children = text.children;

  let state = [];

  for(let i = 0; i < children.length; i++){
      children[i].classList.remove('state-1','state-2','state-3');
      state[i] = i;
  }

  let shuffled = shuffle(state);

  for(let i = 0; i < shuffled.length; i++){
      let child = children[shuffled[i]];

      let state1Time = Math.random() * 2000 + 50;

      if(child.classList.contains('text-animation')){
          setTimeout(() => firstStages(child), state1Time);
      }
  }
}

function firstStages(child){
  child.classList.add('state-1');
  setTimeout(() => secondStages(child), 100);
}

function secondStages(child){
  child.classList.add('state-2');
  setTimeout(() => thirdStages(child), 100);
}

function thirdStages(child){
  child.classList.add('state-3');
}

function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
          array[randomIndex], array[currentIndex]
      ];
  }

  return array;
}

decodeText();

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