const EventEmitter = require("events");
const express = require("express");
const path = require("path");
const fs = require("fs");
const WebSocketServer = require("websocket").server;
const http = require("http");

const app = express();
const myEmitter = new EventEmitter();

let vamos;
let pathToFile = "./src/vamos.json";


function getDataFromVamo() {
  //read the file
  fs.readFile(pathToFile, (err, data) => {
    if (err) {
      throw err;
    } else {
      //turn json into js object
      data = JSON.parse(data.toString());
      //save the data as vamos
      vamos = data;
    }
  });
}

function getDataFromHTML(data) {
  //print the data that was received by the http-server

  console.log(data);
  // setTimeout(() => {
  //   fs.writeFileSync(pathToFile, JSON.stringify(test));
  // }, 10000);
}

//get the
let dataInterval = setInterval(getDataFromVamo, 1000);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  //zeigst du die html aus dem Ordner "public"
  res.sendFile(path.join(__dirname + "/index.html"));
});

//send the data to the HTML DOM
app.get("/data", (req, res) => {
  res.send(vamos);
});

//if something comes back
app.post("/ressource", async (req, res) => {
  //do something with it
  getDataFromHTML(req.body);
});

//server listening on port 8080
app.listen(8080);
console.log("listening on http://localhost:8080");

//if the server is closed
process.on("SIGINT", () => {
  console.log(">PROCESS HAS STOPPED.<");
  clearInterval(dataInterval);
  process.exit();
});

// ###############################################################

//https://www.npmjs.com/package/websocket
// const server = http.createServer(function (request, response) {
//   console.log(new Date() + " Received request for " + request.url);
//   response.writeHead(404);
//   response.end();
// });
// server.listen(3001, function () {
//   console.log(new Date() + " Server is listening on port 3001");
// });

// const wsServer = new WebSocketServer({
//   // Was ist dieser WsServer? --- WS steht für WebSocket, ist also unser Server
//   httpServer: server,
//   // You should not use autoAcceptConnections for production
//   // applications, as it defeats all standard cross-origin protection
//   // facilities built into the protocol and the browser.  You should
//   // *always* verify the connection's origin and decide whether or not
//   // to accept it.
//   autoAcceptConnections: true,
// });

// //build a connection to client
// wsServer.on("request", function (request, data) {
//   if (!originIsAllowed(request.origin)) {
//     // nur bestimmte Anfragen erlauben (wenn angegeben)
//     // Make sure we only accept requests from an allowed origin
//     request.reject();
//     console.log(
//       new Date() + " Connection from origin " + request.origin + " rejected."
//     );
//     console.log(request);
//     console.log(data);

//     return;
//   }

//   let connection = request.accept("echo-protocol", request.origin);
//   console.log(new Date() + " Connection accepted.");

//   connection.on("message", function (message) {
//     console.log(message);
//   });

//   connection.on("close", function (reasonCode, description) {
//     console.log(
//       new Date() + " Peer " + connection.remoteAddress + " disconnected."
//     );
//   });
// });
