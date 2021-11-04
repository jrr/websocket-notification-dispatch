let ws;

function connect() {
  console.log("Connecting!");
  if (!window["websocketUri"]) {
    throw new Error("Missing websocket URI. (run ./get-websocket-uri.sh?)");
  }
  ws = new WebSocket(window.websocketUri);
  console.log("ws:", ws);
}
