// Pre-calculate constants for distance calculation
const DEG_TO_RAD = Math.PI / 180;

function getDistanceBetweenTwoPoints(cord1, cord2) {
  if (cord1.lat === cord2.lat && cord1.lon === cord2.lon) {
    return 0;
  }

  const radLat1 = DEG_TO_RAD * cord1.lat;
  const radLat2 = DEG_TO_RAD * cord2.lat;
  const deltaLon = DEG_TO_RAD * (cord1.lon - cord2.lon);

  let dist =
    Math.sin(radLat1) * Math.sin(radLat2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(deltaLon);

  dist = Math.acos(Math.min(dist, 1));
  dist = (dist * 180) / Math.PI;
  dist *= 60 * 1.1515 * 1.609344; // Convert miles to km
  return dist;
}

// function to create a loading div
function createDiv(className = "loading", text = "Loading...") {
  const div = document.createElement("div");
  const span = document.createElement("span");
  div.className = className;
  span.innerHTML = text;
  div.appendChild(span);
  return div;
}

function handleSearchText(data, where) {
  data = data.trim();
  let output = '';
  switch (where) {
    case "home":
      // split at the second comma
      output = data.match(/[^,]+,[^,]+/g)[0];
      break;
    default:
      output = data;
      break;
  }
  return output;
}

// function to get the text from the divs with className location,
// split it at the comma and get the coordinates from the file ie.json
function getCoordinates() {
  const cord1 = { // Dublin Coordinates
    lat: 53.349805,
    lon: -6.26031
  };
  // get my coordinates
  navigator.geolocation.getCurrentPosition(function (position) {
    cord1.lat = position.coords.latitude;
    cord1.lon = position.coords.longitude;
  });

  let mainDiv = document.querySelector("#recent-ads");
  let page = "home";

  console.log(window.location.pathname.split("/")[1]);
  switch (window.location.pathname.split("/")[1]) {
    case "member":
      mainDiv = document.querySelector("#watchlist_search_results");
      page = "home";
      break;
    case "for-sale":
      mainDiv = document.querySelector("#search_content");
      page = "for-sale";
      break;
    default:
      mainDiv = document.querySelector("#recent-ads");
      page = "home";
      break;
  }
  const locations = mainDiv.querySelectorAll(".location");

  if (locations.length) {
    for (let i = 0; i < locations.length; i++) {
      const location = locations[i].innerText;
      locations[i].appendChild(createDiv());
      for (let j = 0; j < areasData.length; j++) {
        if (areasData[j].name === handleSearchText(location, page)) {
          const cord2 = {
            lat: areasData[j].lat,
            lon: areasData[j].lng
          };
          const distance = getDistanceBetweenTwoPoints(cord1, cord2).toFixed(2);
          locations[i].removeChild(locations[i].lastChild);
          const newDiv = createDiv(`distance`, distance + " km");
          locations[i].appendChild(newDiv);
          newDiv.querySelector("span").style.left = distance / 2 + "px";
          break;
        }
      }
    }
    const allLoading = mainDiv.querySelectorAll(".loading");
    for (let i = 0; i < allLoading.length; i++) {
      const span = allLoading[i];
      span.innerHTML = "Not found";
      span.className = "not-found";
    }
  }
}

getCoordinates();