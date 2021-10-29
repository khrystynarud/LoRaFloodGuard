const EventEmitter = require("events");
const express = require("express");
const path = require("path");
const fs = require("fs");
const https = require("https");
const app = express();
const myEmitter = new EventEmitter();

let stat = process.argv[2];

const hostNameWamos = "https://waterlevelwamo.herokuapp.com";
let weatherData;

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
    let req = https.request(hostNameWamos, (res, rej) => {
      res.on("data", (d) => {
        // process.stdout.write(d);
        wamos = [JSON.parse(d)];
        console.log(wamos);
      });
    });

    req.on("error", (error) => {
      console.error(error);
    });

    req.end();
  }
}

function getWeather(lat, long) {
  let key = "01f048652761449aac1120721212910";
  const hostNameWeather = `https://api.weatherapi.com/v1/current.json?key=${key}&q=${lat}, ${long}&aqi=no`;
  let req = https.request(hostNameWeather, (res, rej) => {
    res.on("data", (d) => {
      // process.stdout.write(d);
      weatherData = JSON.parse(d);
      console.log(weatherData);
    });
  });

  req.on("error", (error) => {
    console.error(error);
  });

  req.end();
}

function getDataFromHTML(data) {
  console.log(data);
}

//get the
let dataInterval = setInterval(() => {
  getDataFromWamo(stat);
}, 1000);

getWeather(50.13870817817009, 9.132599470135487);
let weatherInterval = setInterval(() => {
  getWeather(50.13870817817009, 9.132599470135487);
}, 60000);

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
app.get("/weather", (req, res) => {
  res.send(weatherData);
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
