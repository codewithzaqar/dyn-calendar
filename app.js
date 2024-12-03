// script.js
const calendar = document.querySelector('#calendar tbody');
const monthYear = document.getElementById('month-year');
const prevMonthButton = document.getElementById('prev-month');
const nextMonthButton = document.getElementById('next-month');
const eventPopup = document.getElementById('event-popup');
const eventDate = document.getElementById('event-date');
const eventList = document.getElementById('event-list');
const eventTitleInput = document.getElementById('event-title');
const addEventButton = document.getElementById('add-event');
const closePopupButton = document.getElementById('close-popup');
const clearEventsButton = document.getElementById('clear-events');
const searchBar = document.getElementById('search-bar');

let currentDate = new Date();
let events = JSON.parse(localStorage.getItem('calendarEvents')) || {};

function saveEvents() {
  localStorage.setItem('calendarEvents', JSON.stringify(events));
}

function renderCalendar(date) {
  calendar.innerHTML = '';
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  monthYear.textContent = date.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  let row = document.createElement('tr');
  for (let i = 0; i < firstDay; i++) {
    row.appendChild(document.createElement('td'));
  }

  for (let day = 1; day <= lastDate; day++) {
    const cell = document.createElement('td');
    const key = `${year}-${month}-${day}`;
    cell.textContent = day;

    if (events[key]) {
      cell.classList.add('event-day');
    }

    cell.addEventListener('click', () => {
      showEventPopup(key, year, month, day);
    });

    row.appendChild(cell);
    if (row.children.length === 7) {
      calendar.appendChild(row);
      row = document.createElement('tr');
    }
  }

  calendar.appendChild(row);
}

function showEventPopup(key, year, month, day) {
  eventDate.textContent = `${month + 1}/${day}/${year}`;
  eventList.innerHTML = '';

  if (events[key]) {
    events[key].forEach((event, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = event;
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => {
        events[key].splice(index, 1);
        if (events[key].length === 0) {
          delete events[key];
        }
        saveEvents();
        renderCalendar(currentDate);
        showEventPopup(key, year, month, day);
      });
      listItem.appendChild(deleteBtn);
      eventList.appendChild(listItem);
    });
  }

  eventPopup.style.display = 'block';

  addEventButton.onclick = () => {
    const event = eventTitleInput.value.trim();
    if (!event) return;
    if (!events[key]) events[key] = [];
    events[key].push(event);
    saveEvents();
    renderCalendar(currentDate);
    showEventPopup(key, year, month, day);
    eventTitleInput.value = '';
  };
}

function clearAllEvents() {
  if (confirm('Are you sure you want to delete all events?')) {
    events = {};
    saveEvents();
    renderCalendar(currentDate);
  }
}

prevMonthButton.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});

nextMonthButton.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

closePopupButton.addEventListener('click', () => {
  eventPopup.style.display = 'none';
});

clearEventsButton.addEventListener('click', clearAllEvents);

searchBar.addEventListener('input', () => {
  const query = searchBar.value.toLowerCase();
  [...calendar.querySelectorAll('td')].forEach((cell) => {
    const key = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${cell.textContent}`;
    if (events[key] && events[key].some((event) => event.toLowerCase().includes(query))) {
      cell.style.backgroundColor = '#ffecb3';
    } else {
      cell.style.backgroundColor = '';
    }
  });
});

renderCalendar(currentDate);
