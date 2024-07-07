document.addEventListener('DOMContentLoaded', function() {
    // Fetch weather for current location when the page loads
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeatherByCoords(lat, lon);
        }, error => {
            console.error('Error getting location:', error);
        });
    }

    // Fetch weather for user-input location
    document.getElementById('get-weather-btn').addEventListener('click', function() {
        const location = document.getElementById('location-input').value;
        if (location) {
            getWeather(location);
        }
    });
});

function getWeather(location) {
    const apiKey = '93a8cbefec716c9dae6d083701c94a84'; // Replace with your weather API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(`${response.status} ${response.statusText}: ${errorData.message}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('API Response:', data); // Log the API response for debugging
            if (data.cod === 200) {
                updateWeatherInfo(data, 'desired');
            } else {
                document.getElementById('weather-info').innerHTML = '<p>Location not found.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById('weather-info').innerHTML = `<p>Error fetching weather data: ${error.message}</p>`;
        });
}

function getWeatherByCoords(lat, lon) {
    const apiKey = '93a8cbefec716c9dae6d083701c94a84'; // Replace with your weather API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(`${response.status} ${response.statusText}: ${errorData.message}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('API Response:', data); // Log the API response for debugging
            if (data.cod === 200) {
                updateWeatherInfo(data, 'current');
            } else {
                document.getElementById('weather-info').innerHTML = '<p>Location not found.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById('weather-info').innerHTML = `<p>Error fetching weather data: ${error.message}</p>`;
        });
}

function updateWeatherInfo(data, source) {
    const headingElement = document.getElementById('location-heading');
    if (source === 'current') {
        headingElement.textContent = 'Weather at Your Current Location';
    } else {
        headingElement.textContent = 'Weather at Your Desired Location';
    }

    const weatherInfo = `
        <h3>${data.name}, ${data.sys.country}</h3>
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity} %</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
    document.getElementById('weather-info').innerHTML = weatherInfo;
}
