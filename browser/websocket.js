let ws;

function connect() {
  console.log("Connecting!");
  ws = new WebSocket(
    // todo: include this from generated file:
    "wss://h627krjgbi.execute-api.us-west-1.amazonaws.com/Prod"
  );
  console.log("ws:", ws);
}
