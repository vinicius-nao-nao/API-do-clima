// CONFIGURAÇÃO - COLOQUE SUA CHAVE ABAIXO
const apiKey = "5ee67f1558efde1856fa7d2905b07719"; 

const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search-btn");
const geoBtn = document.querySelector("#geo-btn");
const weatherCard = document.querySelector("#weather-card");
const cityName = document.querySelector("#city-name");
const temperature = document.querySelector("#temperature");
const description = document.querySelector("#description");
const weatherIcon = document.querySelector("#weather-icon");
const errorMessage = document.querySelector("#error-message");

// 1. FUNÇÃO PRINCIPAL: BUSCAR DADOS (Por Cidade ou Coordenadas)
async function fetchWeather(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== 200) {
            showError();
            return;
        }

        displayWeather(data);
        saveToLocalStorage(data);
    } catch (err) {
        showError();
    }
}

// 2. EXIBIR NA TELA
function displayWeather(data) {
    errorMessage.classList.add("hidden");
    weatherCard.classList.remove("hidden");

    cityName.innerText = `${data.name}, ${data.sys.country}`;
    temperature.innerText = `${Math.round(data.main.temp)}°C`;
    description.innerText = data.weather[0].description;
    
    const iconCode = data.weather[0].icon;
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${iconCode}@2x.png`);
}

// 3. SALVAR NO LOCALSTORAGE
function saveToLocalStorage(data) {
    localStorage.setItem("clima_salvo", JSON.stringify(data));
}

// 4. MOSTRAR ERRO
function showError() {
    weatherCard.classList.add("hidden");
    errorMessage.classList.remove("hidden");
}

// --- EVENTOS ---

// Busca por Nome da Cidade
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=pt_br&appid=${apiKey}`;
        fetchWeather(url);
    }
});

// Desafio 2: Busca por Geolocalização (GPS)
geoBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${apiKey}`;
            fetchWeather(url);
        }, () => {
            alert("Não foi possível acessar sua localização. Verifique as permissões.");
        });
    }
});

// Busca ao apertar Enter
cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchBtn.click();
});

// Pulo do Gato: Carregar última busca ao abrir a página
window.onload = () => {
    const savedData = localStorage.getItem("clima_salvo");
    if (savedData) {
        const data = JSON.parse(savedData);
        displayWeather(data);
    }
};