import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Store latest sensor data
let latestData = {
  temperature: 22.5,
  humidity: 78.3,
  lightIntensity: 450,
  co2: 1200,
  soilMoisture: 65.8,
  led: false,
  timestamp: new Date().toISOString()
};

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// ESP32 sends sensor data here
app.post('/data', (req, res) => {
  console.log('Received data from ESP32:', req.body);
  latestData = {
    ...req.body,
    timestamp: new Date().toISOString()
  };

  // Broadcast to all connected WebSocket clients
  wss.clients.forEach(client => {
    if (client.readyState === 1) { // OPEN
      client.send(JSON.stringify(latestData));
    }
  });

  res.json({ status: 'ok', received: latestData });
});

// Android app gets sensor data here
app.get('/data', (req, res) => {
  res.json(latestData);
});

// LED control endpoint
app.post('/led/:action', (req, res) => {
  const action = req.params.action;
  console.log(`LED ${action} requested`);

  // In a real implementation, you'd send this to ESP32
  // For now, just update local state
  latestData.led = action === 'on';

  // Broadcast update
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(latestData));
    }
  });

  res.json({ status: 'ok', led: latestData.led });
});

// WebSocket connection for real-time updates
wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  // Send current data immediately
  ws.send(JSON.stringify(latestData));

  ws.on('message', (message) => {
    console.log('Received WS message:', message.toString());
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Cloud server running on port ${PORT}`);
  console.log(`ESP32 should POST to: http://your-domain.com/data`);
  console.log(`Android app should GET from: http://your-domain.com/data`);
});