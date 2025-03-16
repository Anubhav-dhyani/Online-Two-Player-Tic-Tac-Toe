const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { v4: uuidv4 } = require('uuid'); // For generating room codes

const io = require('socket.io')(http, {
    cors: {
        origin: "*",  // Allow all origins (you can restrict this)
        methods: ["GET", "POST"]
    }
});
app.use(express.static('public'));

const PORT = 3000;




let publicGames = []; // Stores open public games
let privateGames = {}; // Stores private games by room code

// Function to check winner
function checkWinner(gameBoard) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]
    ];
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return gameBoard[a];
        }
    }
    return null;
}

// Function to reset game
function resetGame(room) {
    if (room) {
        room.gameBoard = Array(9).fill(null);
        room.currentPlayer = 'X';
    }
}

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle creating a private game
    socket.on('createPrivateGame', () => {
        const roomCode = uuidv4().substring(0, 6); // Generate 6-character room code
        privateGames[roomCode] = {
            players: {},
            gameBoard: Array(9).fill(null),
            currentPlayer: 'X'
        };
        socket.emit('privateGameCreated', roomCode);
    });

    // Handle joining a private game
    socket.on('joinPrivateGame', (roomCode) => {
        if (privateGames[roomCode] && Object.keys(privateGames[roomCode].players).length < 2) {
            socket.join(roomCode);
            let room = privateGames[roomCode];
            room.players[socket.id] = Object.keys(room.players).length === 0 ? 'X' : 'O';

            socket.emit('playerType', room.players[socket.id]);
            io.to(roomCode).emit('updateBoard', room.gameBoard, room.currentPlayer);
        } else {
            socket.emit('privateGameError', 'Room is full or does not exist!');
        }
    });

    // Handle joining a public game
    socket.on('joinPublicGame', () => {
        let roomCode = publicGames.find(roomCode => {
            let room = privateGames[roomCode];
            return room && Object.keys(room.players).length < 2;
        });
    
        if (!roomCode) {
            roomCode = uuidv4().substring(0, 6);
            publicGames.push(roomCode);
            privateGames[roomCode] = { players: {}, gameBoard: Array(9).fill(null), currentPlayer: 'X' };
        }
    
        socket.join(roomCode);
        let room = privateGames[roomCode];
        room.players[socket.id] = Object.keys(room.players).length === 0 ? 'X' : 'O';
    
        socket.emit('playerType', room.players[socket.id]);
        io.to(roomCode).emit('updateBoard', room.gameBoard, room.currentPlayer);
    });
    

    // Handle moves
    socket.on('move', (index, roomCode) => {
        let room = privateGames[roomCode];

        if (room && room.gameBoard[index] === null && room.players[socket.id] === room.currentPlayer) {
            room.gameBoard[index] = room.players[socket.id];
            const winner = checkWinner(room.gameBoard);

            if (winner) {
                io.to(roomCode).emit('gameOver', `${winner} wins!`);
                resetGame(room);
            } else if (room.gameBoard.every(cell => cell !== null)) {
                io.to(roomCode).emit('gameOver', 'Draw!');
                resetGame(room);
            } else {
                room.currentPlayer = room.currentPlayer === 'X' ? 'O' : 'X';
                io.to(roomCode).emit('updateBoard', room.gameBoard, room.currentPlayer);
            }
        }
    });

    // Handle game reset
    socket.on('reset', (roomCode) => {
        let room = privateGames[roomCode];
        if (room) {
            resetGame(room);
            io.to(roomCode).emit('updateBoard', room.gameBoard, room.currentPlayer);
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        for (let roomCode in privateGames) {
            let room = privateGames[roomCode];

            if (room.players[socket.id]) {
                io.to(roomCode).emit('gameClosed', 'Opponent disconnected. Game closed!');
                delete privateGames[roomCode];
                break;
            }
        }
    });
});

http.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
