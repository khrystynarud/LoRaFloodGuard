const EventEmitter = require("events");
const express = require("express");
const path = require("path");
const fs = require("fs");

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
