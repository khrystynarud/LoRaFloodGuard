const headline1 = document.getElementById("headline1");

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
      headline1.innerHTML = data;
      break;
    default:
      //do something with the data
      console.log(data);
      let obj = {
        name: "daten lol",
      };
      setTimeout(sendBack(JSON.stringify(obj)), 3000);
      break;
  }
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
