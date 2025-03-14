const socket = io();
let playerType = null;

// Display when game is full
socket.on('full', (message) => {
    alert(message);
    document.getElementById('turn').innerText = message;
});

// Get player type
socket.on('playerType', (type) => {
    playerType = type;
    document.getElementById('player').innerText = `You are: ${type}`;
});

// Update board and turn
socket.on('updateBoard', (gameBoard, currentPlayer) => {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        cell.innerText = gameBoard[index] || '';
    });
    document.getElementById('turn').innerText = `Current Turn: ${currentPlayer}`;
});

// Game over
socket.on('gameOver', (message) => {
    alert(message);
});

// If opponent disconnects
socket.on('gameClosed', (message) => {
    alert(message);
    document.getElementById('turn').innerText = message;
});

// Click event for cells
document.querySelectorAll('.cell').forEach((cell, index) => {
    cell.addEventListener('click', () => {
        socket.emit('move', index);
    });
});

// Reset button
document.getElementById('reset').addEventListener('click', () => {
    socket.emit('reset');
});
