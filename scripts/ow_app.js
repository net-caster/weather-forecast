/* -------------------------------------------------------- */

/* ---------------- Define global variables --------------- */

const input = document.querySelector('input[name="searchbar"]');
const cityList = document.querySelector('ul');
const errorMsg = document.getElementById('error');
const errorDiv = document.querySelector('div.error-div');

/* ---------- Store API information ----------- */

const apiKey = '&APPID=2359672f89e1414ca7dce9d3017adc69';
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?id=`;
const iconUrl = 'http://openweathermap.org/img/w/';

/* ------------- Set info-box variables --------------- */

const weatherBox = document.getElementById('weather-container');

const cityLocation = document.getElementById('location');

const iconCanvas = document.getElementById('icon');
const tempDisplay = document.getElementById('temp');
const degreeSymbol = document.getElementById('degree');

const maxTemp = document.getElementById('max-temp');
const minTemp = document.getElementById('min-temp');

const summary = document.getElementById('description');

const humidityDisplay = document.getElementById('humidity');
const pressureDisplay = document.getElementById('pressure');

const windSpeed = document.getElementById('windSpeed');
const windDirection = document.getElementById('windDirection');

/* -------------- Define request object ----------------- */

const myInit = {
    method: 'GET',
    header: {
        'Content-Type': 'application/json'
    },
    mode: 'cors',
    cache: 'default'
};

let myRequest = new Request('cities/city.list.json', myInit);

/* -------------- Search and list user input --------------- */

async function getCity(field) {

    const response = await fetch(myRequest);

    const data = await response.json();

    const regex = /\b(?!de|under|upon|la\b)[a-z]+/ig;

    let value = field.value.toLowerCase().replace(regex, match => {
        return match.charAt(0).toUpperCase() + match.slice(1);
    });

    data.forEach(obj => {

        for (let prop in obj) {

            let elem = document.createElement('li');

            if (value === obj[prop] && value !== "") {
                elem.textContent = `${obj[prop]}, ${obj.country}`;
                elem.setAttribute('id', obj.id);
                cityList.appendChild(elem);
            }
        }
    });

    if (cityList.childElementCount === 0) {
        errorDiv.style.display = 'inline';
        errorMsg.textContent = "Please enter a valid location!";
    } else {
        errorDiv.style.display = 'none';
    }

    chooseCity();
}

/* ------------- Choose city ID on click --------------- */

const chooseCity = () => {

    for (let i = 0; i < cityList.children.length; i++) {
        let city = cityList.children[i];
        if (cityList.childElementCount === 1) {
            cityList.innerHTML = "";
            pullData(city.id);
        }
        city.addEventListener('click', () => {
            let cityId = city.id;
            cityList.innerHTML = "";
            pullData(cityId);
        });
    }
}

/* --------------- Pull weather data from openWeatherMap.org -----------------*/

async function pullData(city) {

    const response = await fetch(`${apiUrl}${city}${apiKey}&units=metric`);

    const data = await response.json();

    console.log(data);

    const { temp, pressure, humidity, temp_min, temp_max } = data.main;
    const { description, icon } = data.weather[0];
    const { speed, deg } = data.wind;
    const { country } = data.sys;

    cityLocation.textContent = `${data.name}, ${country}`;
    iconCanvas.setAttribute('src', `${iconUrl}${icon}.png`);
    tempDisplay.textContent = Math.floor(temp);

    maxTemp.textContent = `${temp_max}`;
    minTemp.textContent = `${temp_min}`;

    summary.textContent = `${description}`;

    humidityDisplay.textContent = `${humidity}%`;
    pressureDisplay.textContent = `${pressure} hPa`;

    windSpeed.textContent = `${speed} m/s`;
    windDirection.textContent = `${deg}`;

    weatherBox.style.display = 'flex';

    /* function convertDegrees(tempUnits) {
        return tempUnits * 1.8 + 32;
    }

    // let fahrenheit = temp * 1.8 + 32;

    tempDisplay.addEventListener('click', () => {
        if (degreeSymbol.textContent === 'C') {
            degreeSymbol.textContent = 'F';
            tempDisplay.textContent = Math.floor(convertDegrees(temp));
            maxTemp.textContent = Math.floor(convertDegrees(temp_max));
            minTemp.textContent = Math.floor(convertDegrees(temp_min));

        } else {
            degreeSymbol.textContent = 'C';
            tempDisplay.textContent = Math.floor(temp);
            maxTemp.textContent = `${temp_max}`;
            minTemp.textContent = `${temp_min}`;
        }
        console.log(tempDisplay);
    }); */

}

/* -------------- Convert degrees to wind direction ---------------- */

/* const calculateWindDirection = degree => {
    if (degree > 337.5) return 'North';
    if (degree > 292.5) return 'NorthWest';
    if (degree > 247.5) return 'West';
    if (degree > 202.5) return 'SouthWest';
    if (degree > 157.5) return 'South';
    if (degree > 122.5) return 'SouthEast';
    if (degree > 67.5) return 'East';
    if (degree > 22.5) { return 'NorthEast'; }
    return 'North';
} */

/* -------------- Execute search on "Enter" --------------- */

const executeSearch = field => {

    field.addEventListener('keyup', event => {
        event.preventDefault();
        if (event.keyCode === 13) {
            weatherBox.style.display = 'none';
            cityList.innerHTML = "";
            getCity(field);
        }
    });
};

executeSearch(input);