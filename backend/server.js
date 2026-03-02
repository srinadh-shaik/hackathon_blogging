const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io and allow your frontend to connect
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Attach 'io' to the app so our separate route files can use it
app.set('io', io);

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/posts', require('./routes/posts'));

// Use 'server.listen' instead of 'app.listen' for WebSockets
server.listen(5000, () => console.log("Server and WebSockets running on http://localhost:5000"));