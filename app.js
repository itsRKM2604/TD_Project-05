// Weather app API key
API_KEY = "1b0e23a85681415fba6192317240802";
API_URL = "https://api.weatherapi.com/v1/current.json?";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

// Function to insert weather data into the HTML
insertData = (obj) => {
  console.log(obj);
  document.getElementById("temp").innerHTML = `${Math.floor(
    obj.current.temp_c
  )}</span><sup>o</sup>C`;
  document.getElementById("location").innerText = obj.location.name;
  date = new Date(obj.current.last_updated);
  month = monthNames[date.getMonth()];

  day = date.getDate();
  time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Icon rendering as per the temperature conditions
  const cloud = obj.current.cloud;
  if (cloud < 20) {
    src = "./resources/001-sun.png";
    weather = "sunny";
  } else if (cloud < 40) {
    src = "./resources/002-cloudy.png";
    weather = "cloudy";
  } else if (cloud < 60) {
    src = "./resources/003-rain.png";
    weather = "partly cloudy";
  } else if (cloud < 80) {
    src = "./resources/004-rainy.png";
    weather = "Rainy";
  } else {
    src = "./resources/005-stromy.png";
    weather = "Heavy Rain";
  }
  document.getElementById("icon").src = src;

  // Display the last update time
  document.getElementById("date").innerText = `${day} ${month} ● ${time}`;
  document.getElementById("weather_condition").innerHTML = `${weather}`;

  // Wind speed
  document.getElementById("wind_speed").innerHTML =
    obj.current.wind_kph + " Kph";

  // humidity
  document.getElementById("humidity").innerHTML = obj.current.humidity + "%";
};

// Function to get the user's location and fetch weather data
getLocation = async () => {
  var q;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      q = `${lat},${lon}`;
      //   q = "England";
      link = `${API_URL}` + `key=${API_KEY}&q=${q}`;
      var request = new XMLHttpRequest();
      request.open("GET", link, true);
      request.send();

      request.onload = function () {
        var obj = JSON.parse(this.response);
        insertData(obj);
      };
    });
  }
};

// Load the weather data when the window loads
window.onload = () => {
  document.getElementById("location").innerText = "Loading...";
  document.getElementById("temp").innerHTML = "Loading...";
  document.getElementById("icon").src = "./resources/";
  document.getElementById("date").innerText = "Loading...";
  getLocation();
};

var form = document.getElementById("form");
handleSearchForm = (event) => {
  event.preventDefault();
  searchLocationWeather();
};
form.addEventListener("submit", handleSearchForm);

var refreshForm = document.getElementById("refreshForm");
handleRefreshForm = (event) => {
  event.preventDefault();
  getLocation();
};
refreshForm.addEventListener("submit", handleRefreshForm);

// Function to search for weather data based on user input
searchLocationWeather = () => {
  let city = document.getElementById("city").value;
  if (city === "") {
    document.getElementById("message").innerText = "Please enter a city name";
  } else {
    document.getElementById("message").innerText = "";
    link = `${API_URL}` + `key=${API_KEY}&q=${city}`;
    var request = new XMLHttpRequest();
    request.open("GET", link, true);
    request.send();

    request.onload = function () {
      if (this.status === 200) {
        var obj = JSON.parse(this.response);
        insertData(obj);
      } else {
        document.getElementById("message").innerText =
          "City not found. Please try again.";
      }
    };
  }
};
