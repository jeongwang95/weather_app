// get weather using zip code
const getWeather = async (zip) => {
    try {
        let response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&appid=cc6355e276041fd2c8bcb64c3c638dd4`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        alert(`${zip} is not a valid zip code. Please try again.`);
    }
    
};

// if user gives access to their location, retrieve their latitude and longitude coordinates
const userLocation = async (position) => {
    const data = await getWeatherCoord(position.coords.latitude, position.coords.longitude);
    weatherData(data.name, kToF(data.main.temp), kToF(data.main.feels_like), kToF(data.main.temp_max), kToF(data.main.temp_min), data.weather[0].description, data.main.humidity, data.wind.speed);
};

const deniedLocation = (error) => console.log(error);

// ask for user location
navigator.geolocation.getCurrentPosition(userLocation, deniedLocation);

// if we have user coordinates, get the weather by using their coordinates
const getWeatherCoord = async (lat, lon) => {
    let response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=cc6355e276041fd2c8bcb64c3c638dd4`);
    console.log(response.data);
    return response.data
}

// show weather data
const weatherData = (city, current, feels, high, low, forecast, humidity, wind) => {
    const html = ` 
                    <p>City: ${city}</p>
                    <p>Temp: ${current}</p>
                    <p>Feels Like: ${feels}</p>
                    <p>High: ${high}</p>
                    <p>Low: ${low}</p>
                    <p>Forecast: ${forecast}</p>
                    <p>Humidity: ${humidity}</p>
                    <p>Wind: ${wind} mph</p>
                `;
    document.querySelector('.weather-data').insertAdjacentHTML('beforeend', html);
};

const form = document.querySelector('#testDataForm')
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    // clear previous data
    document.querySelector('.weather-data').innerHTML = "";

    // get zip code from form
    let zip = document.querySelector('#zipcode').value;
    
    // get the temperature type (C or F) from radio
    let ele = document.getElementsByName('tempType');
    let tempType;
    for (i in ele) {
        if (ele[i].checked) {
            tempType = ele[i].value;
        }
    }

    // get weather data from API using the zip code given from user
    const data = await getWeather(zip);

    if (tempType == 'fahrenheit') {
        weatherData(data.name, kToF(data.main.temp), kToF(data.main.feels_like), kToF(data.main.temp_max), kToF(data.main.temp_min), data.weather[0].description, data.main.humidity, data.wind.speed); 
    } else { // tempType == 'celsius'
        weatherData(data.name, kToC(data.main.temp), kToC(data.main.feels_like), kToC(data.main.temp_max), kToC(data.main.temp_min), data.weather[0].description, data.main.humidity, data.wind.speed); 
    }

});

// kelvin to fahrenheit
function kToF(temp) {
    temp = parseFloat(temp);
    return `${Math.round(((temp-273.15)*1.8)+32)}&deg;F`;
}

// kelvin to celsius
function kToC(temp) {
    temp = parseFloat(temp);
    return `${Math.round(temp-273.15)}&deg;C`;
}