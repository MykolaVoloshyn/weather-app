import { apiKeyOpenWeatherMap } from "./api_key.js";

document.addEventListener("DOMContentLoaded", () => {
    const apiKey = apiKeyOpenWeatherMap;
    const searchBtn = document.getElementById("search-btn");
    const cityInput = document.getElementById("city-input");
    const widgetContainer = document.getElementById("widget-container");
    const errorMessage = document.getElementById("error-message");

    searchBtn.addEventListener("click", fetchWeather);
    cityInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") fetchWeather();
    });

    /*Fetches weather data from OpenWeatherMap API based on user input and pass the response 
    to displayWeather() function. Throws an error if there's no response.*/
    function fetchWeather() {
        const city = cityInput.value.trim();

        if (city === "") return;

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("City not found");
                }
                return response.json();
            })
            .then((data) => {
                displayWeather(data);
            })
            .catch(() => {
                widgetContainer.classList.add("hidden");
                errorMessage.classList.remove("hidden");
            });
    }

    /*Updates the UI with received weather data.*/
    function displayWeather(data) {
        document.getElementById("city-name").textContent = `${data.name}, ${data.sys.country}`;
        document.getElementById("weather-description").textContent = data.weather[0].description;
        document.getElementById(
            "icon"
        ).src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        document.getElementById("temperature").textContent = `${Math.round(data.main.temp).toFixed(
            1
        )}°F`;
        document.getElementById("main").textContent = data.weather[0].main;
        document.getElementById("wind").textContent = `${data.wind.speed} mph`;
        document.getElementById("humidity").textContent = `${data.main.humidity}%`;
        document.getElementById("pressure").textContent = `${data.main.pressure} hPA`;
        document.getElementById("feels-like").textContent = `${Math.round(
            data.main.feels_like
        ).toFixed(1)}°F`;

        let date = new Date();
        let day = date.toLocaleString("en", { month: "short", day: "2-digit" });
        let time = date.toLocaleString("en", { hour: "2-digit", minute: "2-digit" });

        document.getElementById("current-time").innerHTML = time + "   " + day;

        widgetContainer.classList.remove("hidden");
        errorMessage.classList.add("hidden");
    }
});
