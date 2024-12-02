// script.js
const calendar = document.querySelector('#calendar tbody');
const monthYear = document.getElementById('month-year');
const prevMonthButton = document.getElementById('prev-month');
const nextMonthButton = document.getElementById('next-month');
const eventPopup = document.getElementById('event-popup');
const eventTitleInput = document.getElementById('event-title');
const saveEventButton = document.getElementById('save-event');
const deleteEventButton = document.getElementById('delete-event');
const closePopupButton = document.getElementById('close-popup');
const clearEventsButton = document.getElementById('clear-events');

let currentDate = new Date();
let selectedDate = null;
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
    year: 'numeric'
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
      cell.title = events[key];
    }

    cell.addEventListener('click', () => {
      selectedDate = key;
      eventTitleInput.value = events[key] || '';
      eventPopup.style.display = 'flex';
    });

    row.appendChild(cell);
    if (row.children.length === 7) {
      calendar.appendChild(row);
      row = document.createElement('tr');
    }
  }

  while (row.children.length < 7) {
    row.appendChild(document.createElement('td'));
  }
  calendar.appendChild(row);
}

function closePopup() {
  eventPopup.style.display = 'none';
  selectedDate = null;
}

function saveEvent() {
  const title = eventTitleInput.value.trim();
  if (title) {
    events[selectedDate] = title;
  } else {
    delete events[selectedDate];
  }
  saveEvents();
  renderCalendar(currentDate);
  closePopup();
}

function deleteEvent() {
  delete events[selectedDate];
  saveEvents();
  renderCalendar(currentDate);
  closePopup();
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

closePopupButton.addEventListener('click', closePopup);
saveEventButton.addEventListener('click', saveEvent);
deleteEventButton.addEventListener('click', deleteEvent);
clearEventsButton.addEventListener('click', clearAllEvents);

renderCalendar(currentDate);
