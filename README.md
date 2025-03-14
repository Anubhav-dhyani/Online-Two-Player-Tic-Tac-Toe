# Online-Two-Player-Tic-Tac-Toe
 It allows two players to join a game session and play Tic-Tac-Toe against each other in real time. The game automatically handles turns, win/draw logic, and resets. If any player disconnects, the game ends for both players, and a new session can be started.

  Features
Real-time multiplayer gameplay using WebSockets.
Automatic player assignment as 'X' and 'O'.
Dynamic game board updates.
Win/draw detection and announcement.
Automatic game reset on game completion or player disconnection.
Mobile and desktop responsive interface.
Modern and smooth UI interactions.
🚀 Tech Stack
Backend: Node.js, Express.js, Socket.IO
Frontend: HTML, CSS, JavaScript
🗂 Project Structure
cpp
Copy
Edit
/project-root
  ├── public// Public is A Ziped Folder you need to unzid it first
  │     ├── index.html      // Main game interface
  │     ├── script.js       // Client-side socket and game logic
  │     └── styles.css      // Game styling
  └── server.js             // Server logic handling sockets and game flow
📖 README.md File
markdown
Copy
Edit
# 🕹️ Real-Time Multiplayer Tic-Tac-Toe Game

A real-time multiplayer Tic-Tac-Toe game built using Node.js, Express, and Socket.IO. Two players can play against each other over a web socket connection, with real-time updates and automatic game handling.

## 🚀 Features
- Real-time multiplayer game using WebSockets (Socket.IO).
- Automatic player assignment ('X' and 'O').
- Real-time board updates.
- Win/draw detection and automatic reset.
- Disconnect handling: if one player disconnects, the game session resets.
- Modern, responsive UI for mobile and desktop.

## 📂 Project Structure

/project-root ├── public// Public is a Ziped Folder you need to unzid it first│ ├── index.html // Game interface │ ├── script.js // Client-side logic │ └── styles.css // Game styling └── server.js // Server-side socket and game management

markdown
Copy
Edit

## 💻 Tech Stack
- **Backend**: Node.js, Express, Socket.IO
- **Frontend**: HTML, CSS, Vanilla JavaScript

## ✅ How to Run

### 1. Clone the repository
```bash
git clone https://github.com/your-username/tic-tac-toe-multiplayer.git
cd tic-tac-toe-multiplayer
2. Install dependencies
bash
Copy
Edit
npm install
3. Start the server
bash
Copy
Edit
node server.js
4. Play the game
Open http://localhost:3000/ in two tabs or devices to play against each other.
📜 Game Flow
First two players connecting to the game are assigned 'X' and 'O'.
Players take alternate turns by clicking on empty cells.
Once a player wins or the game is drawn, both players are notified.
Game resets automatically after completion or if any player disconnects.
