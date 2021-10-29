let dataArray = [];
let textArray = [];
let waterLevelStateDescriptionBox = document.getElementById(
  "waterLevelStateDescriptionBox"
);
let weatherDescriptionBox = document.getElementById("weatherDescriptionBox");
let weatherBtn = document.getElementById("weatherBtn");
let changeMapBtn = document.getElementById("changeMapBtn");
let resetZoomBtn = document.getElementById("resetZoomBtn");
let textNodeContainer = document.getElementById("textNodeContainer");

// let wamoArray = [];
changeMapBtn.onclick = () => {
  changeLayer();
};
resetZoomBtn.onclick = () => {
  resetZoom();
};

function getData() {
  //every second the html Content will be updated
  setInterval(async () => {
    const response = await fetch("/data", { method: "GET" });
    let isContentEmpty = response.headers.get("Content-Length") === "0";
    if (isContentEmpty) {
      updateHTML("no-content");
      return;
    }
    const data = await response.json();
    updateHTML(data);
  }, 1000);
}
getData();

function getWeather() {
  setInterval(async () => {
    const response = await fetch("/weather", { method: "GET" });
    let isContentEmpty = response.headers.get("Content-Length") === "0";
    if (isContentEmpty) {
      updateHTML("no-content");
      return;
    }
    const weatherData = await response.json();
    setWeather(weatherData);
  }, 1000);
}
getWeather();
weatherBtn.addEventListener("click", () => {
  displayDescriptionElement(weatherDescriptionBox);
});

function setWeather(weather) {
  document.getElementById("closeWeather").onclick = () => {
    weatherDescriptionBox.state = "open";
    displayDescriptionElement(weatherDescriptionBox);
  };
  // console.log(weather);
  document.getElementsByClassName(
    "weather-description-element-container"
  )[0].innerHTML =
    "<p>Temp: " +
    weather.current.temp_c +
    "°C</p>\n<p>Wind: " +
    weather.current.wind_kph +
    "km/h</p>\n<p>Niederschlag: " +
    weather.current.precip_mm +
    "mm</p>\n<p>Feuchtigkeit: " +
    weather.current.humidity +
    "%</p>\n<p>Bewölkung: " +
    weather.current.cloud +
    "%</p>\n<p>Sichtweite: " +
    weather.current.vis_km +
    "km</p>";
  // console.log(weatherDescriptionBox);
}

async function updateHTML(data) {
  switch (data) {
    case "no-content":
      //data is empty
      break;
    default:
      // console.log(data);
      showData(data);

      //send something back?
      // let obj = {
      //   name: "daten lol",
      // };
      // setTimeout(sendBack(JSON.stringify(obj)), 3000);
      break;
  }
}

function showData(data) {
  for (let i in data) {
    let el = document.createElement("div");
    let elName = document.createElement("a");
    let elWaterLvl = document.createElement("p");
    let elWaterLvlStateContainer = document.createElement("div");
    let elWaterLvlState = document.createElement("div");

    elName.innerHTML = "no wamo";
    elWaterLvl.innerHTML = "water level:";

    el.classList.add("wamo-container");
    elName.classList.add("wamo-container-headline");
    elWaterLvl.classList.add("wamo-container-text");
    elWaterLvlStateContainer.classList.add("wamo-container-waterlvl-container");
    elWaterLvlState.classList.add("wamo-container-waterlvl");

    elWaterLvlStateContainer.appendChild(elWaterLvlState);
    el.appendChild(elName);
    el.appendChild(elWaterLvl);
    el.appendChild(elWaterLvlStateContainer);

    // console.log(data[i]);
    // console.log(data);
    changeWamoMarkers(data);

    if (textNodeContainer.children.length < data.length) {
      textNodeContainer.appendChild(el);
    } else if (textNodeContainer.children.length > data.length) {
      textNodeContainer.removeChild(el);
    } else {
      //update the text stuff
      textNodeContainer.children[i].children[0].innerHTML =
        "Wamo " + (Number(i) + 1);
      textNodeContainer.children[i].children[0].addEventListener(
        "click",
        () => {
          goTowamo(i);
        }
      );
      textNodeContainer.children[i].children[1].innerHTML =
        "water level: " + data[i].waterLevel.toString();

      textNodeContainer.children[i].children[2].children[0].title =
        data[i].waterLevelState.toString();
      textNodeContainer.children[
        i
      ].children[2].children[0].style.backgroundColor =
        data[i].waterLevelState.toString();
      for (j in textNodeContainer.children[i].children[2].children) {
        textNodeContainer.children[i].children[2].children[j].onclick = () => {
          displayDescriptionElement(waterLevelStateDescriptionBox);
        };
      }
      document.getElementById("closeStatus").onclick = () => {
        waterLevelStateDescriptionBox.state = "open";
        displayDescriptionElement(waterLevelStateDescriptionBox);
      };
    }
  }
}

function displayDescriptionElement(obj) {
  if (obj.state === "open") {
    obj.classList.remove("show");
    obj.classList.add("hide");

    obj.state = "close";
  } else {
    obj.state = "open";
    obj.classList.remove("hide");
    obj.classList.add("show");
  }
}

function goTowamo(id) {
  console.log(id);
  //the map routes to the wamo with the following id
}

async function sendBack(json) {
  //https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  //https://expressjs.com/en/guide/routing.html
  fetch("/ressource", {
    method: "POST",
    body: json,
    headers: {
      "Content-Type": "application/json",
    },
  }).then(function (response) {
    return response.json();
  });
}
