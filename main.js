const EventEmitter = require("events");
const express = require("express");
const path = require("path");
const fs = require("fs");
const https = require("https");
const app = express();
const myEmitter = new EventEmitter();

let stat = process.argv[2];
// console.log(stat);

let hostName = "https://waterlevelwamo.herokuapp.com";

let wamos;
let pathToFile = "./src/wamos.json";

function getDataFromWamo(stat) {
  if (stat === "demo") {
    //read the file
    fs.readFile(pathToFile, (err, data) => {
      if (err) {
        throw err;
      } else {
        //turn json into js object
        data = JSON.parse(data.toString());
        //save the data as wamos
        wamos = data;
      }
    });
  } else {
    let req = https.request(hostName, (res, rej) => {
      res.on("data", (d) => {
        // process.stdout.write(d);
        console.log(d.toString());
        wamos = d.toString();
      });
    });

    req.on("error", (error) => {
      console.error(error);
    });

    req.end();
  }
}

function getDataFromHTML(data) {
  //print the data that was received by the http-server

  console.log(data);
  // setTimeout(() => {
  //   fs.writeFileSync(pathToFile, JSON.stringify(test));
  // }, 10000);
}

//get the
let dataInterval = setInterval(() => {
  getDataFromWamo(stat);
}, 1000);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  //zeigst du die html aus dem Ordner "public"
  res.sendFile(path.join(__dirname + "/index.html"));
});

//send the data to the HTML DOM
app.get("/data", (req, res) => {
  res.send(wamos);
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
