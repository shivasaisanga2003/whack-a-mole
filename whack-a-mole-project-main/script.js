const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const moles = document.querySelectorAll('.mole');
const leaderboard = document.querySelector('.leaderboard'); // For leaderboard display
const timerDisplay = document.querySelector('.timer');
let lastHole;
let timeUp = false;
let score = 0;
let countdown; // For timer countdown

// Retrieve leaderboard data from localStorage
let leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];

// Create and style the custom cursor
const customCursor = document.createElement('div');
customCursor.style.width = '50px';
customCursor.style.height = '50px';
customCursor.style.background = "url('hammer.png') no-repeat center center / contain"; // Replace with your hammer image
customCursor.style.position = 'absolute';
customCursor.style.pointerEvents = 'none';
customCursor.style.transform = 'translate(-50%, -50%)';
customCursor.style.zIndex = '1000';
document.body.appendChild(customCursor);

// Update custom cursor position
document.addEventListener('mousemove', (e) => {
    customCursor.style.left = `${e.pageX}px`;
    customCursor.style.top = `${e.pageY}px`;
});

// Add click effect on the cursor
document.addEventListener('click', () => {
    customCursor.classList.add('active');
    setTimeout(() => {
        customCursor.classList.remove('active');
    }, 200);
});

// Add custom cursor active effect styling
const style = document.createElement('style');
style.textContent = `
    .active {
        animation: click-effect 0.2s ease;
    }
    @keyframes click-effect {
        0% {
            transform: translate(-50%, -50%) scale(1);
        }
        50% {
            transform: translate(-50%, -50%) scale(0.9);
        }
        100% {
            transform: translate(-50%, -50%) scale(1);
        }
    }
`;
document.head.appendChild(style);

function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
    const index = Math.floor(Math.random() * holes.length);
    const hole = holes[index];

    if (hole === lastHole) {
        return randomHole(holes);
    }
    lastHole = hole;
    return hole;
}

function peep() {
    const time = randomTime(500, 1000);
    const hole = randomHole(holes);
    hole.classList.add('up');
    setTimeout(() => {
        hole.classList.remove('up');
        if (!timeUp) {
            peep();
        }
    }, time);
}

function startGame() {
    scoreBoard.textContent = 0;
    timerDisplay.textContent = 30; // Reset timer to 30 seconds
    timeUp = false;
    score = 0;
    peep();

    // Start the timer
    let timeLeft = 30;
    countdown = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(countdown);
            timeUp = true;
            saveToLeaderboard(score);
        }
    }, 1000);
}

function endGame() {
    clearInterval(countdown); // Stop the timer
    timeUp = true; // End the game
}

function wack(e) {
    if (!e.isTrusted) return;
    score++;
    this.parentNode.classList.remove('up');
    scoreBoard.textContent = score;
}

moles.forEach(mole => mole.addEventListener('click', wack));

// Save score to the leaderboard
function saveToLeaderboard(score) {
    const name = prompt('Enter your name for the leaderboard:');
    if (name) {
        leaderboardData.push({ name, score });
        leaderboardData.sort((a, b) => b.score - a.score); // Sort by score (descending)
        leaderboardData = leaderboardData.slice(0, 5); // Keep only the top 5 scores
        localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));
        updateLeaderboard();
    }
}

// Update leaderboard display
function updateLeaderboard() {
    if (!leaderboard) return;
    leaderboard.innerHTML = leaderboardData
        .map((entry, index) => `<li>${index + 1}. ${entry.name} - ${entry.score} points</li>`)
        .join('');
}

// Initial rendering of the leaderboard
updateLeaderboard();

