let ws;

function connect() {
  console.log("Connecting!");
  ws = new WebSocket(
    "wss://h627krjgbi.execute-api.us-west-1.amazonaws.com/Prod"
  );
  console.log("ws:", ws);
}
