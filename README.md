# AFCOM Cloud Server

Cloud server for the AFCOM Mushroom Cultivation Tracker system.

## Features

- REST API for sensor data collection from ESP32 devices
- Real-time WebSocket connections for live updates
- LED control commands
- CORS enabled for cross-origin requests

## API Endpoints

### POST /data
Receive sensor data from ESP32
```json
{
  "temperature": 22.5,
  "humidity": 78.3,
  "lightIntensity": 450,
  "co2": 1200,
  "soilMoisture": 65.8,
  "led": true
}
```

### GET /data
Retrieve latest sensor data for mobile app

### POST /led/on | /led/off
Control LED state

## WebSocket
Real-time updates available at `ws://your-server/ws`

## Deployment

### Railway (Free)
1. Connect GitHub repo
2. Build: `npm install`
3. Start: `npm start`

### Render (Free)
1. Connect repo
2. Runtime: Node
3. Build: `npm install`
4. Start: `npm start`

## Usage

1. Deploy this server
2. Update ESP32 code with server URL
3. Update mobile app with server URL
4. ESP32 sends data every 2 seconds
5. Mobile app receives real-time updates

## License

MIT