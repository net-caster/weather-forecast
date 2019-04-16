/* 
 * Global Variables -----------------------------------
 */
const container = document.querySelector('.container');
const input = document.querySelector('input[name="searchbar"]');
/* 
 * OpenWeatherMap API URLs ----------------------------
 */
const apiKey = '&APPID=2359672f89e1414ca7dce9d3017adc69';
const apiUrlList = `https://api.openweathermap.org/data/2.5/find?q=`;
const apiUrlId = `https://api.openweathermap.org/data/2.5/weather?id=`;
const iconUrl = 'http://openweathermap.org/img/w/';
/* 
 * Get search query list ------------------------------
 */
const getLocationList = async (field) => {
	const regex = /\b(?!de|under|upon|la|in|on\b)[a-z]+/gi;

	let value = field.value.toLowerCase().replace(regex, (match) => {
		return match.charAt(0).toUpperCase() + match.slice(1);
	});

	const response = await fetch(`${apiUrlList}${value}${apiKey}&units=metric`);

	const locationsList = await response.json();

	container.innerHTML = `${renderList(locationsList)}`;

	const ulList = document.querySelector('.locations-list');

	chooseLocation(ulList);
};
/* 
* Get info from selected location ------------------------
*/
const getLocationInfo = async (idNum) => {
	const response = await fetch(`${apiUrlId}${idNum}${apiKey}&units=metric`);

	const locationData = await response.json();

	renderWeatherInfo(locationData);
};
/* 
* Render search results list if present -------------------
*/
const renderList = (data) => {
	const errorMessage = 'Please enter a valid location!';

	if (data.list.length === 0) {
		return `<div class="list-container">
                    <span class="error-message">${errorMessage}</span>
                </div>`;
	}
	return `<div class="list-container">
                <ul class="locations-list">
                    ${data.list
						.map((location) => `<li id=${location.id}>${location.name}, ${location.sys.country}</li>`)
						.join('')}
                </ul>
            </div>`;
};
/* 
* Render location info -------------------------------------
*/
const renderWeatherInfo = (data) => {
	const { temp, pressure, humidity, temp_min, temp_max } = data.main;
	const { description, icon } = data.weather[0];
	const { speed, deg } = data.wind;
	const { country } = data.sys;

	container.innerHTML = `
        <div class="weather-container">
            <div class="weather-info">
                <h1 class="weather-info__title">Current Weather in <span class="weather-info__location">${data.name}, ${country}</span></h1>

                <div class="weather-info__temp">
                    <div class="temp-container">
                        <img class="icon" src="${iconUrl}${icon}.png"/>
                        <h2 class="temperature">${Math.floor(temp)}</h2>
                        <span class="symbol">&deg;</span><span class="degree">C</span>
                    </div>

                    <div class="minmax-container">
                        <p class="minmax">High: <span class="max-temp">${Math.floor(temp_max)}</span></p>
                        <p class="minmax">Low: <span class="min-temp">${Math.floor(temp_min)}</span></p>
                    </div>
                </div>
                    
                <span class="weather-info__description">${description}</span>

                <div class="weather-info__misc">
                    <div class="misc-info__1">
                        <p class="misc-p">Humidity</p>
                        <p class="humidity">${humidity}%</p>
                        <p class="misc-p">Wind speed</p>
                        <p class="windSpeed">${speed} m/s</p>
                    </div>

                    <div class="misc-info__2">
                        <p class="misc-p">Pressure</p>
                        <p class="pressure">${pressure} hPa</p>
                        <p class="misc-p">Wind direction</p>
                        <p class="windDirection">${deg}</p>
                    </div>
                </div>
            </div>
        </div>
    `;

	toggleTemperature(temp, temp_min, temp_max);
};
/* 
* Temperature conversion functions ----------------------------
*/
const convertTemperature = (units) => {
	return units * 1.8 + 32;
};

const toggleTemperature = (temp, min, max) => {
	const toggleTemp = document.querySelector('.temp-container');
	const tempDisplay = document.querySelector('.temperature');
	const maxDisplay = document.querySelector('.max-temp');
	const minDisplay = document.querySelector('.min-temp');
	const degreeDisplay = document.querySelector('.degree');

	toggleTemp.addEventListener('click', () => {
		if (degreeDisplay.textContent === 'C') {
			degreeDisplay.textContent = 'F';
			tempDisplay.textContent = Math.floor(convertTemperature(temp));
			maxDisplay.textContent = Math.floor(convertTemperature(max));
			minDisplay.textContent = Math.floor(convertTemperature(min));
		} else {
			degreeDisplay.textContent = 'C';
			tempDisplay.textContent = Math.floor(temp);
			maxDisplay.textContent = Math.floor(max);
			minDisplay.textContent = Math.floor(min);
		}
	});
};
/* 
* Choose location from list ----------------------------------
*/
const chooseLocation = (list) => {
	for (let i = 0; i < list.children.length; i++) {
		let location = list.children[i];
		if (list.childElementCount === 1) {
			container.innerHTML = '';
			getLocationInfo(location.id);
		}
		location.addEventListener('click', () => {
			getLocationInfo(location.id);
		});
	}
};
/*
* Execute search on "Enter" ---------------------------------
*/
const executeSearch = (field) => {
	field.addEventListener('keyup', (event) => {
		event.preventDefault();
		if (event.keyCode === 13) {
			getLocationList(field);
		}
	});
};

executeSearch(input);
