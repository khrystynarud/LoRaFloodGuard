const mymap = L.map("mapid").setView([50.141667, 9.127778], 14.1);
let token =
  "pk.eyJ1IjoibG9yYXdhbi1lcmF5dGVzdCIsImEiOiJja3ZhdXZ5ejAyMnFqMnRva2h1anNqMW40In0.rP5saP4bocjd04pIpVkIPw";

streets = ["mapbox/streets-v11", "satellite-v9"];
L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: streets[0],
    tileSize: 512,
    zoomOffset: -1,
    accessToken: token,
  }
).addTo(mymap);
