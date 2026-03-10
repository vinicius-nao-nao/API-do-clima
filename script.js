const apiKey = "5ee67f1558efde1856fa7d2905b07719"; // COLOQUE SUA CHAVE AQUI

const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search-btn");
const geoBtn = document.querySelector("#geo-btn");
const weatherCard = document.querySelector("#weather-card");
const cityName = document.querySelector("#city-name");
const temperature = document.querySelector("#temperature");
const description = document.querySelector("#description");
const weatherIcon = document.querySelector("#weather-icon");
const errorMessage = document.querySelector("#error-message");

// Variáveis para o Mapa
let map;
let marker;

// FUNÇÃO: BUSCAR DADOS
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
        
        // Atualiza o mapa com as coordenadas da cidade
        updateMap(data.coord.lat, data.coord.lon);

    } catch (err) {
        showError();
    }
}

// FUNÇÃO: EXIBIR DADOS
function displayWeather(data) {
    errorMessage.classList.add("hidden");
    weatherCard.classList.remove("hidden");

    cityName.innerText = `${data.name}, ${data.sys.country}`;
    temperature.innerText = `${Math.round(data.main.temp)}°C`;
    description.innerText = data.weather[0].description;
    
    const iconCode = data.weather[0].icon;
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${iconCode}@2x.png`);
}

// FUNÇÃO: ATUALIZAR MAPA (Leaflet)
function updateMap(lat, lon) {
    // Se o mapa ainda não existe, cria ele
    if (!map) {
        map = L.map('map').setView([lat, lon], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);
        marker = L.marker([lat, lon]).addTo(map);
    } else {
        // Se já existe, apenas move para a nova cidade
        map.setView([lat, lon], 13);
        marker.setLatLng([lat, lon]);
    }
}

function saveToLocalStorage(data) {
    localStorage.setItem("clima_salvo", JSON.stringify(data));
}

function showError() {
    weatherCard.classList.add("hidden");
    errorMessage.classList.remove("hidden");
}

// EVENTOS
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=pt_br&appid=${apiKey}`;
        fetchWeather(url);
    }
});

geoBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${apiKey}`;
            fetchWeather(url);
        });
    }
});

cityInput.addEventListener("keypress", (e) => { if (e.key === "Enter") searchBtn.click(); });

// CARREGAR AO INICIAR
window.onload = () => {
    const savedData = localStorage.getItem("clima_salvo");
    if (savedData) {
        const data = JSON.parse(savedData);
        displayWeather(data);
        updateMap(data.coord.lat, data.coord.lon);
    }
};