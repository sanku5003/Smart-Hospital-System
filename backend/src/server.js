require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const apiRoutes = require('./routes/apiRoutes');
const { seedHospital } = require('./controllers/hospitalController');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
  }
});

// Enable CORS & Body Parsers
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Attach Socket.IO to req object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// API Routes
app.use('/api/v1', apiRoutes);

// Root health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'MedPulse Smart Hospital Queue & City Integration API',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== ''),
    timestamp: new Date().toISOString()
  });
});

// Socket.IO realtime connections
io.on('connection', (socket) => {
  console.log(`🔌 Client connected to Realtime Socket: ${socket.id}`);

  socket.on('join-hospital-room', (hospitalId) => {
    socket.join(hospitalId);
    console.log(`🏥 Socket ${socket.id} joined room: ${hospitalId}`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

// Start Server & Connect Database
async function startServer() {
  await connectDB();
  await seedHospital('HOSP-001');

  server.listen(PORT, () => {
    console.log(`
============================================================
🏥 MedPulse Smart Hospital Server Running!
📡 Port: ${PORT}
🔗 API Base: http://localhost:${PORT}/api/v1
⚡ Realtime WebSockets: Active
🤖 Gemini AI Key Configured: ${process.env.GEMINI_API_KEY ? 'YES' : 'NO (Using Intelligent Fallback NLP)'}
============================================================
    `);
  });
}

startServer();
