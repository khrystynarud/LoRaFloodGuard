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
L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: streets[3],
    tileSize: 512,
    zoomOffset: -1,
    accessToken: token,
  }
).addTo(mymap);


let pathToPositions = "./src/positions.json";


var marker = new Array();

  
function deleteMarker() {
  for(i=0;i<marker.length;i++) {
      map.removeLayer(marker[i]);
    }  
}

function changeVamoMarkers(vamos) {
  //deleteMarker();
  for (let i in vamos) {
    lat = vamos[i].latitude;
    lon = vamos[i].longitude;
    color =  vamos[i].waterLevelState.toString();
    //var vamoMarker = new L.circleMarker([lat, lon], {color: 'black', opacity: 1.0, fillColor: color, fillOpacity: 1.0})
    var vamoMarker = new L.circleMarker([50.138633, 9.153963], {color: 'black', opacity: 1.0, fillColor: 'red', fillOpacity: 1.0}).addTo(map)
    marker.push(vamoMarker);
    //map.addLayer(vamoMarker);
  } 


//{
  //"0": { "latitude": 50.138633, "longitude": 9.153963},
  //"1": { "latitude": 50.143919, "longitude": 9.171477},
  //"2": { "latitude": 50.135674, "longitude": 9.168664},
  //"3": { "latitude": 50.131906, "longitude": 9.157473}, 
  //"4": { "latitude": 50.146768, "longitude": 9.141005}
//}
}
