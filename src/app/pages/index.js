import { useEffect } from "react";
import WebSocket from "ws";

export default function Home() {
  useEffect(() => {
    const wss = new WebSocket.Server({ port: process.env.PORT || 8080 });

    let queue = [];

    wss.on("connection", (ws) => {
      ws.on("message", (message) => {
        const data = JSON.parse(message);

        if (data.type === "pressButton") {
          queue.push(data.color);
          broadcastQueue();
        } else if (data.type === "resetQueue") {
          queue = [];
          broadcastQueue();
        }
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
  }, []);

  return (
    <div>
      <h1>Next.js with WebSocket</h1>
    </div>
  );
}
