/* -------------------------------------------------------- */

/* ---------------- Define global variables --------------- */

const input = document.querySelector('input[name="searchbar"]');
const cityList = document.querySelector('ul');
const errorMsg = document.getElementById('error');
const errorDiv = document.querySelector('div.error-div');

/* ---------- Store API information ----------- */

const apiKey = '&APPID=2359672f89e1414ca7dce9d3017adc69';
const apiUrlList = `https://api.openweathermap.org/data/2.5/find?q=`;
const apiUrlId = `https://api.openweathermap.org/data/2.5/weather?id=`;
const iconUrl = 'http://openweathermap.org/img/w/';
const proxy = 'https://cors-anywhere.herokuapp.com/';

/* ------------- Set info-box variables --------------- */

const weatherBox = document.getElementById('weather-info');

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

/* -------------- Search and list user input --------------- */

async function getLocationList(field) {
	const regex = /\b(?!de|under|upon|la|in|on\b)[a-z]+/gi;

	let value = field.value.toLowerCase().replace(regex, (match) => {
		return match.charAt(0).toUpperCase() + match.slice(1);
	});

	const response = await fetch(`${apiUrlList}${value}${apiKey}&units=metric`);

	const data = await response.json();

	data.list.forEach((obj) => {
		for (let prop in obj) {
			let elem = document.createElement('li');

			if (value === obj[prop] && value !== '') {
				elem.textContent = `${obj[prop]}, ${obj.sys.country}`;
				elem.setAttribute('id', obj.id);
				cityList.appendChild(elem);
			}
		}
	});

	if (cityList.childElementCount === 0) {
		errorDiv.style.display = 'inline';
		errorMsg.textContent = 'Please enter a valid location!';
	} else {
		errorDiv.style.display = 'none';
	}

	chooseCity();
}

/* --------------- Display weather data from openWeatherMap.org -----------------*/

async function displayCityInfo(idNum) {
	const response = await fetch(`${apiUrlId}${idNum}${apiKey}&units=metric`);

	const city = await response.json();

	const { temp, pressure, humidity, temp_min, temp_max } = city.main;
	const { description, icon } = city.weather[0];
	const { speed, deg } = city.wind;
	const { country } = city.sys;

	cityLocation.textContent = `${city.name}, ${country}`;
	iconCanvas.setAttribute('src', `${iconUrl}${icon}.png`);
	tempDisplay.textContent = Math.floor(temp);

	maxTemp.textContent = Math.floor(temp_max);
	minTemp.textContent = Math.floor(temp_min);

	summary.textContent = `${description}`;

	humidityDisplay.textContent = `${humidity}%`;
	pressureDisplay.textContent = `${pressure} hPa`;

	windSpeed.textContent = `${speed} m/s`;
	windDirection.textContent = `${deg}`;

	weatherBox.style.display = 'flex';
}

/* ------------- Choose city ID on click --------------- */

const chooseCity = () => {
	for (let i = 0; i < cityList.children.length; i++) {
		let city = cityList.children[i];
		if (cityList.childElementCount === 1) {
			cityList.innerHTML = '';
			displayCityInfo(city.id);
		}
		city.addEventListener('click', () => {
			cityList.innerHTML = '';
			displayCityInfo(city.id);
		});
	}
};

/* -------------- Execute search on "Enter" --------------- */

const executeSearch = (field) => {
	field.addEventListener('keyup', (event) => {
		event.preventDefault();
		if (event.keyCode === 13) {
			weatherBox.style.display = 'none';
			cityList.innerHTML = '';
			getLocationList(field);
		}
	});
};

executeSearch(input);
