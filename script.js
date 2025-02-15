// Variables globales
let players = [];
let currentPlayerIndex = 0;
let probabilities = [16.67, 33.33, 50, 66.67, 83.33, 100];
let isPaused = false;

// Sons
const barMusic = new Audio('sounds/bar_music.mp3');
const suspenseMusic = new Audio('sounds/suspense.mp3');
const gunshot = new Audio('sounds/gunshot.mp3');
const emptyClick = new Audio('sounds/empty_click.mp3');

// Initialisation du jeu
function initializeGame() {
    const playerCount = localStorage.getItem('playerCount');
    const playerInputs = document.getElementById('playerInputs');
    for (let i = 0; i < playerCount; i++) {
        playerInputs.innerHTML += `<input type="text" id="player${i + 1}" placeholder="Joueur ${i + 1}">`;
    }
}

function startGame() {
    const playerCount = localStorage.getItem('playerCount');
    for (let i = 0; i < playerCount; i++) {
        const playerName = document.getElementById(`player${i + 1}`).value || `Joueur ${i + 1}`;
        players.push({ name: playerName, alive: true, probabilityIndex: 0 });
    }
    document.getElementById('playerSetup').style.display = 'none';
    document.getElementById('gameArea').style.display = 'block';
    renderPlayers();
    barMusic.loop = true;
    barMusic.play();
}

function renderPlayers() {
    const playersDisplay = document.getElementById('playersDisplay');
    playersDisplay.innerHTML = '';
    players.forEach((player, index) => {
        if (player.alive) {
            playersDisplay.innerHTML += `
                <div class="player">
                    <p>${player.name}</p>
                    <p>${probabilities[player.probabilityIndex]}%</p>
                    <button onclick="shoot(${index})">Tirer</button>
                </div>
            `;
        }
    });

    // Ajouter le bouton "Relancer ?" si au moins un joueur est éliminé
    const eliminatedPlayers = players.filter(player => !player.alive);
    if (eliminatedPlayers.length > 0) {
        playersDisplay.innerHTML += `
            <button onclick="resetProbabilities()">Relancer ?</button>
        `;
    }
}

function shoot(playerIndex) {
    if (isPaused) return;
    const player = players[playerIndex];
    const probability = probabilities[player.probabilityIndex];
    const result = Math.random() * 100 < probability;
    suspenseMusic.play();
    setTimeout(() => {
        if (result) {
            gunshot.play();
            alert(`BOOM ! Le pistolet de ${player.name} a tiré.`);
            player.alive = false;
            renderPlayers();
        } else {
            emptyClick.play();
            alert(`Click... rien ne se passe pour ${player.name}.`);
            player.probabilityIndex++;
            renderPlayers();
        }
        checkWinner();
    }, 4000);
}

function resetProbabilities() {
    players.forEach(player => {
        if (player.alive) {
            player.probabilityIndex = 0;
        }
    });
    renderPlayers();
}

function checkWinner() {
    const alivePlayers = players.filter(player => player.alive);
    if (alivePlayers.length === 1) {
        alert(`${alivePlayers[0].name} a gagné !`);
        barMusic.pause();
    }
}

function togglePause() {
    isPaused = !isPaused;
    document.getElementById('pauseMenu').style.display = isPaused ? 'block' : 'none';
    document.getElementById('gameArea').classList.toggle('blur', isPaused);
    barMusic.pause();
}

function resumeGame() {
    isPaused = false;
    document.getElementById('pauseMenu').style.display = 'none';
    document.getElementById('gameArea').classList.remove('blur');
    barMusic.play();
}

function openRemovePlayerMenu() {
    const removePlayerOptions = document.getElementById('removePlayerOptions');
    removePlayerOptions.innerHTML = '';
    players.forEach((player, index) => {
        if (player.alive) {
            removePlayerOptions.innerHTML += `
                <button onclick="removePlayer(${index})">${player.name}</button>
            `;
        }
    });
    document.getElementById('removePlayerMenu').style.display = 'block';
}

function closeRemovePlayerMenu() {
    document.getElementById('removePlayerMenu').style.display = 'none';
}

function removePlayer(playerIndex) {
    players[playerIndex].alive = false;
    closeRemovePlayerMenu();
    renderPlayers();
    checkWinner();
}

function openAddPlayerMenu() {
    if (players.length >= 6) {
        alert("Vous ne pouvez pas ajouter plus de 6 joueurs.");
        return;
    }
    document.getElementById('addPlayerMenu').style.display = 'block';
}

function closeAddPlayerMenu() {
    document.getElementById('addPlayerMenu').style.display = 'none';
}

function addNewPlayer() {
    const newPlayerName = document.getElementById('newPlayerName').value || `Joueur ${players.length + 1}`;
    if (players.length < 6) {
        players.push({ name: newPlayerName, alive: true, probabilityIndex: 0 });
        closeAddPlayerMenu();
        renderPlayers();
    } else {
        alert("Vous ne pouvez pas ajouter plus de 6 joueurs.");
    }
}

function restartGame() {
    players.forEach(player => {
        player.alive = true;
        player.probabilityIndex = 0;
    });
    renderPlayers();
    barMusic.play();
}

// Initialisation
window.onload = initializeGame;