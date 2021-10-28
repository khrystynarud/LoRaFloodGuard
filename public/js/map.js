let sketch = document.getElementById("mapCanvas");

let sketchWidth = sketch.clientWidth;
let sketchHeight = sketch.clientHeight;
let myCanvas;

function setup() {
  myCanvas = createCanvas(sketchWidth, sketchHeight);
  myCanvas.parent("mapCanvas");
}

function windowResized() {
  sketchWidth = document.getElementsByTagName("body")[0].offsetWidth;
  sketchHeight = sketch.clientHeight;
  // console.log(sketchWidth);
  resizeCanvas(sketchWidth, sketchHeight);
  let sketchWidthInterval = setInterval(() => {
    sketchWidth = document.getElementsByTagName("body")[0].offsetWidth;
    resizeCanvas(sketchWidth, sketchHeight);
    clearInterval(sketchWidthInterval);
  }, 40);
}

function draw() {
  clear();
  background(15, 15, 50);
}
