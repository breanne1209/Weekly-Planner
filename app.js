const clickPlus = () => {
  document.querySelectorAll('.day button').forEach(el => {
    el.addEventListener('click', evt => {
      evt.stopImmediatePropagation();
      const el_day = el.closest('.day');
      const val = el_day.querySelector('input').value;
      if (val === '') {
        alert('Please enter a valid value :)');
      } else {
        let li = document.createElement('li');
        li.innerHTML = val;
        el_day.querySelector('ul').appendChild(li);

        let span = document.createElement('span');
        span.innerHTML = "\u00d7";
        span.addEventListener('click', (e) => {
          e.stopPropagation();
          e.target.parentElement.remove();
          checkScroll(); // Call checkScroll whenever an LI is removed
        });

        li.appendChild(span);

        li.addEventListener('click', () => {
          li.classList.toggle('checked');
        });

        checkScroll(); // Call checkScroll whenever an LI is added
      }
      el_day.querySelector('input').value = '';
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

window.addEventListener('load', clickPlus);
