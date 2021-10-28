// let sketch = document.getElementById("mapCanvas");

// let sketchWidth = sketch.clientWidth;
// let sketchHeight = sketch.clientHeight;
// let myCanvas;

// function setup() {
//   myCanvas = createCanvas(sketchWidth, sketchHeight);
//   myCanvas.parent("mapCanvas");
// }

// function windowResized() {
//   sketchWidth = document.getElementsByTagName("body")[0].offsetWidth;
//   sketchHeight = sketch.clientHeight;
//   // console.log(sketchWidth);
//   resizeCanvas(sketchWidth, sketchHeight);
//   let sketchWidthInterval = setInterval(() => {
//     sketchWidth = document.getElementsByTagName("body")[0].offsetWidth;
//     resizeCanvas(sketchWidth, sketchHeight);
//     clearInterval(sketchWidthInterval);
//   }, 40);
// }

// function draw() {
//   clear();
//   background(15, 15, 50);
// }
const mymap = L.map("mapid").setView([51.505, -0.09], 13);
let token =
  "pk.eyJ1IjoibG9yYXdhbi1lcmF5dGVzdCIsImEiOiJja3ZhdXZ5ejAyMnFqMnRva2h1anNqMW40In0.rP5saP4bocjd04pIpVkIPw";

L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken: token,
  }
).addTo(mymap);
