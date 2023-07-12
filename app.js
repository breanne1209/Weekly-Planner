let entries = {};

const clickPlus = () => {
  document.querySelectorAll('.day button').forEach(el => {
    el.addEventListener('click', evt => {
      evt.stopImmediatePropagation();
      const elDay = el.closest('.day');
      const val = elDay.querySelector('input').value;
      if (val === '') {
        alert('Please enter a valid value :)');
      } else {
        const month = document.getElementById('select-month').value;
        const week = document.getElementById('select-week').value;
        const dayIndex = elDay.getAttribute('data-day');
        const key = `${month}-${week}-${dayIndex}`;

        if (!entries[key]) {
          entries[key] = [];
        }

        entries[key].push(val);

        let li = document.createElement('li');
        li.innerHTML = val;
        elDay.querySelector('ul').appendChild(li);

        let span = document.createElement('span');
        span.innerHTML = "\u00d7";
        span.addEventListener('click', (e) => {
          e.stopPropagation();
          e.target.parentElement.remove();
          checkScroll();
          saveEntries();
        });

        li.appendChild(span);

        li.addEventListener('click', () => {
          li.classList.toggle('checked');
        });

        checkScroll();
        saveEntries();
      }
      elDay.querySelector('input').value = '';
    });
  });
};

const checkScroll = () => {
  const dayElements = document.querySelectorAll('.day');
  const threshold = 4;

  dayElements.forEach(dayElement => {
    const liElements = dayElement.querySelectorAll('li');

    if (liElements.length > threshold) {
      dayElement.classList.add('scrollable');
    } else {
      dayElement.classList.remove('scrollable');
    }
  });
};


const getWeatherData = () => {
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener('readystatechange', function () {
    if (this.readyState === this.DONE) {
      const weatherData = JSON.parse(this.responseText);
      displayWeatherData(weatherData);
    }
  });
  

  xhr.open('GET', 'https://weatherapi-com.p.rapidapi.com/current.json?q=53.1%2C-0.13');
  xhr.setRequestHeader('X-RapidAPI-Key', '65088df0demshed8b7a5ced8b983p118f06jsna554f788e79d');
  xhr.setRequestHeader('X-RapidAPI-Host', 'weatherapi-com.p.rapidapi.com');

  xhr.send();
};

const displayWeatherData = (weatherData) => {
  const temperatureCelsius = weatherData.current.temp_c;
  const temperatureFahrenheit = Math.round((temperatureCelsius * 9) / 5 + 32);
  const weatherDescription = weatherData.current.condition.text;

  const temperatureElement = document.getElementById('temperature');
  const weatherDescriptionElement = document.getElementById('weather-description');
  const weatherIconElement = document.getElementById('weather-icon');

  temperatureElement.textContent = `Temperature: ${temperatureFahrenheit}°F`;
  weatherDescriptionElement.textContent = `Weather: ${weatherDescription}`;

  let imagePath;

  switch (weatherDescription) {
    case 'Clear':
      imagePath = '/images/sun.png';
      break;
    case 'Cloudy':
    case 'Partly cloudy':
      imagePath = '/images/cloud.png';
      break;
    case 'Rainy':
    case 'Moderate rain':
      imagePath = '/images/rainy.png';
      break;
    default:
      imagePath = '/images/sun.png';
  }

  weatherIconElement.src = imagePath;
};

const saveEntries = () => {
  localStorage.setItem('entries', JSON.stringify(entries));
};

const loadEntries = () => {
  const savedEntries = JSON.parse(localStorage.getItem('entries')) || {};
  entries = savedEntries;
};

window.addEventListener('load', () => {
  clickPlus();
  getWeatherData();
  loadEntries();

  const selectMonth = document.getElementById('select-month');
  const selectWeek = document.getElementById('select-week');
  const dayTitles = document.querySelectorAll('.day-title');

  const updateDayTitles = () => {
    const month = selectMonth.value;
    const week = selectWeek.value;

    const startDate = new Date(`${month} 1, ${new Date().getFullYear()}`);
    const daysToAdd = (week - 1) * 7;
    startDate.setDate(startDate.getDate() + daysToAdd);

    const dayElements = document.querySelectorAll('.day');
    dayElements.forEach((dayElement, index) => {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + index);

      const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
      const monthDay = currentDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });

      const [monthDigit, dayDigit] = monthDay.split('/').map(str => parseInt(str, 10));
      const formattedMonthDay = `${monthDigit}/${dayDigit}`;

      dayElement.querySelector('h3').textContent = `${dayOfWeek} ${formattedMonthDay}`;
    });
  };

  selectMonth.addEventListener('change', updateDayTitles);
  selectWeek.addEventListener('change', updateDayTitles);

  updateDayTitles();
});

