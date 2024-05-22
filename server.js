const WebSocket = require("ws");

export default async function handler(req, res) {
  if (!res.socket.server.wss) {
    const wss = new WebSocket.Server({ noServer: true });

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

    res.socket.server.wss = wss;
  }

  res.end();
}
