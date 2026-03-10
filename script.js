// CONFIGURAÇÕES
const apiKey = "5ee67f1558efde1856fa7d2905b07719"; // Substitua pela sua chave do OpenWeatherMap
const units = "metric";
const lang = "pt_br";

// ELEMENTOS DO DOM
const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search-btn");
const weatherCard = document.querySelector("#weather-card");
const cityName = document.querySelector("#city-name");
const temperature = document.querySelector("#temperature");
const description = document.querySelector("#description");
const weatherIcon = document.querySelector("#weather-icon");
const errorMessage = document.querySelector("#error-message");

// FUNÇÃO: Buscar dados da API
async function getWeatherData(city) {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&lang=${lang}&appid=${apiKey}`;

    try {
        const response = await fetch(apiURL);
        const data = await response.json();

        if (data.cod === "404") {
            showError();
            return;
        }

        displayWeather(data);
        saveToLocalStorage(data);
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
    }
}

// FUNÇÃO: Exibir dados na tela
function displayWeather(data) {
    errorMessage.classList.add("hidden");
    weatherCard.classList.remove("hidden");

    cityName.innerText = `${data.name}, ${data.sys.country}`;
    temperature.innerText = `${Math.round(data.main.temp)}°C`;
    description.innerText = data.weather[0].description;
    
    const iconCode = data.weather[0].icon;
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${iconCode}@2x.png`);
}

// FUNÇÃO: Salvar no LocalStorage
function saveToLocalStorage(data) {
    localStorage.setItem("clima_salvo", JSON.stringify(data));
}

// FUNÇÃO: Erro
function showError() {
    weatherCard.classList.add("hidden");
    errorMessage.classList.remove("hidden");
}

// EVENTO: Clique no Botão
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) getWeatherData(city);
});

// EVENTO: Tecla Enter
cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const city = cityInput.value.trim();
        if (city) getWeatherData(city);
    }
});

// EVENTO: Ao carregar a página (Fase 4 - O Pulo do Gato)
window.onload = () => {
    const savedData = localStorage.getItem("clima_salvo");
    if (savedData) {
        const data = JSON.parse(savedData);
        displayWeather(data);
    }
};