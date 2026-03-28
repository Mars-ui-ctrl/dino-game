
const dino = document.getElementById('dino');
// const cactus = document.getElementById('cactus');
const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById("Score");
const gameOver = document.getElementById('gameOverScreen')
const finalScore = document.getElementById('finalScoreDisplay')
const restartBtn = document.getElementById('restartBtn')
const leaderBoardScreen = document.getElementById('leaderboardScreen');
const closeLeaderboardBtn = document.getElementById('closeLeaderboardBtn');
const leaderboardList = document.getElementById('leaderboardList');
const openLeaderboardBtn = document.getElementById('openLeaderboardBtn');
const authScreen = document.getElementById('authScreen');
const authForm = document.getElementById('authForm');
const authUsername = document.getElementById('authUsername');
const authPassword = document.getElementById('authPassword');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const authBtnText = document.getElementById('authBtnText');
const authError = document.getElementById('authError');
const authTitle = document.getElementById('authTitle');
const toggleAuthModeBtn = document.getElementById('toggleAuthModeBtn');
const authToggleText = document.getElementById('authToggleText');
const startGameWrapper = document.getElementById('startGameWrapper');
const startGameBtn = document.getElementById('startGameBtn');

const jumpSound = new Audio('assets/audio/dino_jump.mp3');
jumpSound.volume = 0.7;
const gameOverSound = new Audio('assets/audio/game-over-arcade-6435.mp3');
const bgMusic = new Audio('assets/audio/Midnight_Pursuit.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.4;

const API_BASE_URL = 'https://dino-rush-api.onrender.com';


let isJumping = false;
let position = 48;
const gravity = 0.9;
// let cactusPosition = 1000;
let spawnTimer;
let obstacleTimer;
let score = 0;
let scoreTimer;
let collisionTimer;
let isLoginMode = true;
let isGameRunning = false;
let baseSpeed = 10;
let currentSpeed = baseSpeed;

const jump = () => {
    if (isJumping) return;
    else {
        jumpSound.currentTime = 0;
        jumpSound.play();
        isJumping = true;
        let upTimer = setInterval(() => {
            if (position > 200) {
                clearInterval(upTimer);
                let downTimer = setInterval(() => {
                    position -= 10;
                    dino.style.bottom = position + "px";
                    if (position <= 48) {
                        clearInterval(downTimer);
                        isJumping = false;
                        position = 48;
                        dino.style.bottom = position + "px";
                    }
                }, 20);
            } else {
                position += 10;
                dino.style.bottom = position + "px";
            }
        }, 20);
    }
}

document.addEventListener('keydown', (e) => {
    if (e.repeat || !isGameRunning) return;
    if (e.code == 'Space' || e.code == 'ArrowUp') {
        e.preventDefault();
        jump();
    }
})
document.addEventListener('touchstart', (e) =>{
    if(e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT' ){
        e.preventDefault();
    }
    if(isGameRunning){
        jump();
    }
    if(!gameOver.classList.contains('hidden')){
        restartGame();
    }
}, {passive: false});

const spawnObstacle = () => {
    if (!isGameRunning) return;
    const newCactus = document.createElement('div');
    newCactus.className = 'cactus absolute bottom-12 flex items-end gap-1';
    newCactus.style.left = gameArea.offsetWidth + 'px';

    newCactus.innerHTML = `
        <div class="w-4 h-12 bg-secondary/40 rounded-t-full shadow-[0_0_10px_rgba(47,248,1,0.2)]"></div>
        <div class="w-4 h-16 bg-secondary rounded-t-full shadow-[0_0_15px_rgba(47,248,1,0.3)]"></div>
        <div class="w-4 h-8 bg-secondary/40 rounded-t-full shadow-[0_0_10px_rgba(47,248,1,0.2)]"></div>
    `;
    gameArea.appendChild(newCactus);

    // let randomSpawnTime = Math.random() * 1500 + 1000;
    let randomSpawnTime = (Math.random() * 1000 + 1000) - (currentSpeed * 15);
    if (randomSpawnTime < 750) randomSpawnTime = 750;
    spawnTimer = setTimeout(spawnObstacle, randomSpawnTime);
}
const moveObstacle = () => {
    obstacleTimer = setInterval(() => {
        const cacti = document.querySelectorAll('.cactus');
        const responsive = gameArea.offsetWidth / 1000;
        const actualSpeed = currentSpeed * responsive;
        cacti.forEach(cactus => {
            let currentLeft = parseInt(cactus.style.left);
            if (currentLeft < -50) {
                cactus.remove();
            } else {
                cactus.style.left = (currentLeft - actualSpeed) + "px";
            }
        });
    }, 20);
}
const gameLoop = () => {
    collisionTimer = setInterval(() => {
        const dinoBottom = parseInt(window.getComputedStyle(dino).getPropertyValue("bottom"));
        const cacti = document.querySelectorAll('.cactus');

        cacti.forEach(cactus => {
            const cactusLeft = parseInt(cactus.style.left)
            if (cactusLeft < 150 && cactusLeft > 90 && dinoBottom < 90) {
                bgMusic.pause();
                gameOverSound.currentTime = 0;
                gameOverSound.play();
                saveScore();
                isGameRunning = false;
                clearInterval(collisionTimer);
                clearInterval(obstacleTimer);
                clearInterval(scoreTimer);
                clearTimeout(spawnTimer);

                gameOver.classList.remove('hidden');
                finalScore.textContent = score;
            }
        });
    }, 10);
}

const startScore = () => {
    scoreTimer = setInterval(() => {
        score++;
        scoreDisplay.textContent = score;
        if (score > 0 && score % 100 === 0) {
            currentSpeed += 1;
        }
    }, 100);
}
const saveScore = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/score`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('dinoToken')
            },
            body: JSON.stringify({
                score: score
            })
        })
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}
const restartGame = () => {
    bgMusic.currentTime =0;
    bgMusic.play();
    isGameRunning = true;
    currentSpeed = baseSpeed;
    gameOver.classList.add('hidden');
    score = 0;
    scoreDisplay.textContent = score;
    const cacti = document.querySelectorAll('.cactus');
    cacti.forEach(cactus => cactus.remove());
    position = 48;
    dino.style.bottom = position + "px";
    moveObstacle();
    startScore();
    gameLoop();
    spawnObstacle();
}
restartBtn.addEventListener('click', restartGame);
openLeaderboardBtn.addEventListener('click', () => {
    leaderBoardScreen.classList.remove('hidden');
    const fetchLeaderboard = async () => {
        leaderboardList.innerHTML = '<div class="text-center text-primary mt-10">Loading Data...</div>';
        try {
            const response = await fetch(`${API_BASE_URL}/leaderboard`);
            const data = await response.json();
            leaderboardList.innerHTML = "";
            data.forEach((element, index) => {
                let rank = (index + 1).toString().padStart(2, '0');

                leaderboardList.innerHTML += `
        <div class="flex items-center gap-4 px-6 py-5 hover:bg-surface-container-high/30 transition-colors group cursor-pointer border-b border-outline-variant/5">
            <div class="w-10 h-10 flex items-center justify-center font-headline font-bold text-xl text-primary/70">
                ${rank}
            </div>
            <div class="flex-grow">
                <h3 class="font-headline text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                    ${element.playerName}
                </h3>
            </div>
            <div class="text-right">
                <div class="text-xl font-headline font-bold text-primary">${element.score}</div>
                <div class="text-[9px] font-label text-on-surface-variant uppercase tracking-widest">High Score</div>
            </div>
        </div>
    `;
            });
        } catch (error) {
            leaderboardList.innerHTML = '<div class="text-center text-error mt-10">Failed to load leaderboard</div>';
        }
    }
    fetchLeaderboard();
})
closeLeaderboardBtn.addEventListener('click', () => {
    leaderBoardScreen.classList.add('hidden');
})
toggleAuthModeBtn.addEventListener('click', () => {
    isLoginMode = !isLoginMode;
    authUsername.value = "";
    authPassword.value = "";
    authError.classList.add('hidden');
    if (isLoginMode) {
        authTitle.textContent = "Welcome Back, Racer!";
        authBtnText.textContent = 'Login';
        authToggleText.textContent = "Don't have an account?";
    } else {
        authTitle.textContent = "Create Account";
        authBtnText.textContent = "Register";
        authToggleText.textContent = "Already have an account?";
    }
})
authForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = authUsername.value;
    const password = authPassword.value;
    let endpoint;
    if (isLoginMode) {
        endpoint = `${API_BASE_URL}/login`;
    } else {
        endpoint = `${API_BASE_URL}/register`;
    }
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        })
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
            authError.textContent = data.message;
            authError.classList.remove('text-primary');
            authError.classList.add('text-error');
            authError.classList.remove('hidden');
        }
        else {
            if (isLoginMode) {
                localStorage.setItem('dinoToken', data.token);
                authScreen.classList.add('hidden');
            }
            else {
                toggleAuthModeBtn.click();
                authError.textContent = "Registration successful! Please log in.";
                authError.classList.remove('text-error');
                authError.classList.add('text-primary');
                authError.classList.remove('hidden');
            }
        }
    } catch (error) {
        console.log(error);
    }
})
startGameBtn.addEventListener('click', () => {
    startGameWrapper.classList.add('hidden');
    isGameRunning = true;
    bgMusic.currentTime = 0;
    bgMusic.play();
    moveObstacle();
    startScore();
    gameLoop();
    spawnObstacle();
});
startGameBtn.addEventListener('touchstart', (e)=>{
    e.preventDefault();
    startGameWrapper.classList.add('hidden');
    isGameRunning = true;
    bgMusic.currentTime = 0;
    bgMusic.play();
    moveObstacle();
    startScore();
    gameLoop();
    spawnObstacle();
})
