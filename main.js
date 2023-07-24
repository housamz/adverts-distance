function getDistanceBetweenTwoPoints(cord1, cord2) {
  if (cord1.lat == cord2.lat && cord1.lon == cord2.lon) {
    return 0;
  }
  const radLat1 = (Math.PI * cord1.lat) / 180;
  const radLat2 = (Math.PI * cord2.lat) / 180;
  const theta = cord1.lon - cord2.lon;
  const radTheta = (Math.PI * theta) / 180;

  let dist =
    Math.sin(radLat1) * Math.sin(radLat2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);

  if (dist > 1) {
    dist = 1;
  }

  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  dist = dist * 1.609344; // convert miles to km
  return dist;
}

// function to create a loading div
function createDiv(className = "loading", text = "Loading...") {
  const div = document.createElement("div");
  div.className = className;
  div.innerHTML = text;
  return div;
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

  const searchContentDiv = document.getElementById("search_content");

  const locations = searchContentDiv.querySelectorAll(".location");
  for (let i = 0; i < locations.length; i++) {
    const location = locations[i].innerText;
    locations[i].appendChild(createDiv());
    for (let j = 0; j < allCities.length; j++) {
      if (allCities[j].name === location) {
        const cord2 = {
          lat: allCities[j].lat,
          lon: allCities[j].lng
        };
        const distance = getDistanceBetweenTwoPoints(cord1, cord2).toFixed(2);
        const colourIndicator =
          distance <= 20 ? "close" :
            distance <= 50 ? "medium" : "far";
        locations[i].removeChild(locations[i].lastChild);
        locations[i].appendChild(createDiv(`found ${colourIndicator}`, distance + " km"));
      }
    }
  }
  const allLoading = searchContentDiv.querySelectorAll(".loading");
  for (let i = 0; i < allLoading.length; i++) {
    const span = allLoading[i];
    span.innerHTML = "Not found";
    span.className = "not-found";
  }
}




getCoordinates();