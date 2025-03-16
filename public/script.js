const socket = io();
let playerType = null;
let currentRoom = null;

// Creating a private game
document.getElementById('createPrivate').addEventListener('click', () => {
    socket.emit('createPrivateGame');
});

// Joining a private game
document.getElementById('joinPrivate').addEventListener('click', () => {
    const roomCode = prompt("Enter Room Code:");
    if (roomCode) {
        currentRoom = roomCode;
        socket.emit('joinPrivateGame', roomCode);
    }
});

// Joining a public game
document.getElementById('joinPublic').addEventListener('click', () => {
    socket.emit('joinPublicGame');
});

// Handle game full error
socket.on('privateGameError', (message) => {
    alert(message);
});

// Get player type
socket.on('playerType', (type) => {
    playerType = type;
    document.getElementById('player').innerText = `You are: ${type}`;
});

// Update board
socket.on('updateBoard', (gameBoard, currentPlayer) => {
    document.querySelectorAll('.cell').forEach((cell, index) => {
        cell.innerText = gameBoard[index] || '';
    });
    document.getElementById('turn').innerText = `Current Turn: ${currentPlayer}`;
});

// Game over
socket.on('gameOver', (message) => {
    alert(message);
});

// Opponent disconnects
socket.on('gameClosed', (message) => {
    alert(message);
});

// Handle moves
document.querySelectorAll('.cell').forEach((cell, index) => {
    cell.addEventListener('click', () => {
        if (currentRoom) {
            socket.emit('move', index, currentRoom);
        }
    });
});

// Handle reset
document.getElementById('reset').addEventListener('click', () => {
    if (currentRoom) {
        socket.emit('reset', currentRoom);
    }
});

// Handle private game creation
socket.on('privateGameCreated', (roomCode) => {
    alert(`Your private game code: ${roomCode}`);
    currentRoom = roomCode;
});
