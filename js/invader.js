let gameEnabled = false;

const InvaderContainer = document.getElementById("invader-container");

// Bron sfx: https://classicgaming.cc/classics/space-invaders/sounds
const shootSound = new Audio("sfx/invaderKilled.wav");

// Bron music theme: https://www.youtube.com/watch?v=k9oyDTR0EwQ&t=29s
const invaderMusic = new Audio("sfx/invaderTheme.mp3");
invaderMusic.loop = true;
invaderMusic.volume = 1;

// Rainbow objects
const globe = document.querySelector(".globe");

let animationInterval;
let animationSpeed = 500;

shootSound.volume = 0.1;

// Elk soort invader aanmaken met bijbehorende score
const invaderTypes = [
  { 
    img1: "images/invaders/invader1.svg",
    img2: "images/invaders/invader1_5.svg",
    points: 100,
    type: "invader1"
  },
  { 
    img1: "images/invaders/invader2.svg",
    img2: "images/invaders/invader2_5.svg",
    points: 250,
    type: "invader2"
  },
  { 
    img1: "images/invaders/invader3.svg",
    img2: "images/invaders/invader3_5.svg",
    points: 400,
    type: "invader3"
  }
];

document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "i") {
    gameEnabled = !gameEnabled;

    if (gameEnabled) {
      startGame();
    } else {
      stopGame();
    }
  }
});

function startGame() {
  console.log("Game started");

  InvaderContainer.style.display = "grid";
  scoreDisplay.style.display = "block";
  resetButton.style.display = "block";
  invaderMusic.play();
  startInvaderAnimation();
  document.body.classList.add("game-active");

  createWave(3, 6);
}

function stopGame() {
  console.log("Game stopped");

  InvaderContainer.style.display = "none";
  InvaderContainer.classList.add("hidden");
  scoreDisplay.style.display = "none";
  scoreDisplay.classList.add("hidden");
  resetButton.style.display = "none"; 
  invaderMusic.pause();
  invaderMusic.currentTime = 0;
  clearInterval(animationInterval);
  document.body.classList.remove("game-active");
}

function createWave(rows = 3, cols = 6) {
  InvaderContainer.innerHTML = "";

  remainingInvaders = rows * cols;

  for (let i = 0; i < rows * cols; i++) {
    const invader = document.createElement("div");
    invader.classList.add("invader");

    const random = invaderTypes[Math.floor(Math.random() * invaderTypes.length)];

    invader.style.backgroundImage = `url(${random.img1})`;

    invader.dataset.img1 = random.img1;
    invader.dataset.img2 = random.img2;
    invader.dataset.frame = "1";

    invader.dataset.points = random.points;
    invader.dataset.type = random.type;

    invader.addEventListener("click", (e) => {
        if (!gameEnabled) return;

        if (invader.style.visibility === "hidden") return;

        const points = parseInt(invader.dataset.points);

        score += points;
        updateScore();

        shootSound.currentTime = 0;
        shootSound.play();

        const rect = invader.getBoundingClientRect();

        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        showFloatingScore(`+${points}`, x, y);

        invader.style.visibility = "hidden";
        invader.style.pointerEvents = "none";

        remainingInvaders--;

        if (remainingInvaders === 0) {
            setTimeout(() => createWave(rows, cols), 1000);
        }
        });

    InvaderContainer.appendChild(invader);

    setTimeout(() => {
      invader.classList.add("show");
    }, i * 80);
  }
}

createWave();

let score = localStorage.getItem("invaderScore")
  ? parseInt(localStorage.getItem("invaderScore"))
  : 0;

// Score display aanmaken
const scoreDisplay = document.createElement("div");
scoreDisplay.id = "score-display";
scoreDisplay.textContent = `Score: ${score}`;

// Score vastmaken aan body
document.body.appendChild(scoreDisplay);

// Score steeds laten updaten
function updateScore() {
  scoreDisplay.textContent = `Score: ${score}`;


  // Save score
  localStorage.setItem("invaderScore", score);

  // Rainbow effect bij bepaalde score
  if (score >= 10000) {
    globe.classList.add("rainbow");
  } else {
    globe.classList.remove("rainbow");
  }
}

function showFloatingScore(text, x, y) {
  const floatText = document.createElement("div");
  floatText.classList.add("floating-score");
  floatText.textContent = text;

  floatText.style.left = `${x}px`;
  floatText.style.top = `${y}px`;

  document.body.appendChild(floatText);

  setTimeout(() => {
    floatText.remove();
  }, 800);
}

function resetScore() {
  score = 0;
  localStorage.removeItem("invaderScore");
  updateScore();
}

InvaderContainer.style.display = "none";
InvaderContainer.classList.add("hidden");
scoreDisplay.classList.add("hidden");

const resetButton = document.createElement("button");
resetButton.id = "reset-button";
resetButton.textContent = "Reset Score";

resetButton.addEventListener("click", () => {
  if (resetButton.classList.contains("open")) return;

  resetButton.classList.add("open");
  setTimeout(() => {
    score = 0;
    localStorage.removeItem("invaderScore");
    updateScore();

    resetButton.classList.remove("open");
  }, 2000);
});

document.body.appendChild(resetButton);
resetButton.style.display = "none";

function startInvaderAnimation() {
  clearInterval(animationInterval);

  animationInterval = setInterval(() => {
    const invaders = document.querySelectorAll(".invader");

    invaders.forEach(invader => {
      if (invader.style.visibility === "hidden") return;

      if (invader.dataset.frame === "1") {
        invader.style.backgroundImage = `url(${invader.dataset.img2})`;
        invader.dataset.frame = "2";
      } else {
        invader.style.backgroundImage = `url(${invader.dataset.img1})`;
        invader.dataset.frame = "1";
      }
    });

  }, animationSpeed);
}