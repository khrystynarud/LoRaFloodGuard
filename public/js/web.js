let dataArray = [];
let textArray = [];
let waterLevelStateDescriptionState = "close";
let waterLevelStateDescriptionBox = document.getElementById(
  "waterLevelStateDescriptionBox"
);
let textNodeContainer = document.getElementById("textNodeContainer");

let wamoArray = [];

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
    console.log(data.waterLevel);
    updateHTML(data);
  }, 1000);
}
getData();

async function updateHTML(data) {
  switch (data) {
    case "no-content":
      //data is empty
      break;
    default:
      //do something with the data
      if (!wamoArray.includes(data)) {
        wamoArray.push(data);
      }
      showData(wamoArray);
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
          displayWaterLevelStateDescription(waterLevelStateDescriptionState);
        };
      }
      document.getElementsByClassName("close-btn")[0].onclick = () => {
        displayWaterLevelStateDescription("open");
      };
    }
  }
}

function displayWaterLevelStateDescription(state) {
  if (state === "open") {
    // waterLevelStateDescriptionBox.style.display = "none";
    waterLevelStateDescriptionBox.classList.remove("show");
    waterLevelStateDescriptionBox.classList.add("hide");

    waterLevelStateDescriptionState = "close";
  } else {
    waterLevelStateDescriptionState = "open";
    // waterLevelStateDescriptionBox.style.display = "inherit";
    waterLevelStateDescriptionBox.classList.remove("hide");
    waterLevelStateDescriptionBox.classList.add("show");
  }
  console.log(waterLevelStateDescriptionBox);
  // console.log(state);
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
