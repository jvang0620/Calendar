let currentYear = 2024; //Current year
let currentMonth = 0; // January


/**********************
  Sample holidays/dates
**********************/
const holidays = {
  0: [ //January
      { 1: "New Year's Day" }, 
  ],
  1: [ //Febuary
      { 14: "Valentine's Day" },
  ], 
  4: [ //May
      { 27: "Memorial Day" }, //changes every year (last monday of May)
  ], 
  6: [ //July
      { 4: "Independence Day" }, 
  ],
  8: [ //September
      { 2: "Labor Day" }, //changes every year (1st monday of september)
  ],
  9: [ //October
      { 14: "Columbus Day" }, //changes every year 
      { 31: "Hallowen"},
  ], 
  10: [ //November
        { 11: "Veterans Day" }, 
        { 28: "Thanksgiving Day" }, //changes every year 
  ],
  11: [ //December
        { 24: "Christmas Eve"}, 
        { 25: "Christmas Day" },
        { 31: "New Year's Eve "},
  ],
};


/*******************
  Generate calendars
*******************/
function generateCalendar(year, month) {
  const calendarContainer = document.getElementById('calendar-container');
  calendarContainer.innerHTML = ''; // Clear the container

  // Create the current month calendar
  const currentMonthContainer = createCalendarContainer(year, month, 'current-month');
  currentMonthContainer.appendChild(createCalendarTable(year, month));
  calendarContainer.appendChild(currentMonthContainer);

  // Create the previous month calendar
  const previousMonthContainer = createCalendarContainer(year, month - 1);
  previousMonthContainer.appendChild(createCalendarTable(year, (month - 1 + 12) % 12, 'prev-month'));
  calendarContainer.appendChild(previousMonthContainer);

  // Create the next month calendar
  const nextMonthContainer = createCalendarContainer(year, month + 1);
  nextMonthContainer.appendChild(createCalendarTable(year, (month + 1) % 12, 'next-month'));
  calendarContainer.appendChild(nextMonthContainer);
}


/******************************
  Create the calendar container
******************************/
function createCalendarContainer(year, month, calendarType) {
  const container = document.createElement('div');
  container.classList.add('calendar-container');
  
  if (calendarType) {
    container.classList.add(calendarType);
  }

  //if not current-month
  if (calendarType !== "current-month") {
    //keep h3 at standard font-size
    container.innerHTML = `<h3>${new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>`;
  } else {
    //make h3 font-size xx-large
    container.innerHTML = `<h3 id="calendarContainerH3">${new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>`;
  }

  return container;
}


/**************************
  Create the calendar table
**************************/
function createCalendarTable(year, month, calendarType) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const currentDate = new Date(); 
  const currentDay = currentDate.getDate();
  const easterDate = getEasterDate(year);
  const goodFridayDate = getGoodFridayDate(year);
  const mlkJrDay = getMartinLutherKingJrDay(year);

  const table = document.createElement('table');
  table.classList.add(calendarType); // Add a class to differentiate current, previous, and next month tables
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
      } 
      else if (dayCounter <= daysInMonth) {
        cell.textContent = dayCounter;

        // Check if the current day is Easter
        if (
          year === easterDate.getFullYear() &&
          month === easterDate.getMonth() &&
          (dayCounter === easterDate.getDate() || dayCounter === easterDate.getDate() - 2)
        ) {
          //Add css style class 'easter-day' to cell
          cell.classList.add('easter-day');

          //when mouse is over cell, display Easter. If not, hide
          cell.addEventListener('mouseover', showEasterTooltip);
          cell.addEventListener('mouseout', hideHolidayTooltip);
        }
        
        // Check if the current day is Good Friday
        if (
          year === goodFridayDate.getFullYear() &&
          month === goodFridayDate.getMonth() &&
          dayCounter === goodFridayDate.getDate()
        ) {
          //Add css style class 'good-friday' to cell
          cell.classList.add('good-friday');

          //when mouse is over cell, display good friday. If not, hide
          cell.addEventListener('mouseover', showGoodFridayTooltip);
          cell.addEventListener('mouseout', hideHolidayTooltip);
        }

        // Check if the current day is Martin Luther King Jr. Day
        if (
          year === mlkJrDay.getFullYear() &&
          month === mlkJrDay.getMonth() &&
          dayCounter === mlkJrDay.getDate()
        ) {
          // Add css style class 'mlk-jr-day' to cell
          cell.classList.add('martinLutherKingJr-day');

          // when mouse is over cell, display Martin Luther King Jr. Day. If not, hide
          cell.addEventListener('mouseover', showMlkJrDayTooltip);
          cell.addEventListener('mouseout', hideHolidayTooltip);
        }

        const monthHolidays = holidays[month];

        if (monthHolidays) {
          monthHolidays.forEach(holiday => {
            const [day, holidayName] = Object.entries(holiday)[0];

            if (parseInt(day) === dayCounter) {
              cell.classList.add('holiday');
              cell.setAttribute('data-holiday', holidayName);
              cell.addEventListener('mouseover', showHolidayTooltip);
              cell.addEventListener('mouseout', hideHolidayTooltip);
            }
          });
        }

        if (year === currentDate.getFullYear() && month === currentDate.getMonth() && dayCounter === currentDay) {
          // Highlight the current day
          cell.classList.add('current-day');
          cell.addEventListener('mouseover', showCurrentDayTooltip);
          cell.addEventListener('mouseout', hideHolidayTooltip);
        }
        dayCounter++;
      }
      row.appendChild(cell);
    }
  
    tbody.appendChild(row);
  }

  table.appendChild(tbody);
  return table;
}


/********************************************
** Function to get Martin Luther King Jr Date
********************************************/
function getMartinLutherKingJrDay(year) {
  const januaryFirst = new Date(year, 0, 1); // Mon Jan 01, 2024 00:00:00 GMT-0500 (EST)
  const dayOfWeek = januaryFirst.getDay(); //print 1 (1 mean the 1st of January 2024 is a Monday)
  let daysToAdd;

  /************************************
  ** Calculate days to the third Monday
  ************************************/
  if (dayOfWeek === 0) { //If the 1st is Sunday (0 represent Sunday)
    daysToAdd = 15; //Set MLK Jr date to 16th (15 represent the 16th of January)
  }
  else if (dayOfWeek === 1) { //If the 1st is a Monday (1 represent Monday)
    daysToAdd = 14; //Set MLK Jr date to 15th (14 represent the 15th of January)
  }
  else if (dayOfWeek === 2) { //If the 1st is a Tuesday
    daysToAdd = 20; //Set MLK Jr date to 21st
  }
  else if (dayOfWeek === 3) { //If the 1st is a Wednesday
    daysToAdd = 19; //Set MLK Jr date to 20th
  }
  else if (dayOfWeek === 4) { //If the 1st is a Thursday
    daysToAdd = 18; //Set MLK Jr date to 19th
  }
  else if (dayOfWeek === 5) { //If the 1st is a Friday
    daysToAdd = 17; //Set MLK Jr date to 18th
  }
  else { //If the 1st is a Saturday
    daysToAdd = 16; //Set MLK Jr date to 17th
  }

  const mlkJrDay = new Date(year, 0, 1 + daysToAdd);
  return mlkJrDay;
}

/*****************************
** Function to get Easter Date
** Code from (https://codepal.ai/code-generator/query/LcMQXxxD/calculate-easter-date-javascript)
*****************************/
function getEasterDate(year) {
  // Algorithm to calculate Easter date
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month, day);
}

/*****************************
** Function to get Good Friday
** Code from (https://codepal.ai/code-generator/query/LcMQXxxD/calculate-easter-date-javascript)
*****************************/
function getGoodFridayDate(year) {
  // Algorithm to calculate Good Friday date
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1 - 2; // Good Friday is two days before Easter

  return new Date(year, month, day);
}

/***************************
  Show Martin Luther King Jr
****************************/
function showMlkJrDayTooltip(event) {
  const tooltip = document.getElementById('holiday-tooltip');
  tooltip.innerHTML = 'Martin Luther King Jr. Day';
  tooltip.style.display = 'block';
  tooltip.style.left = `${event.pageX + 10}px`;
  tooltip.style.top = `${event.pageY - 20}px`;
}


/*************************
  Show Easter Date tooltip
*************************/
function showEasterTooltip(event) {
  const tooltip = document.getElementById('holiday-tooltip');
  tooltip.innerHTML = 'Easter';
  tooltip.style.display = 'block';
  tooltip.style.left = `${event.pageX + 10}px`;
  tooltip.style.top = `${event.pageY - 20}px`;
}


/*****************************
** Display Good Friday tooltip
*****************************/
function showGoodFridayTooltip(event) {
  const tooltip = document.getElementById('holiday-tooltip');
  tooltip.innerHTML = 'Good Friday';
  tooltip.style.display = 'block';
  tooltip.style.left = `${event.pageX + 10}px`;
  tooltip.style.top = `${event.pageY - 20}px`;
}


/************************
** Display previous month
************************/
function showPreviousMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11; // December
    currentYear--;
  }
  generateCalendar(currentYear, currentMonth);
}


/********************
** Display next month
********************/
function showNextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0; // January
    currentYear++;
  }
  generateCalendar(currentYear, currentMonth);
}


/*****************
** Display holiday
*****************/
function showHolidayTooltip(event) {
  const holidayName = event.target.getAttribute('data-holiday');
  const tooltip = document.getElementById('holiday-tooltip');
  tooltip.innerHTML = holidayName;
  tooltip.style.display = 'block';
  tooltip.style.left = `${event.pageX + 10}px`;
  tooltip.style.top = `${event.pageY - 20}px`;
}


/**************
** Hide holiday
***************/
function hideHolidayTooltip() {
  const tooltip = document.getElementById('holiday-tooltip');
  tooltip.style.display = 'none';
}


/*********************
** Display current day
*********************/
function showCurrentDayTooltip(event) {
  const tooltip = document.getElementById('holiday-tooltip');
  tooltip.innerHTML = 'Current Date';
  tooltip.style.display = 'block';
  tooltip.style.left = `${event.pageX + 10}px`;
  tooltip.style.top = `${event.pageY - 20}px`;
}


/**************************
** Initial calendar display
**************************/
generateCalendar(currentYear, currentMonth);
