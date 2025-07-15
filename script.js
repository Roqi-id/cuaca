const apiKey = 'c08d81a4edb5e2f261d3bb518c40d939'; // Ganti dengan API key kamu

document.addEventListener("DOMContentLoaded", () => {
  const tanggal = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  document.getElementById("tanggal").innerText = tanggal;
});

function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return alert("Masukkan nama kota!");

  fetchWeatherData(`q=${city}`);
  getForecast(`q=${city}`);
}

function getLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        fetchWeatherData(`lat=${lat}&lon=${lon}`);
        getForecast(`lat=${lat}&lon=${lon}`);
      },
      err => {
        alert("Gagal mendapatkan lokasi.");
      }
    );
  } else {
    alert("Browser tidak mendukung geolokasi.");
  }
}

function fetchWeatherData(query) {
  const url = `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=metric&lang=id`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.cod === 200) {
        const icon = data.weather[0].icon;
        const desc = data.weather[0].description;
        const city = data.name;
        const country = data.sys.country;
        const temp = data.main.temp;
        const hum = data.main.humidity;
        const wind = data.wind.speed;

        document.getElementById("weatherResult").innerHTML = `
          <h2>${city}, ${country}</h2>
          <img src="https://openweathermap.org/img/wn/${icon}@2x.png" class="weather-icon" alt="Icon Cuaca">
          <p><strong>${desc}</strong></p>
          <p>Suhu: ${temp}°C</p>
          <p>Kelembaban: ${hum}%</p>
          <p>Angin: ${wind} m/s</p>
        `;
      } else {
        document.getElementById("weatherResult").innerHTML = "<p>Kota tidak ditemukan.</p>";
      }
    })
    .catch(error => {
      document.getElementById("weatherResult").innerHTML = "<p>Terjadi kesalahan koneksi.</p>";
    });
}

function getForecast(query) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?${query}&appid=${apiKey}&units=metric&lang=id`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      let html = '';

      data.list.forEach(item => {
        if (item.dt_txt.includes("12:00:00")) {
          const date = new Date(item.dt_txt).toLocaleDateString('id-ID', {
            weekday: 'long', day: 'numeric', month: 'long'
          });

          const icon = item.weather[0].icon;
          const temp = item.main.temp;
          const desc = item.weather[0].description;

          html += `
            <div style="margin-bottom:15px">
              <strong>${date}</strong><br/>
              <img src="https://openweathermap.org/img/wn/${icon}@2x.png" width="50"><br/>
              ${desc}, ${temp}°C
            </div>
          `;
        }
      });

      document.getElementById("forecastResult").innerHTML = html;
    })
    .catch(error => {
      document.getElementById("forecastResult").innerHTML = "<p>Gagal memuat prakiraan cuaca.</p>";
    });
}
