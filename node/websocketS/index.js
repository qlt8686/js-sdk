const WebSocket = require("ws");
const readline = require("readline");
const os = require('os')

function getIPAdress() {
  var interfaces = os.networkInterfaces();　　
  for (var devName in interfaces) {　　　　
      var iface = interfaces[devName];　　　　　　
      for (var i = 0; i < iface.length; i++) {
          var alias = iface[i];
          if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
              return alias.address;
          }
      }　　
  }
}

const port = 8989

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const wss = new WebSocket.Server({ port });

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
  });

  rl.on("line", function(line) {
    ws.send(line);
  });
});

console.log(`open in ${getIPAdress()}:8989`)
