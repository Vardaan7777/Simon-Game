let gameSeq = [];
let userSeq = [];

let btns = ["yellow", "red", "purple", "green"];

let started = false;
let level = 0;
let highScore = localStorage.getItem("simonHighScore")
    ? parseInt(localStorage.getItem("simonHighScore"))
    : 0;
let acceptingInput = false;
let difficulty = "medium";

let statusText = document.querySelector("#status-text");
let levelDisplay = document.querySelector("#level-display");
let levelBadge = document.querySelector("#level-badge");
let highscoreDisplay = document.querySelector("#highscore-display");
let startBtn = document.querySelector("#start-btn");
let difficultySelect = document.querySelector("#difficulty-select");
let modalOverlay = document.querySelector("#modal-overlay");
let modalScore = document.querySelector("#modal-score");
let modalHighscore = document.querySelector("#modal-highscore");
let modalCloseBtn = document.querySelector("#modal-close-btn");

highscoreDisplay.innerText = highScore;

const difficultySettings = {
    easy:   { base: 500, decrement: 10, floor: 250 },
    medium: { base: 400, decrement: 15, floor: 150 },
    hard:   { base: 300, decrement: 20, floor: 100 }
};

const keyMap = {
    "1": "red",
    "2": "yellow",
    "3": "green",
    "4": "purple",
    "ArrowUp": "red",
    "ArrowRight": "yellow",
    "ArrowDown": "purple",
    "ArrowLeft": "green"
};

startBtn.addEventListener("click", function() {
    if (started == false) {
        started = true;
        statusText.innerText = "";
        levelUp();
    }
});

difficultySelect.addEventListener("change", function() {
    difficulty = this.value;
});

modalCloseBtn.addEventListener("click", function() {
    modalOverlay.classList.remove("show");
});

document.addEventListener("keydown", function(e) {
    let color = keyMap[e.key];
    if (!color) return;
    e.preventDefault();
    let btn = document.querySelector(`.${color}`);
    if (started == false) {
        userflash(btn);
        createRipple(btn);
        return;
    }

    registerInput(btn, color);
});

function createRipple(btn) {
    let ripple = document.createElement("span");
    ripple.classList.add("ripple");
    ripple.style.width = ripple.style.height = "60px";
    ripple.style.left = "50%";
    ripple.style.top = "50%";
    ripple.style.marginLeft = "-30px";
    ripple.style.marginTop = "-30px";
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
}

function getFlashSpeed() {
    let settings = difficultySettings[difficulty];
    return Math.max(settings.base - level * settings.decrement, settings.floor);
}

function gameFlash(btn) {
    btn.classList.add("flash");
    setTimeout(function() {
        btn.classList.remove("flash");
    }, getFlashSpeed());
}

function userflash(btn) {
    btn.classList.add("userflash");
    setTimeout(function() {
        btn.classList.remove("userflash");
    }, 200);
}

function blinkLevelBadge() {
    levelBadge.classList.remove("blink");
    void levelBadge.offsetWidth;
    levelBadge.classList.add("blink");
}

function levelUp() {
    acceptingInput = false;
    userSeq = [];
    level++;
    levelDisplay.innerText = level;
    statusText.innerText = `Level ${level}`;
    blinkLevelBadge();

    let randIdx = Math.floor(Math.random() * 4);
    let randColor = btns[randIdx];
    let randBtn = document.querySelector(`.${randColor}`);

    gameSeq.push(randColor);

    setTimeout(function() {
        gameFlash(randBtn);
        acceptingInput = true;
    }, 300);
}

function checkAns() {
    let idx = userSeq.length - 1;

    if (userSeq[idx] === gameSeq[idx]) {
        if (userSeq.length == gameSeq.length) {
            setTimeout(levelUp, 1000);
        }
    } else {
        handleGameOver();
    }
}

function handleGameOver() {
    if (level - 1 > highScore) {
        highScore = level - 1;
        localStorage.setItem("simonHighScore", highScore);
        highscoreDisplay.innerText = highScore;
    }

    document.querySelector("body").style.backgroundColor = "red";
    setTimeout(function() {
        document.querySelector("body").style.backgroundColor = "#121212";
    }, 150);

    modalScore.innerText = level - 1;
    modalHighscore.innerText = highScore;
    modalOverlay.classList.add("show");

    statusText.innerText = "Press Start to play";
    reset();
}

function registerInput(btn, color) {
    if (acceptingInput == false) {
        return;
    }

    userflash(btn);
    createRipple(btn);

    userSeq.push(color);
    checkAns();
}

function btnPress() {
    registerInput(this, this.getAttribute("id"));
}

let allBtns = document.querySelectorAll(".btn");
for (btn of allBtns) {
    btn.addEventListener("click", btnPress);
}

function reset() {
    started = false;
    acceptingInput = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
    levelDisplay.innerText = 0;
}
