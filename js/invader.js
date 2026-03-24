let gameEnabled = false;

const InvaderContainer = document.getElementById("invader-container");
const shootSound = new Audio("sfx/invaderKilled.wav");
shootSound.volume = 0.3;


// define invaders with type + points
const invaderTypes = [
  { img: "images/invaders/invader1.svg", points: 100, type: "invader1" },
  { img: "images/invaders/invader2.svg", points: 250, type: "invader2" },
  { img: "images/invaders/invader3.svg", points: 400, type: "invader3" }
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
  scoreDisplay.style.display = "block"; // 👈 show score

  createWave(3, 6);
}

function stopGame() {
  console.log("Game stopped");

  InvaderContainer.style.display = "none";
  InvaderContainer.classList.add("hidden");
  scoreDisplay.style.display = "none";
  scoreDisplay.classList.add("hidden");
}

function createWave(rows = 3, cols = 6) {
  InvaderContainer.innerHTML = "";

  remainingInvaders = rows * cols; // 👈 reset counter

  for (let i = 0; i < rows * cols; i++) {
    const invader = document.createElement("div");
    invader.classList.add("invader");

    const random = invaderTypes[Math.floor(Math.random() * invaderTypes.length)];

    invader.style.backgroundImage = `url(${random.img})`;

    invader.dataset.points = random.points;
    invader.dataset.type = random.type;

    invader.addEventListener("click", (e) => {
        if (!gameEnabled) return; // 👈 block clicks when disabled

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

// run it
createWave();

let score = 0;

// Create the score display element
const scoreDisplay = document.createElement("div");
scoreDisplay.id = "score-display";
scoreDisplay.textContent = `Score: ${score}`;

// Append to body
document.body.appendChild(scoreDisplay);

// Function to update score
function updateScore() {
  scoreDisplay.textContent = `Score: ${score}`;
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

InvaderContainer.style.display = "none";
InvaderContainer.classList.add("hidden");
scoreDisplay.classList.add("hidden");