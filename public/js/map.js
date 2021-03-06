// References https://leafletjs.com/examples/quick-start/
//https://docs.mapbox.com/api/maps/styles/

const mymap = L.map("mapid").setView(
  [50.13870817817009, 9.132599470135487],
  14.1
);
let token =
  "pk.eyJ1IjoibG9yYXdhbi1lcmF5dGVzdCIsImEiOiJja3ZhdXZ5ejAyMnFqMnRva2h1anNqMW40In0.rP5saP4bocjd04pIpVkIPw";

streets = [
  "mapbox/streets-v11",
  "mapbox/satellite-v9",
  "mapbox/dark-v10",
  "lorawan-eraytest/ckvc60hx508t714l8pg69tz1u",
];
let currentStyle = 3;

let currentLayer = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: streets[currentStyle],
    tileSize: 512,
    zoomOffset: -1,
    accessToken: token,
  }
).addTo(mymap);

let pathToPositions = "./src/positions.json";

var marker = new Array();

function deleteMarker() {
  for (i = 0; i < marker.length; i++) {
    mymap.removeLayer(marker[i]);
  }
}

function changeWamoMarkers(wamos) {
  deleteMarker();
  for (let i in wamos) {
    lat = wamos[i].latitude;
    lon = wamos[i].longitude;
    color = wamos[i].waterLevelState.toString();
    let wamoMarker = new L.circleMarker([lat, lon], {
      color: "black",
      opacity: 1.0,
      fillColor: color,
      fillOpacity: 1.0,
    });
    marker.push(wamoMarker);
    wamoMarker.on("click", function (e) {
      mymap.setView([e.latlng.lat, e.latlng.lng], 25);
    });
    mymap.addLayer(wamoMarker);
  }
}

function changeLayer() {
  currentStyle++;
  if (currentStyle > streets.length - 1) {
    currentStyle = 0;
  }
  mymap.removeLayer(currentLayer);
  currentLayer = L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: streets[currentStyle],
      tileSize: 512,
      zoomOffset: -1,
      accessToken: token,
    }
  ).addTo(mymap);
}

function resetZoom() {
  mymap.setView([50.13870817817009, 9.132599470135487], 14.1);
}
