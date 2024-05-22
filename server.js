const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

let queue = [];

wss.on("connection", (ws) => {
  console.log("Client connected");
  ws.on("message", (message) => {
    const data = JSON.parse(message);

    if (data.type === "pressButton") {
      queue.push(data.color);
      broadcastQueue();
    } else if (data.type === "resetQueue") {
      queue = [];
      broadcastQueue();
    }
    console.log(message);
  });
  ws.send(JSON.stringify({ type: "queue", queue }));
});

function broadcastQueue() {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: "queue", queue }));
    }
  });
}

console.log("WebSocket server is running on ws://localhost:8080");
