// Blackhole effect is gemaakt met ChatGPT, waardes zijn zelf ingevoerd
// Prompt: Could you create a fish eye lens?
// Prompt 2 :Could you make it look more like it gets sucked up like a blackhole, the blackhole being the mouse. I am kind of aiming for a fish lens kind of effect
// Daarna waren nog meerdere prompts om te tweaken

/*********************/
/* Black Hole Effect */
/*********************/

// Instellingen
const RADIUS = 150;
const STRENGTH = 150;
const SWIRL_STRENGTH = 15;
const EVENT_HORIZON = 10;

// Toggle
const toggle = document.getElementById("blackhole-toggle");
let enabled = false;

// Elk warpable text element pakken
const paragraphs = document.querySelectorAll(".warpable-text");

// Originele woorden opslaan
let words = [];

// Elk woord een eigen span maken
paragraphs.forEach((paragraph) => {
  const text = paragraph.innerText.trim();

  // Accesibel maken voor screenreaders zodat niet alles los wordt voorgelezen
  paragraph.setAttribute("aria-label", text);
  paragraph.setAttribute("role", "text");

  // Reset
  paragraph.innerHTML = "";

  const wordList = text.split(" ");

  wordList.forEach((word, i) => {
    const span = document.createElement("span");
    span.className = "word";

    span.textContent = word;

    paragraph.appendChild(span);

    // Afstand tussen woorden creeëren
    if (i < wordList.length - 1) {
      paragraph.appendChild(document.createTextNode(" "));
    }
  });
});

// Toggle functie
toggle?.addEventListener("change", () => {
  enabled = toggle.checked;

  if (!enabled) {
    words.forEach(el => {
      el.style.transform = "translate(0px, 0px) scale(1)";
      el.style.opacity = 1;
    });
  }
});

// Posities onthouden
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

setTimeout(cachePositions, 100);

// Herbereken op resize
window.addEventListener("resize", () => {
  setTimeout(cachePositions, 100);
});

// Rekening houden met scrollen
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

// Animatie loop
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

// Random y positie
function setRandomHeight() {
  const viewportHeight = window.innerHeight;

  const min = viewportHeight * 0.2;
  const max = viewportHeight * 0.8;

  const randomY = Math.random() * (max - min) + min;

  img.style.top = `${randomY}px`;
}

const catAnimationDuration = 6000; // 6 seconden

function triggerAnimation() {
  img.classList.remove("animate");

  fadeOut(500);

  setRandomHeight();

  void img.offsetWidth;

  img.classList.add("animate");

  // Fade in
  fadeIn(1000);

  // Fade out
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
  gainNode.gain.value = 0;

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
  // Animatie class verwijderen
  container.classList.remove("ufo-animate");
  
  void container.offsetWidth;

  // Random Y positie instellen
  setRandomY();

  // Animatie class weer toevoegen
  container.classList.add("ufo-animate");
}

restartAnimation();

setInterval(restartAnimation, 40000);


/*********/
/* Alien */
/*********/

const alienBtn = document.getElementById("alienBtn");
const alienSVG = "images/alien.svg";
const alienCursor = "images/ufo-alien.svg";

alienBtn.addEventListener("change", () => {
  if (alienBtn.checked) {
    document.body.style.cursor = `url(${alienCursor}) 16 16, auto`;
  } else {
    document.body.style.cursor = "auto";
  }
});

// 🎛️ SETTINGS (tweak these easily)
const SETTINGS = {
  spawnRate: 30,        // Tijd tussen spawns
  spawnCount: 1,        // Aliens per spawn
  minSize: 60,
  maxSize: 90,
  minVelocity: 0.5,
  maxVelocity: 1.5,
  minUpward: 1.5,
  maxUpward: 2.5,
  gravity: 0.02,
  life: 300             // Hoe lang de aliens blijven
};

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// track mouse
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

let lastSpawn = 0;

// controlled spawn loop
function spawnLoop(timestamp) {
  if (alienBtn.checked && timestamp - lastSpawn > SETTINGS.spawnRate) {
    for (let i = 0; i < SETTINGS.spawnCount; i++) {
      spawnAlien(mouseX, mouseY);
    }
    lastSpawn = timestamp;
  }

  requestAnimationFrame(spawnLoop);
}

spawnLoop();

function spawnAlien(x, y) {
  const particle = document.createElement("div");
  particle.classList.add("alien-particle");

  const img = document.createElement("img");
  img.src = alienSVG;
  img.style.width = "100%";
  img.style.height = "100%";

  particle.appendChild(img);

  // Grootte
  const size = Math.random() * (SETTINGS.maxSize - SETTINGS.minSize) + SETTINGS.minSize;
  particle.style.width = size + "px";
  particle.style.height = size + "px";

  // Positie
  let posX = x;
  let posY = y;

  particle.style.left = posX + "px";
  particle.style.top = posY + "px";

  document.body.appendChild(particle);

  // Beweging
  const angle = (Math.random() - 0.5) * Math.PI;

  const velocity =
    Math.random() * (SETTINGS.maxVelocity - SETTINGS.minVelocity) + SETTINGS.minVelocity;

  const vx = Math.sin(angle) * velocity;
  let vy =
    -(Math.random() * (SETTINGS.maxUpward - SETTINGS.minUpward) + SETTINGS.minUpward);

  let life = 0;

  // Rotatie
  const rotation = Math.random() * 360;
  particle.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;

  function animate() {
    life++;

    posX += vx;
    posY += vy;

    vy += SETTINGS.gravity;

    particle.style.left = posX + "px";
    particle.style.top = posY + "px";
    particle.style.opacity = 1 - life / SETTINGS.life;

    if (life < SETTINGS.life) {
      requestAnimationFrame(animate);
    } else {
      particle.remove();
    }
  }

  animate();
}