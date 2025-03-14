const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

const PORT = 3000;

let players = {};
let gameBoard = Array(9).fill(null);
let currentPlayer = 'X';

// Function to check winner
function checkWinner() {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return gameBoard[a]; // 'X' or 'O'
        }
    }
    return null; // No winner yet
}

// Function to reset game
function resetGame() {
    gameBoard = Array(9).fill(null);
    currentPlayer = 'X';
}

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle connection
    if (Object.keys(players).length < 2) {
        players[socket.id] = Object.keys(players).length === 0 ? 'X' : 'O';
        socket.emit('playerType', players[socket.id]);
        io.emit('updateBoard', gameBoard, currentPlayer);
    } else {
        socket.emit('full', 'Game is full! Try again later.');
        socket.disconnect();
        return;
    }

    // Handle move
    socket.on('move', (index) => {
        if (gameBoard[index] === null && players[socket.id] === currentPlayer) {
            gameBoard[index] = players[socket.id]; // Set move
            const winner = checkWinner();

            if (winner) {
                io.emit('gameOver', `${winner} wins!`);
                resetGame();
                io.emit('updateBoard', gameBoard, currentPlayer);
            } else if (gameBoard.every(cell => cell !== null)) {
                io.emit('gameOver', 'Draw!');
                resetGame();
                io.emit('updateBoard', gameBoard, currentPlayer);
            } else {
                // Continue game
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                io.emit('updateBoard', gameBoard, currentPlayer);
            }
        }
    });

    // Handle reset by player
    socket.on('reset', () => {
        resetGame();
        io.emit('updateBoard', gameBoard, currentPlayer);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);

        // Notify both players
        io.emit('gameClosed', 'Opponent disconnected. Game closed!');

        // Disconnect both players
        for (let id in players) {
            io.sockets.sockets.get(id)?.disconnect(true);
        }

        // Reset game state
        players = {};
        resetGame();
    });
});

http.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
