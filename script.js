document.addEventListener("DOMContentLoaded", function () {
    // HTML elementlerine erişim için değişkenleri tanımla
    const searchForm = document.getElementById("search-form"); // Arama formu
    const cityInput = document.getElementById("city-input"); // Şehir giriş kutusu
    const imgContainer = document.getElementById("img"); // Hava durumu ikonu
    const humidityElement = document.getElementById("humidity"); // Nem bilgisi
    const windElement = document.getElementById("wind"); // Rüzgar bilgisi
    const errorElement = document.getElementById("error-message"); // Hata mesajı
    const timeElement = document.getElementById("time"); // Güncelleme zamanı

    // Hava durumu verilerini güncellemek için kullanılacak aralık (milisaniye cinsinden)
    const refreshInterval = 300000; // Örnek: 5 dakika

    // Hava durumu verilerini çekmek için kullanılacak API anahtarı
    let apiKey = "API_KEY"; // WeatherAPI.com'dan aldığınız API anahtarını buraya ekleyin

    let updateIntervalId; // Hava durumu verilerini düzenli aralıklarla güncellemek için kullanılacak zamanlayıcı

    // Arama formunun gönderilme olayını dinle
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Sayfanın yeniden yüklenmesini önle
        apiKey = "API_KEY"; // API anahtarını güncelle
        clearInterval(updateIntervalId); // Önceki setInterval işlemini temizle
        updateWeatherData(); // Hava durumu verilerini güncelle
        
        // Belirli bir aralıkta hava durumu verilerini güncellemek için setInterval kullan
        updateIntervalId = setInterval(updateWeatherData, refreshInterval);
    });

    // Hava durumu verilerini güncellemek için kullanılan işlev
    function updateWeatherData() {
        const city = cityInput.value; // Kullanıcının girdiği şehir adını al
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
                    // Hava durumu verilerini çıkar
                    const temperatureC = data.current.temp_c;
                    const condition = data.current.condition.text;
                    const img = data.current.condition.icon;
                    const humidity = data.current.humidity;
                    const wind = data.current.wind_kph;
                    const time = new Date().toLocaleString('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

                    errorElement.textContent = ""; // Hata mesajını temizle

                    // HTML elementlerine hava durumu verilerini ekle
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
