let currentDate = new Date(); // Get current date
let currentYear = currentDate.getFullYear(); // Get current year
let currentMonth = currentDate.getMonth(); // Get current month (0-indexed, so January is 0)



/**********************
** Holidays/Observances 
**********************/
const holidays = {
  0: [ //January
      { 1: "New Year's Day" }, 
  ],
  1: [ //Febuary
      { 14: "Valentine's Day" },
      { 29: "Leap Day!!!"},
  ],
  2: [ //March
    {17: "St. Patrick's Day"},
    {19: "Spring Starts."} //https://www.calendardate.com/spring_2027.htm
  ],
  5: [
      { 20: "Summer Starts"}, //changes yearly (https://www.calendardate.com/summer_2027.htm)
  ],
  6: [ //July
      { 4: "Independence Day" }, 
  ],
  8: [ //September
      { 22: "Autumn Starts"} //changes yearly (https://www.calendardate.com/autumn_2027.htm)
  ],
  9: [ //October
      { 31: "Hallowen"},
  ], 
  10: [ //November
        { 11: "Veterans Day" }, //Vet Day is still 11th but time offchanges when the 11th falls on Saturday/Sunday (If Sat, time off is on Friday (the day before). If Sunday, time off falls on Monday (the day after).
        { 28: "Thanksgiving Day" }, //changes every year 
        { 29: "Black Friday"}, //changes every year
  ],
  11: [ //December
        { 21: "Winter Starts"}, //changes yearly (https://www.calendardate.com/winter_2027.htm)
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
  const presidentDay = getPresidentDay(year);
  const dayLightSavingStartDay = getDayLightSavingStartDay(year);
  const dayLightSavingEndDay = getDayLightSavingEndDay(year);
  const mothersDay = getMothersDay(year);
  const fathersDay = getFathersDay(year);
  const memorialDay = getMemorialDay(year);
  const laborDay = getLaborDay(year);
  const columbusDay = getColumbusDay(year);

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

        /*********************************** 
          Check if the current day is Easter
        ***********************************/
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
        
        /****************************************
        * Check if the current day is Good Friday
        ****************************************/
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

        /*******************************************************
        * Check if the current day is Martin Luther King Jr. Day
        *******************************************************/
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

        /******************************************
        * Check if the current day is President Day
        ******************************************/
        if (
          year === presidentDay.getFullYear() &&
          month === presidentDay.getMonth() &&
          dayCounter === presidentDay.getDate()
        ) {
          // Add css style class 'presidentDay' to cell
          cell.classList.add('presidentDay');

          // when mouse is over cell, display President Day. If not, hide
          cell.addEventListener('mouseover', showPresidentDayTooltip);
          cell.addEventListener('mouseout', hideHolidayTooltip);
        }

        /*************************************************************
        * Check if the current day is Day Light Saving Time Start Date
        *************************************************************/
        if (
          year === dayLightSavingStartDay.getFullYear() &&
          month === dayLightSavingStartDay.getMonth() &&
          dayCounter === dayLightSavingStartDay.getDate()
        ) {
          // Add css style class 'dayLightSavingStartDay' to cell
          cell.classList.add('dayLightSavingStartDay');

          // when mouse is over cell, display 'Day Light Saving Start'. If mouse not over, hide
          cell.addEventListener('mouseover', showDayLightSavingStartsTooltip);
          cell.addEventListener('mouseout', hideHolidayTooltip);
        }

        /*************************************************************
        * Check if the current day is Day Light Saving Time End Date
        *************************************************************/
        if (
          year === dayLightSavingEndDay.getFullYear() &&
          month === dayLightSavingEndDay.getMonth() &&
          dayCounter === dayLightSavingEndDay.getDate()
        ) {
          // Add css style class 'dayLightSavingEndDay' to cell
          cell.classList.add('dayLightSavingEndDay');

          // when mouse is over cell, display 'Day Light Saving End'. If mouse not over, hide
          cell.addEventListener('mouseover', showDayLightSavingEndsTooltip);
          cell.addEventListener('mouseout', hideHolidayTooltip);
        }

        /**********************************************
        * Check if the current day is Mother's Day Date
        ***********************************************/
        if (
          year === mothersDay.getFullYear() &&
          month === mothersDay.getMonth() &&
          dayCounter === mothersDay.getDate()
        ) {
          // Add css style class 'mothersDay' to cell
          cell.classList.add('mothersDay');

          // when mouse is over cell, display 'Mother's Day'. If mouse not over, hide
          cell.addEventListener('mouseover', showMothersDayTooltip);
          cell.addEventListener('mouseout', hideHolidayTooltip);
        }

        /**********************************************
        * Check if the current day is Father's Day Date
        ***********************************************/
        if (
          year === fathersDay.getFullYear() &&
          month === fathersDay.getMonth() &&
          dayCounter === fathersDay.getDate()
        ) {
          // Add css style class 'fathersDay' to cell
          cell.classList.add('fathersDay');

          // when mouse is over cell, display 'Father's Day'. If mouse not over, hide
          cell.addEventListener('mouseover', showFathersDayTooltip);
          cell.addEventListener('mouseout', hideHolidayTooltip);
        }

        /**********************************************
        * Check if the current day is Memorial Day Date
        ***********************************************/
        if (
          year === memorialDay.getFullYear() &&
          month === memorialDay.getMonth() &&
          dayCounter === memorialDay.getDate()
        ) {
          // Add css style class 'memorialDay' to cell
          cell.classList.add('memorialDay');

          // when mouse is over cell, display 'Memorial's Day'. If mouse not over, hide
          cell.addEventListener('mouseover', showMemorialDayTooltip);
          cell.addEventListener('mouseout', hideHolidayTooltip);
        }

        /**********************************************
        * Check if the current day is Labor Day Date
        ***********************************************/
        if (
          year === laborDay.getFullYear() &&
          month === laborDay.getMonth() &&
          dayCounter === laborDay.getDate()
        ) {
          // Add css style class 'laborDay' to cell
          cell.classList.add('laborDay');

          // when mouse is over cell, display 'Labor Day'. If mouse not over, hide
          cell.addEventListener('mouseover', showLaborDayTooltip);
          cell.addEventListener('mouseout', hideHolidayTooltip);
        }

        /**********************************************
        * Check if the current day is Columbus Day
        ***********************************************/
        if (
          year === columbusDay.getFullYear() &&
          month === columbusDay.getMonth() &&
          dayCounter === columbusDay.getDate()
        ) {
          // Add css style class 'columbusDay' to cell
          cell.classList.add('columbusDay');

          // when mouse is over cell, display 'Labor Day'. If mouse not over, hide
          cell.addEventListener('mouseover', showColumbusDayTooltip);
          cell.addEventListener('mouseout', hideHolidayTooltip);
        }

        //retrieves the array of holidays for the current month from the holidays object.
        const monthHolidays = holidays[month];

        //checks if there are any holidays for the current month. If there are, it enters the block of code
        if (monthHolidays) {
          //iterates through each holiday in the array for the current month
          monthHolidays.forEach(holiday => {
            //extracts the day and holiday name from the first (and only) entry in the holiday object
            const [day, holidayName] = Object.entries(holiday)[0];

            //checks if the day of the holiday matches the current day being processed in the calendar (dayCounter)
            if (parseInt(day) === dayCounter) {
              cell.classList.add('holiday'); // if it's a holiday, it adds the CSS class 'holiday' to the cell
              cell.setAttribute('data-holiday', holidayName); //sets the 'data-holiday' attribute of the cell to the name of the holiday
              cell.addEventListener('mouseover', showHolidayTooltip); //show tooltip when mouse is over the cell
              cell.addEventListener('mouseout', hideHolidayTooltip); //hide tooltip
            }
          });
        }

        //checks if the current day being processed is the current day according to the system's date
        if (year === currentDate.getFullYear() && month === currentDate.getMonth() && dayCounter === currentDay) {
          cell.classList.add('current-day'); //if true, highlight the current day
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


  // { 14: "Columbus Day" }, //changes every year (2nd monday of october)
  // { 4: "Election Day"}, //changes every year (1st Tuesday of November)

/***********************************
** Function to get Columbus Day Date
************************************/
function getColumbusDay(year) {
  const octoberFirst = new Date(year, 9, 1);
  const dayOfWeek = octoberFirst.getDay(); //if dayOfWeek = 0, then it's Sunday. If = 1, then it's Monday, etc...
  
  // Elements in array are based off of calcuating the first of October to the second Monday of October
  // Ex: if first of Oct. is Sunday (0), then add 8 days to get to second Monday
  // Ex: if first of Oct. is Thursday (5), then add 11 days to get to second Monday
  const daysToAddMap = [8, 14, 13, 12, 11, 10, 9];
  
  // Calculate days to add
  const daysToAdd = daysToAddMap[dayOfWeek];
  
  // Calculate Labor Day date
  const columbusDay = new Date(year, 9, 1 + daysToAdd);
  return columbusDay;
}


/***********************************
** Function to get Memorial Day Date
************************************/
function getLaborDay(year) {
  const septemberFirst = new Date(year, 8, 1);
  const dayOfWeek = septemberFirst.getDay(); //if dayOfWeek = 0, then it's Sunday. If = 1, then it's Monday, etc...
  
  // Array to map days to add based on the day of the week
  // Elements in array are based off of calcuating the first of September to the first Monday of September
  // Ex: if first of Sept. is Sunday (0), then add 1 days to get to first Monday
  // Ex: if first of Sept. is Thursday (5), then add 4 days to get to first Monday
  const daysToAddMap = [1, 0, 6, 5, 4, 3, 2];
  
  // Calculate days to add
  const daysToAdd = daysToAddMap[dayOfWeek];
  
  // Calculate Labor Day date
  const laborDay = new Date(year, 8, 1 + daysToAdd);
  return laborDay;
}


/***********************************
** Function to get Memorial Day Date
************************************/
function getMemorialDay(year) {
  const mayFirst = new Date(year, 4, 1);
  const dayOfWeek = mayFirst.getDay(); //if dayOfWeek = 0, then it's Sunday. If = 1, then it's Monday, etc...
  
  // Array to map days to add based on the day of the week
  // Elements in array are based off of calcuating the first of May to the lasy Monday of May
  // Ex: if first of May is Sunday (0), then add 28 days to get to last Monday
  // Ex: if first of May is Thursday (5), then add 25 days to get to last Monday
  const daysToAddMap = [29, 28, 27, 26, 25, 24, 23];
  
  // Calculate days to add
  const daysToAdd = daysToAddMap[dayOfWeek];
  
  // Calculate Memorial Day date
  const memorialDay = new Date(year, 4, 1 + daysToAdd);
  return memorialDay;
}


/***********************************
** Function to get Father's Day Date
************************************/
function getFathersDay(year) {
  const juneFirst = new Date(year, 5, 1);
  const dayOfWeek = juneFirst.getDay(); //if dayOfWeek = 0, then it's Sunday. If = 1, then it's Monday, etc...
  
  // Array to map days to add based on the day of the week
  // Elements in array are based off of calcuating the first of June to the third Sunday of June
  // Ex: if first of June is Sunday (0), then add 14 days to get to third sunday
  // Ex: if first of June is Thursday (5), then add 17 days to get to third sunday
  const daysToAddMap = [14, 20, 19, 18, 17, 16, 15];
  
  // Calculate days to add
  const daysToAdd = daysToAddMap[dayOfWeek];
  
  // Calculate Father's Day date
  const fathersDay = new Date(year, 5, 1 + daysToAdd);
  return fathersDay;
}


/***********************************
** Function to get Mother's Day Date
************************************/
function getMothersDay(year) {
  const mayFirst = new Date(year, 4, 1);
  const dayOfWeek = mayFirst.getDay(); //if dayOfWeek = 0, then it's Sunday. If = 1, then it's Monday, etc...
  
  // Array to map days to add based on the day of the week
  // Elements in array are based off of calcuating the first of May to the second Sunday of May
  // Ex: if first of May is Sunday (0), then add 7 days to get to second sunday
  // Ex: if first of May is Thursday (5), then add 10 days to get to second sunday
  const daysToAddMap = [7, 13, 12, 11, 10, 9, 8];
  
  // Calculate days to add
  const daysToAdd = daysToAddMap[dayOfWeek];
  
  // Calculate Mother's Day date
  const mothersDay = new Date(year, 4, 1 + daysToAdd);
  return mothersDay;
}


/****************************************
** Function to get DayLightSavingEndDay
****************************************/
function getDayLightSavingEndDay(year) {
  const novemberFirst = new Date(year, 10, 1);
  const dayOfWeek = novemberFirst.getDay(); //if dayOfWeek = 0, then it's Sunday. If = 1, then it's Monday, etc...
  
  // Array to map days to add based on the day of the week
  // Elements in array are based of calcuating the first of November to the second Sunday of November
  // Ex: if first of November is Sunday (0), then add 0 days to get to first sunday
  // Ex: if first of November is Thursday (5), then add 3 days to get to first sunday
  const daysToAddMap = [0, 6, 5, 4, 3, 2, 1];
  
  // Calculate days to add
  const daysToAdd = daysToAddMap[dayOfWeek];
  
  // Calculate Day-Light-Saving-End-Day date
  const dayLightSavingEndDay = new Date(year, 10, 1 + daysToAdd);
  return dayLightSavingEndDay;
}


/****************************************
** Function to get DayLightSavingStartDay
****************************************/
function getDayLightSavingStartDay(year) {
  const marchFirst = new Date(year, 2, 1);
  const dayOfWeek = marchFirst.getDay(); //if dayOfWeek = 0, then it's Sunday. If = 1, then it's Monday, etc...
  
  // Array to map days to add based on the day of the week
  // Elements in array are based of calcuating the first of march to the second Sunday of march
  // Ex: if first of March is Sunday (0), then add 7 days to get to second sunday
  // Ex: if first of March is Thursday (5), then add 10 days to get to second sunday
  const daysToAddMap = [7, 13, 12, 11, 10, 9, 8];
  
  // Calculate days to add
  const daysToAdd = daysToAddMap[dayOfWeek];
  
  // Calculate Day-Light-Saving-Start-Day date
  const dayLightSavingStartDay = new Date(year, 2, 1 + daysToAdd);
  return dayLightSavingStartDay;
}


/*******************************
** Function to get President Day
*******************************/
function getPresidentDay(year) {
  const febuaryFirst = new Date(year, 1, 1); 
  const dayOfWeek = febuaryFirst.getDay(); //if dayOfWeek = 0, then it's Sunday. If = 1, then it's Monday, etc...

  // Array to map days to add based on the day of the week
  // Elements in array are based of calcuating the first of Febuary to the third Monday of Febuary
  // Ex: if first of Febuary is Sunday (0), then add 15 days to get to third Monday
  // Ex: if first of Febuary is Thursday (5), then add 18 days to get to third Monday
  const daysToAddMap = [15, 14, 20, 19, 18, 17, 16];
  
  // Calculate days to add
  const daysToAdd = daysToAddMap[dayOfWeek];
  
  // Calculate President Day date
  const presidentDay = new Date(year, 1, 1 + daysToAdd);
  return presidentDay;
}


/********************************************
** Function to get Martin Luther King Jr Date
********************************************/
function getMartinLutherKingJrDay(year) {
  const januaryFirst = new Date(year, 0, 1); 
  const dayOfWeek = januaryFirst.getDay(); ////if dayOfWeek = 0, then it's Sunday. If = 1, then it's Monday, etc...

  // Array to map days to add based on the day of the week
  // Elements in array are based of calcuating the first of January to the third Monday of January
  // Ex: if first of January is Sunday (0), then add 15 days to get to third Monday
  // Ex: if first of January is Thursday (5), then add 18 days to get to third Monday
  const daysToAddMap = [15, 14, 20, 19, 18, 17, 16];
  
  // Calculate days to add
  const daysToAdd = daysToAddMap[dayOfWeek];
  
  // Calculate MLK Jr Day date
  const mlkJrDay = new Date(year, 0, 1 + daysToAdd);
  return mlkJrDay;
}

/**************************************************************
** Function to calculate holiday date for Easter-related dates
** Code from (https://codepal.ai/code-generator/query/LcMQXxxD/calculate-easter-date-javascript)
**************************************************************/
function calculateEasterRelatedDate(year, offset) {
  // Algorithm to calculate Easter-related date
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
  const day = ((h + l - 7 * m + 114) % 31) + 1 - offset;

  return new Date(year, month, day);
}

/*****************************
** Function to get Easter Date
*****************************/
function getEasterDate(year) {
  const offset = 0;
  return calculateEasterRelatedDate(year, offset);
}

/*****************************
** Function to get Good Friday
*****************************/
function getGoodFridayDate(year) {
  const offset = 2; // Good Friday is two days before Easter
  return calculateEasterRelatedDate(year, offset); 
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


/*******************
  Show President Day
********************/
function showPresidentDayTooltip(event) {
  const tooltip = document.getElementById('holiday-tooltip');
  tooltip.innerHTML = 'President Day';
  tooltip.style.display = 'block';
  tooltip.style.left = `${event.pageX + 10}px`;
  tooltip.style.top = `${event.pageY - 20}px`;
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


/**********************************************
** Display Day Light Saving Start Date in March
**********************************************/
function showDayLightSavingStartsTooltip(event) {
  const tooltip = document.getElementById('holiday-tooltip');
  tooltip.innerHTML = 'Day Light Saving Starts';
  tooltip.style.display = 'block';
  tooltip.style.left = `${event.pageX + 10}px`;
  tooltip.style.top = `${event.pageY - 20}px`;
}


/***********************************************
** Display Day Light Saving End Date in November
***********************************************/
function showDayLightSavingEndsTooltip(event) {
  const tooltip = document.getElementById('holiday-tooltip');
  tooltip.innerHTML = 'Day Light Saving Ends';
  tooltip.style.display = 'block';
  tooltip.style.left = `${event.pageX + 10}px`;
  tooltip.style.top = `${event.pageY - 20}px`;
}


/***********************************
** Display Mother's Day Date in May
***********************************/
function showMothersDayTooltip(event) {
  const tooltip = document.getElementById('holiday-tooltip');
  tooltip.innerHTML = "Mother's Day";
  tooltip.style.display = 'block';
  tooltip.style.left = `${event.pageX + 10}px`;
  tooltip.style.top = `${event.pageY - 20}px`;
}


/**********************************
** Display Father's Day Date in May
**********************************/
function showFathersDayTooltip(event) {
  const tooltip = document.getElementById('holiday-tooltip');
  tooltip.innerHTML = "Father's Day";
  tooltip.style.display = 'block';
  tooltip.style.left = `${event.pageX + 10}px`;
  tooltip.style.top = `${event.pageY - 20}px`;
}


/**********************************
** Display Memorial Day Date in May
**********************************/
function showMemorialDayTooltip(event) {
  const tooltip = document.getElementById('holiday-tooltip');
  tooltip.innerHTML = "Memorial Day";
  tooltip.style.display = 'block';
  tooltip.style.left = `${event.pageX + 10}px`;
  tooltip.style.top = `${event.pageY - 20}px`;
}


/**********************************
** Display Labor Day Date in May
**********************************/
function showLaborDayTooltip(event) {
  const tooltip = document.getElementById('holiday-tooltip');
  tooltip.innerHTML = "Labor Day";
  tooltip.style.display = 'block';
  tooltip.style.left = `${event.pageX + 10}px`;
  tooltip.style.top = `${event.pageY - 20}px`;
}


/**********************************
** Display Columbus Day Date in May
**********************************/
function showColumbusDayTooltip(event) {
  const tooltip = document.getElementById('holiday-tooltip');
  tooltip.innerHTML = "Columbus Day";
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
