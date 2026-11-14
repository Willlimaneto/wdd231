// ----- Navigation and footer -----
const navButton = document.querySelector('#nav-button');
const navBar = document.querySelector('#nav-bar');

navButton.addEventListener('click', () => {
  const isOpen = navBar.classList.toggle('open');
  navButton.setAttribute('aria-expanded', isOpen);
});

document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('#lastModified').textContent = document.lastModified;

const apiKey = '875b87e72dd12aa64f08d745b95fa702';
const lat = '-8.84';
const lon = '13.23';
const baseUrl = 'https://api.openweathermap.org/data/2.5';
const weatherBox = document.querySelector('#weather');

async function getWeather() {
  try {
    const currentResponse = await fetch(`${baseUrl}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
    if (!currentResponse.ok) throw Error(await currentResponse.text());
    const current = await currentResponse.json();

    const forecastResponse = await fetch(`${baseUrl}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
    if (!forecastResponse.ok) throw Error(await forecastResponse.text());
    const forecast = await forecastResponse.json();

    displayWeather(current, forecast);
  } catch (error) {
    console.log(error);
    weatherBox.textContent = 'Weather data is not available right now.';
  }
}

function displayWeather(current, forecast) {
  const weather = current.weather[0];


  const today = new Date().toISOString().slice(0, 10);
  const days = forecast.list
    .filter((item) => item.dt_txt.includes('12:00:00') && !item.dt_txt.startsWith(today))
    .slice(0, 3);

  const forecastItems = days.map((item) => {
    const dayName = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
    return `<li>${dayName}: <strong>${Math.round(item.main.temp)}&deg;C</strong></li>`;
  }).join('');

  weatherBox.innerHTML = `
    <img src="https://openweathermap.org/img/wn/${weather.icon}@4x.png" alt="${weather.description}" width="100" height="100">
    <p class="temp">${Math.round(current.main.temp)}&deg;C</p>
    <p class="desc">${weather.description}</p>
    <h3>3-Day Forecast</h3>
    <ul class="forecast">${forecastItems}</ul>
  `;
}

const spotlightBox = document.querySelector('#spotlight-cards');
const levels = { 2: 'Silver', 3: 'Gold' };

async function getSpotlights() {
  try {
    const response = await fetch('data/members.json');
    if (!response.ok) throw Error(await response.text());
    const data = await response.json();
    const members = data.members;

    const eligible = members.filter((member) => member.membership >= 2);
    const picked = eligible.sort(() => Math.random() - 0.5).slice(0, 3);

    displaySpotlights(picked);
  } catch (error) {
    console.log(error);
    spotlightBox.textContent = 'Member spotlights are not available right now.';
  }
}

function displaySpotlights(members) {
  spotlightBox.innerHTML = '';

  members.forEach((member) => {
    const card = document.createElement('article');
    card.classList.add('spotlight');
    card.innerHTML = `
      <h3>${member.name}</h3>
      <img src="images/${member.image}" alt="${member.name} logo" width="100" height="75" loading="lazy">
      <p>${member.phone}</p>
      <p>${member.address}</p>
      <p><a href="${member.website}" target="_blank" rel="noopener noreferrer">Visit website</a></p>
      <p class="level">${levels[member.membership]} Member</p>
    `;
    spotlightBox.appendChild(card);
  });
}

getWeather();
getSpotlights();