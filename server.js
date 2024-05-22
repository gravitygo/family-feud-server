const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Handle WebSocket connections
  const wss = new WebSocket.Server({ noServer: true });
  server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (socket) => {
      wss.emit("connection", socket, request);
    });
  });

  wss.on("connection", (ws) => {
    // WebSocket logic here
  });

  // All other requests handled by Next.js
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  const httpServer = http.createServer(server);

  httpServer.listen(process.env.PORT || 3000, () => {
    console.log(
      `Server started on http://localhost:${process.env.PORT || 3000}`
    );
  });
});
