/* Global Variables */
const baseURL = "https://api.openweathermap.org/data/2.5/weather?zip=";
const key = "&appid=8bdf4e9007c1ffae245275bbd3020d7a&units=metric";

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + "." + d.getDate() + "." + d.getFullYear();

document.querySelector("#generate").addEventListener("click", () => {
  const zipCode = document.getElementById("zip").value;
  if (!isNaN(zipCode)) {
    const userInput = document.getElementById("feelings").value;
    if (userInput !== "") {
      getWeather(baseURL, zipCode, key, userInput).then(function (data) {
        postWeather("/", data).then(function (data) {
          updateUI(data);
        });
      });
    } else {
      alert("Please enter your feeling.");
    }
  } else {
    alert("Zip-code must be a number.");
  }
});

const getWeather = async (baseURL, zipCode, key, userInput) => {
  const res = await fetch(baseURL + zipCode + key);

  try {
    const data = await res.json();
    const appData = {
      temp: data.main["temp"],
      date: newDate,
      userResponse: userInput,
    };
    return appData;
  } catch (error) {
    alert("Invalid zip-code");
    location.reload();
  }
};

const postWeather = async (url = "", data = {}) => {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  try {
    const newData = await response.json();
    return newData;
  } catch (error) {
    console.log("error: ", error);
  }
};

const updateUI = async (data) => {
  const response = await fetch("/all");
  try {
    const allData = await response.json();
    document.getElementById("date").innerHTML = `Date: ${allData.date}`;
    document.getElementById("temp").innerHTML = `Temp: ${allData.temp}`;
    document.getElementById(
      "content"
    ).innerHTML = `Content: ${allData.userResponse}`;
  } catch (error) {
    console.log("error: ", error);
  }
};
