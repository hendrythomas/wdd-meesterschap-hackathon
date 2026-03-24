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

// Store all characters
let chars = [];

// 🔤 Convert paragraphs into spans (ACCESSIBLE)
paragraphs.forEach((paragraph, index) => {
  const text = paragraph.innerText.trim();

  paragraph.setAttribute("aria-label", text);
  paragraph.setAttribute("role", "text");

  paragraph.innerHTML = "";

  text.split("").forEach(char => {
    if (char === "\n") {
      paragraph.appendChild(document.createElement("br"));
      return;
    }

    const span = document.createElement("span");
    span.className = "char";
    span.setAttribute("aria-hidden", "true");

    span.innerHTML = char === " " ? "&nbsp;" : char;

    paragraph.appendChild(span);
    chars.push(span);
  });
});

// Toggle behavior
toggle?.addEventListener("change", () => {
  enabled = toggle.checked;

  if (!enabled) {
    chars.forEach(el => {
      el.style.transform = "translate(0px, 0px) scale(1)";
      el.style.opacity = 1;
    });
  }
});

// Cache positions
let basePositions = [];

function cachePositions() {
  basePositions = [];

  chars.forEach(char => {
    const rect = char.getBoundingClientRect();

    basePositions.push({
      el: char,
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    });
  });
}

// Initial cache (delayed)
setTimeout(() => {
  cachePositions();
}, 100);

// Recalculate on resize
window.addEventListener("resize", () => {
  setTimeout(cachePositions, 100);
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
let frameCount = 0;

function animate() {
  frameCount++;
  

  basePositions.forEach(obj => {
    const { el, x, y } = obj;

    let dx = mouse.x - x;
    let dy = mouse.y - y;

    let dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;

    if (enabled && dist < RADIUS) {
      let nx = dx / dist;
      let ny = dy / dist;

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