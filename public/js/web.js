let dataArray = [];
let textArray = [];
let textNodeContainer = document.getElementById("textNodeContainer");

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

async function updateHTML(data) {
  switch (data) {
    case "no-content":
      //data is empty
      break;
    default:
      //do something with the data
      showData(data);
      // let obj = {
      //   name: "daten lol",
      // };
      // setTimeout(sendBack(JSON.stringify(obj)), 3000);
      break;
  }
}

/*
1. Array erstellen
2. Alle objekte in Array einfügen

3. object id = array
*/

function showData(data) {
  // console.log(data);
  // for (i in data) {
  //   let id = data[i].id;
  //   dataArray[id] = data[i];
  // }
  // console.log(dataArray);
  // console.log(dataArray[0]);

  for (let i in data) {
    let el = document.createElement("div");
    let elName = document.createElement("a");
    let elWaterLvl = document.createElement("p");
    let elWaterLvlStateContainer = document.createElement("div");
    let elWaterLvlState = document.createElement("div");

    elName.innerHTML = "no vamo";
    elWaterLvl.innerHTML = "water lvl:";

    el.classList.add("vamo-container");
    elName.classList.add("vamo-container-headline");
    elWaterLvl.classList.add("vamo-container-text");
    elWaterLvlStateContainer.classList.add("vamo-container-waterlvl-container");
    elWaterLvlState.classList.add("vamo-container-waterlvl");

    elWaterLvlStateContainer.appendChild(elWaterLvlState);
    el.appendChild(elName);
    el.appendChild(elWaterLvl);
    el.appendChild(elWaterLvlStateContainer);

    // console.log(data.length);
    if (textNodeContainer.children.length < data.length) {
      textNodeContainer.appendChild(el);
    } else if (textNodeContainer.children.length > data.length) {
      textNodeContainer.removeChild(el);
    } else {
      // textNodeContainer.children[i].innerHTML = data[i].waterLevel.toString();
      textNodeContainer.children[i].children[0].innerHTML =
        "Wamo " + (Number(i) + 1);
      textNodeContainer.children[i].children[1].innerHTML =
        "water lvl: " + data[i].waterLevel.toString();
      // textNodeContainer.children[i].children[2].style.backroundColor =
      //   data[i].waterLevelState.toString();
      // console.log(data[i].waterLevelState.toString());
      // console.log(textNodeContainer.children[i].children[2]);
      // textNodeContainer.children[i].children[0].innerHTML =
      // "vamo: " + data[i].waterLevel.toString();
      // console.log(textNodeContainer.children.length);
    }
    // for (let i = 0; i < textNodeContainer.children.length; i++) {
    //   console.log(textNodeContainer.children[i]);
    // }
  }
  // } else {
  // document.body.replaceChild(textArray[i], textArray[i]);
  // } else {
  // console.log(textArray[i].innerHTML);
  // }
}
// console.log(textArray);

// for (let i = 0; i < dataArray.length; i++) {

// document.body.appendChild(textArray[i]);
// textArray[i].innerHTML = data[i].waterLevel.toString();

// el.attributes.id = data[i].id;
// el.innerHTML = dataArray[i].waterLevel.toString();
// console.log(data[i].waterLevel.toString());
// }

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
