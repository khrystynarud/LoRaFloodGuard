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

var icons = [
  "symbol-green_circle.svg",
  "symbol-yellow_circle.svg",
  "symbol-red_circle.svg",
];

var myIcon = L.icon({
  iconUrl: icons[1],
  iconSize: [24, 24],
  iconAnchor: [12, 40],
  //popupAnchor: [-3, -76],
});

L.marker([50.13870817817009, 9.132599470135487], { icon: myIcon }).addTo(mymap);
