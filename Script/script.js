let currentYear = 2024;
let currentMonth = 0; // January

// Sample holidays (customize as needed)
const holidays = {
  0: { 1: "New Year's Day" },
  1: { 21: "Martin Luther King Jr. Day" },
  3: { 14: "Valentine's Day" },
  3: { 29: "Good Friday" },
  3: { 31: "Easter Sunday" },
  4: { 1: "Easter Monday" },
  4: { 12: "International Workers' Day" },
  6: { 4: "Independence Day" },
  7: { 28: "Labor Day" },
  9: { 14: "Columbus Day" },
  10: { 11: "Veterans Day" },
  10: { 22: "Thanksgiving Day" },
  11: { 25: "Christmas Day" },
};

function generateCalendar(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const calendarContainer = document.getElementById('calendar-container');
  calendarContainer.innerHTML = `<h3>${new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>`;

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  // Create header row
  const headerRow = document.createElement('tr');
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  daysOfWeek.forEach(day => {
    const th = document.createElement('th');
    th.textContent = day;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create days
  let dayCounter = 1;
  for (let i = 0; i < 6; i++) {
    const row = document.createElement('tr');

    for (let j = 0; j < 7; j++) {
      const cell = document.createElement('td');
      if (i === 0 && j < firstDayOfMonth) {
        // Empty cells before the first day of the month
        cell.textContent = '';
      } else if (dayCounter <= daysInMonth) {
        cell.textContent = dayCounter;
        if (holidays[month] && holidays[month][dayCounter]) {
          cell.classList.add('holiday');
          cell.setAttribute('data-holiday', holidays[month][dayCounter]);
          cell.addEventListener('mouseover', showHolidayTooltip);
          cell.addEventListener('mouseout', hideHolidayTooltip);
        }
        dayCounter++;
      }
      row.appendChild(cell);
    }

    tbody.appendChild(row);
  }

  table.appendChild(tbody);
  calendarContainer.appendChild(table);
}

function showPreviousMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11; // December
    currentYear--;
  }
  generateCalendar(currentYear, currentMonth);
}

function showNextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0; // January
    currentYear++;
  }
  generateCalendar(currentYear, currentMonth);
}

function showHolidayTooltip(event) {
  const holidayName = event.target.getAttribute('data-holiday');
  const tooltip = document.getElementById('holiday-tooltip');
  tooltip.innerHTML = holidayName;
  tooltip.style.display = 'block';
  tooltip.style.left = `${event.pageX + 10}px`;
  tooltip.style.top = `${event.pageY - 20}px`;
}

function hideHolidayTooltip() {
  const tooltip = document.getElementById('holiday-tooltip');
  tooltip.style.display = 'none';
}

// Initial calendar display
generateCalendar(currentYear, currentMonth);
