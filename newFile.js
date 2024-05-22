const { wss, queue, broadcastQueue } = require("./server");

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
