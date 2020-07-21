const burgerButton = document.querySelector('#burger-icon');
const asideMenu = document.querySelector('#asideMenu');
const closeMenuButton = document.querySelector('#closeMenuButton');
const backdrop = document.querySelector('.backdrop-none');
const languageDropdown = document.querySelector('#languageSelect');
const fourCities = document.querySelector('#fourCities');
const searchButton = document.querySelector('#searchButton');
const weatherSection1 = document.querySelector('#weatherSection1');
const weatherSection4 = document.querySelector('#weatherSection4');
const form = document.querySelector('#search');
const units = document.querySelectorAll('.units');
const options = document.querySelectorAll('.option');

let selectedDegree = '';
let degreeSign = 'K';
let selectedlanguage = 'en';

const daysInWeek = [
    'MONDAY','TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'
];

for (let i = 0; i < units.length; i++) {
    units[i].addEventListener('click', (event) => {
        event.preventDefault();
        console.log(event.target.text);
        if(event.target.text === 'Kelvin') {
            selectedDegree = '';
            degreeSign = 'K';
        }
        if(event.target.text === 'Celsius') {
            selectedDegree = 'metric';
            degreeSign = 'C';
        }
        if(event.target.text === 'Fahrenheit') {
            selectedDegree = 'imperial';
            degreeSign = 'F';
        }
        for (let j = 0; j < units.length; j++) {
            if(units[j].textContent !== event.target.text){
                units[j].classList.remove('active');
            }
            if(units[j].textContent === event.target.text) {
                units[j].classList.add('active');
            }
        }
        units[i].classList.add('active');
        fetchCities();
    });
}

languageDropdown.addEventListener('change', (event) => {
    selectedlanguage = event.target.value;
    fetchCities();
});


form.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log(event.target.cityName.value);
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${event.target.cityName.value}&units=${selectedDegree}&lang=${selectedlanguage}&appid=9c81b14491a186c6e3ddb2174eeb4b8e`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            weatherSection4.classList.add('displayNone');
            weatherSection1.classList.remove('displayNone');
            
            const mainH1 = document.querySelector('#mainH1');
            mainH1.textContent = data.city.name.toUpperCase();
            const secondH2 = document.querySelector('#secondH2');
            secondH2.textContent = data.city.country.toUpperCase();

            fillCurrentWeather(data.list[0]);
            calculateTempForNextThreeDays(data.list);
        }).catch(err => {
            console.log(err);
        });
});

function closeSideBar() {
    asideMenu.classList.remove('sideMenuDisplay');
    backdrop.classList.remove('backdrop');
}

burgerButton.addEventListener('click', (event) => {
    asideMenu.classList.add('sideMenuDisplay');
    backdrop.classList.add('backdrop');
});

closeMenuButton.addEventListener('click', closeSideBar)
backdrop.addEventListener('click', closeSideBar);

function addCity(city) {
    const div = document.createElement('div');
    div.classList.add('city');

    const emptyDiv = document.createElement('div');

    const img = document.createElement('img');
    const h3 = document.createElement('h3');
    const p1 = document.createElement('p');
    const p2 = document.createElement('p');
    const p3 = document.createElement('p');
    const h1 = document.createElement('h1');
    const h2 = document.createElement('h2');

    img.setAttribute('src', `./assets/${city.weather[0].icon}.png`);
    h3.textContent = city.weather[0].description.toUpperCase();
    p1.textContent = 'Pressure: ' + city.main.pressure;
    p2.textContent = 'Humidity: ' + city.main.humidity + '%';
    p3.textContent = 'Wind: ' + city.wind.speed + 'km/h';
    h1.textContent = Math.floor(city.main.temp) + '°' + degreeSign;
    h2.textContent = city.name + ', ' + city.sys.country;

    emptyDiv.appendChild(h3);
    emptyDiv.appendChild(p1);
    emptyDiv.appendChild(p2);
    emptyDiv.appendChild(p3);
    emptyDiv.appendChild(h1);
    emptyDiv.appendChild(h2);

    div.appendChild(img);
    div.appendChild(emptyDiv);

    fourCities.appendChild(div);
}

function fetchCities() {
    fetch(`https://api.openweathermap.org/data/2.5/group?id=792680,2968815,2643743,3204541&units=${selectedDegree}&lang=${selectedlanguage}&appid=9c81b14491a186c6e3ddb2174eeb4b8e`)
        .then(response => response.json())
        .then(data => {
            fourCities.innerHTML = '';
            for (let i = 0; i < data.list.length; i++) {
                console.log(data.list[i]);
                addCity(data.list[i]);
            }
        });
}

fetchCities();


function fillCurrentWeather(weather) {
    const dayInWeek = new Date().getDay() - 1;

    const h2 = document.querySelector('#todayWeatherH2');
    h2.textContent = `CURRENT WEATHER TODAY, ${daysInWeek[dayInWeek]}, ${weather.dt_txt.substring(11,16)}`;

    const imgToday = document.querySelector('#img-today');
    imgToday.setAttribute('src', `./assets/${weather.weather[0].icon}.png`);

    const temperatureBig = document.querySelector('#temperatureBig');
    temperatureBig.textContent = `${Math.floor(weather.main.temp)}°` + degreeSign;

    const maxTemp = document.querySelector('#maxTemp');
    const minTemp = document.querySelector('#minTemp');
    maxTemp.textContent = `max ${Math.floor(weather.main.temp_max)}°` + degreeSign;
    minTemp.textContent = `min ${Math.floor(weather.main.temp_min)}°` + degreeSign;

    const description = document.querySelector('#description');
    description.textContent = `${weather.weather[0].description.toUpperCase()}`;

    const PHW = document.querySelector('#PHW')
    const p1 = document.createElement('p');
    const p2 = document.createElement('p');
    const p3 = document.createElement('p');

    p1.textContent = `Pressure: ${weather.main.pressure}`;
    p2.textContent = `Humidity: ${weather.main.humidity}%`;
    p3.textContent = `Wind: ${Math.floor(weather.wind.speed)}km/h`;

    PHW.innerHTML = '';

    PHW.appendChild(p1);
    PHW.appendChild(p2);
    PHW.appendChild(p3);
}

function calculateTempForNextThreeDays(weatherList) {
    let today = Number.parseFloat(weatherList[0].dt_txt.substring(8,10));
    let podne = Number.parseFloat(weatherList[0].dt_txt.substring(11,13));
    console.log(weatherList);
    let min1 = Number.MAX_VALUE;
    let max1 = Number.MIN_VALUE;
    let min2 = Number.MAX_VALUE;
    let max2 = Number.MIN_VALUE;
    let min3 = Number.MAX_VALUE;
    let max3 = Number.MIN_VALUE;

    let icon1;
    let icon2;
    let icon3;
    for (let i = 0; i < weatherList.length; i++) {
        let day = Number.parseFloat(weatherList[i].dt_txt.substring(8,10));
        let noon = Number.parseFloat(weatherList[i].dt_txt.substring(11,13));
        if(day === today + 1) {
            if(weatherList[i].main.temp_max > max1){
                max1 = Math.floor(weatherList[i].main.temp_max);
            }
            if(weatherList[i].main.temp_min < min1){
                min1 = Math.floor(weatherList[i].main.temp_min);
            }
            if(noon === podne) {
                icon1 = weatherList[i].weather[0].icon;
            }
        }
        if(day === today + 2) {
            if(weatherList[i].main.temp_max > max2){
                max2 = Math.floor(weatherList[i].main.temp_max);
            }
            if(weatherList[i].main.temp_min < min2){
                min2 = Math.floor(weatherList[i].main.temp_min);
            }
            if(noon === podne) {
                icon2 = weatherList[i].weather[0].icon;
            }
        }
        if(day === today + 3) {
            if(weatherList[i].main.temp_max > max3){
                max3 = Math.floor(weatherList[i].main.temp_max);
            }
            if(weatherList[i].main.temp_min < min3){
                min3 = Math.floor(weatherList[i].main.temp_min);
            }
            if(noon === podne) {
                icon3 = weatherList[i].weather[0].icon;
            }
        }
    }
    fillWeatherForNextThreeDays(min1, max1, min2, max2, min3, max3, icon1, icon2, icon3);
}

function fillWeatherForNextThreeDays(min1, max1, min2, max2, min3, max3, icon1, icon2, icon3) {
    const threeDays = document.querySelector('#threeDays');
    threeDays.innerHTML = '';
    const dayInWeek = new Date().getDay() - 1;
    for (let i = 0; i < 3; i++) {
        const dayWeather = document.createElement('div');
        dayWeather.classList.add('dayWeather');

        const divIcon = document.createElement('div');
        divIcon.classList.add('divIcon');

        const img = document.createElement('img');
        img.classList.add('dayWeatherIcon');
        if(i == 0) {
            img.setAttribute('src', `./assets/${icon1}.png`);
        } else if(i == 1) {
            img.setAttribute('src', `./assets/${icon2}.png`);
        } else if(i == 2) {
            img.setAttribute('src', `./assets/${icon3}.png`);
        }

        const day = document.createElement('div');
        day.classList.add('day');

        const h2 = document.createElement('h2');
        h2.classList.add('degrees');
        h2.textContent = daysInWeek[dayInWeek+i+1];

        const div = document.createElement('div');

        const h11 = document.createElement('h1');
        h11.classList.add('degrees');

        const span = document.createElement('span');
        span.textContent = ' | ';

        const h12 = document.createElement('h1');
        h12.classList.add('degrees');

        if(i === 0){
            h11.textContent = max1 + '°' + degreeSign;
            h12.textContent = min1 + '°' + degreeSign;
        } else if(i == 1) {
            h11.textContent = max2 + '°' + degreeSign;
            h12.textContent = min2 + '°' + degreeSign;
        } else {
            h11.textContent = max3 + '°' + degreeSign;
            h12.textContent = min3 + '°' + degreeSign;
        }
        
        div.appendChild(h11);
        div.appendChild(span);
        div.appendChild(h12);
        day.appendChild(h2);
        day.appendChild(div);

        divIcon.appendChild(img);

        dayWeather.appendChild(divIcon);
        dayWeather.appendChild(day);

        threeDays.appendChild(dayWeather);

    }
}
