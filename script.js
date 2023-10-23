document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.getElementById("search-form");
    const cityInput = document.getElementById("city-input");
    const imgContainer = document.getElementById("img");
    const humidityElement = document.getElementById("humidity");
    const windElement = document.getElementById("wind");
    const errorElement = document.getElementById("error-message");
    const timeElement = document.getElementById("time");

    // Hava durumu verilerini güncellemek için kullanılacak aralık (milisaniye cinsinden)
    const refreshInterval = 1000;

    let apiKey = "API_KEY"; // WeatherAPI.com'dan aldığınız API anahtarını buraya ekleyin
    let updateIntervalId;

    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        apiKey = "API_KEY"; // API anahtarını güncelleyin
        clearInterval(updateIntervalId); // Önceki setInterval işlemini temizle
        updateWeatherData();
        
        // Belirli bir aralıkta hava durumu verilerini güncellemek için setInterval kullan
        updateIntervalId = setInterval(updateWeatherData, refreshInterval);
    });

    function updateWeatherData() {
        const city = cityInput.value;
        const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&lang=tr&aqi=no`;

        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    errorElement.textContent = "Hata: Belirtilen şehir bulunamadı. Lütfen geçerli bir şehir adı girin.";
                    // Diğer verileri temizle
                    document.getElementById("temperature").textContent = "";
                    document.getElementById("condition").textContent = "";
                    document.getElementById("humidity").textContent = "";
                    document.getElementById("wind").textContent = "";
                    imgContainer.innerHTML = "";
                } else {
                    const temperatureC = data.current.temp_c;
                    const condition = data.current.condition.text;
                    const img = data.current.condition.icon;
                    const humidity = data.current.humidity;
                    const wind = data.current.wind_kph;
                    const time = new Date().toLocaleString('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

                    errorElement.textContent = "";

                    document.getElementById("temperature").textContent = `${temperatureC}°C`;
                    document.getElementById("condition").textContent = `${condition}`;
                    document.getElementById("humidity").innerHTML = `<i class="fa-solid fa-droplet"></i> ${humidity}% <br> <span class="icon-p">Nem</span>`;
                    document.getElementById("wind").innerHTML = `<i class="fas fa-wind"></i>  ${wind} km/saat <br> <span class="icon-p">Rüzgar Hızı</span> `;
                    timeElement.textContent = time;

                    imgContainer.innerHTML = `<img src="${img}" alt="Hava Durumu İcon"></img>`;
                }
            })
            .catch((error) => console.error("Hava durumu verileri alınamadı.", error));
    }
});
