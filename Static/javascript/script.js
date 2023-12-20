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
    {19: "Spring Starts"} //https://www.timeanddate.com/calendar/seasons.html?year=2000
  ],
  5: [
      { 20: "Summer Starts"}, //changes yearly: https://www.timeanddate.com/calendar/seasons.html?year=2000
  ],
  6: [ //July
      { 4: "Independence Day" }, 
  ],
  8: [ //September
      { 22: "Autumn Starts"} //changes yearly: https://www.timeanddate.com/calendar/seasons.html?year=2000
  ],
  9: [ //October
      { 31: "Hallowen"},
  ], 
  10: [ //November
        { 11: "Veterans Day"},
  ],
  11: [ //December
        { 21: "Winter Starts"}, //changes yearly: https://www.timeanddate.com/calendar/seasons.html?year=2000
        { 24: "Christmas Eve"}, 
        { 25: "Christmas Day" },
        { 31: "New Year's Eve "},
  ],
};


/**
 * Generates and displays three calendars (current, previous, and next month) in the specified year and month.
 * 
 * @param {*} year - The year for which to generate the calendars.
 * @param {*} month - The month for which to generate the calendars (0-indexed, January is 0, December is 11).
 */
function generateCalendar(year, month) {
  // Get the calendar container element by its ID
  const calendarContainer = document.getElementById('calendar-container');
  
  // Clear the container content
  calendarContainer.innerHTML = '';

  // Create and append the current month calendar
  const currentMonthContainer = createCalendarContainer(year, month, 'current-month');
  currentMonthContainer.appendChild(createCalendarTable(year, month));
  calendarContainer.appendChild(currentMonthContainer);

  // Create and append the previous month calendar
  const previousMonthContainer = createCalendarContainer(year, month - 1);
  previousMonthContainer.appendChild(createCalendarTable(year, (month - 1 + 12) % 12, 'prev-month'));
  calendarContainer.appendChild(previousMonthContainer);

  // Create and append the next month calendar
  const nextMonthContainer = createCalendarContainer(year, month + 1);
  nextMonthContainer.appendChild(createCalendarTable(year, (month + 1) % 12, 'next-month'));
  calendarContainer.appendChild(nextMonthContainer);
}


/**
 * Creates the calendar container element based on the provided year, month, and calendar type.
 * 
 * @param {*} year - The year of the calendar.
 * @param {*} month - The month of the calendar.
 * @param {*} calendarType - The type of calendar (current, previous, or next month).
 * @returns {HTMLElement} - The created calendar container element.
 */
function createCalendarContainer(year, month, calendarType) {
  // Create a container div element
  const container = document.createElement('div');
  container.classList.add('calendar-container');
  
  // Add the specified calendar type class if provided
  if (calendarType) {
    container.classList.add(calendarType);
  }

  // If not the current month, display the month and year in standard font-size
  if (calendarType !== "current-month") {
    container.innerHTML = `<h3>${new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>`;
  } else {
    // If the current month, display the month and year with a larger font-size
    container.innerHTML = `<h3 id="calendarContainerH3">${new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>`;
  }

  return container;
}

/**
 * Funtion applies holiday-related styling and behavior to calendar cell if the day
 * being processed corresponds to a holiday in the provided array of holidays
 * for the current month
 * @param {*} cell - The calendar cell element.
 * @param {*} dayCounter - The day of the month being processed.
 * @param {*} monthHolidays - Array of holidays for the current month.
 */
function applyHolidays(cell, dayCounter, monthHolidays) {
  // checks if there are any holidays for the current month. If there are, it enters the block of code
  if (monthHolidays) {
    // iterates through each holiday in the array for the current month
    monthHolidays.forEach(holiday => {
      // extracts the day and holiday name from the first (and only) entry in the holiday object
      const [day, holidayName] = Object.entries(holiday)[0];

      // checks if the day of the holiday matches the current day being processed in the calendar (dayCounter)
      if (parseInt(day) === dayCounter) {
        cell.classList.add('holidays-observances-css'); // if it's a holiday/observances, it adds the CSS class 'holidays-observances-css' to the cell
        cell.setAttribute('data-holiday', holidayName); // sets the 'data-holiday' attribute of the cell to the name of the holiday
        cell.addEventListener('mouseover', showHolidayTooltip); // show tooltip when the mouse is over the cell
        cell.addEventListener('mouseout', hideHolidayTooltip); // hide tooltip
      }
    });
  }
}

/**
 * Highlights the current day in the calendar cell, providing interactive behavior
 * such as showing a tooltip when the mouse is over the highlighted cell.
 * 
 * @param {*} cell - The calendar cell element.
 * @param {*} year - The year of the calendar.
 * @param {*} month - The month of the calendar (0-indexed).
 * @param {*} dayCounter - The day of the month being processed.
 * @param {*} currentDate - The current date according to the system's date.
 * @param {*} currentDay - The current day of the month.
 */
function highlightCurrentDay(cell, year, month, dayCounter, currentDate, currentDay) {
  // checks if the current day being processed is the current day according to the system's date
  if (year === currentDate.getFullYear() && month === currentDate.getMonth() && dayCounter === currentDay) {
    cell.classList.add('current-day'); // if true, highlight the current day
    cell.addEventListener('mouseover', showCurrentDayTooltip); // show tooltip when the mouse is over the cell
    cell.addEventListener('mouseout', hideHolidayTooltip); // hide tooltip
  }
}

/**
 * Checks if the current day corresponds to a specific holiday date and applies
 * the specified CSS class and tooltip functionality to the given calendar cell
 * 
 * @param {*} cell - The calendar cell element.
 * @param {*} year - The year of the calendar.
 * @param {*} month - The month of the calendar (0-indexed).
 * @param {*} dayCounter - The day of the month being processed.
 * @param {*} date - The date of the holiday.
 * @param {*} cssClass - The CSS class to be added to the cell for the holiday.
 * @param {*} tooltipFunction - The tooltip function to be triggered on mouseover.
 */
function checkAndAddHoliday(cell, year, month, dayCounter, date, cssClass, tooltipFunction) {
  if (
    year === date.getFullYear() &&
    month === date.getMonth() &&
    dayCounter === date.getDate()
  ) {
    cell.classList.add(cssClass);
    cell.addEventListener('mouseover', tooltipFunction);
    cell.addEventListener('mouseout', hideHolidayTooltip);
  }
}


/**
 * Create the calendar table
 * @param {*} year 
 * @param {*} month 
 * @param {*} calendarType 
 * @returns 
 */
function createCalendarTable(year, month, calendarType) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const currentDate = new Date(); 
  const currentDay = currentDate.getDate();
  const easterDate = getEasterDate(year);
  const goodFridayDate = getGoodFridayDate(year);
  const mlkJrDayDate = getMartinLutherKingJrDayDate(year);
  const presidentDayDate = getPresidentDayDate(year);
  const dayLightSavingStartDayDate = getDayLightSavingStartDayDateDate(year);
  const dayLightSavingEndDayDate = getDayLightSavingEndDayDate(year);
  const mothersDayDate = getMothersDayDate(year);
  const fathersDayDate = getFathersDayDate(year);
  const memorialDayDate = getMemorialDayDate(year);
  const laborDayDate = getLaborDayDate(year);
  const columbusDayDate = getColumbusDayDate(year);
  const electionDayDate =  getElectionDayDate(year);
  const veteransDayDate = getVeteransDayObserveDate(year);
  const thanksgivingDayDate = getThanksgivingDayDate(year);

  //set up basic structure for the calendar table
  const table = document.createElement('table');  //create a new HTML table. Main container for the calendar
  table.classList.add(calendarType);  //Add a class to differentiate current, previous, and next month tables
  const thead = document.createElement('thead');  //create header section of the table. Will contain days of week (Sun, Mon, Tues...)
  const tbody = document.createElement('tbody');  //create table body element (body section of the table). Will contain actualy days of the month

  // Create header row
  const headerRow = document.createElement('tr'); //creates a new HTML 'tr' (table row) element, which will serve as the header row for the calendar table
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  daysOfWeek.forEach(day => { //loop through daysOfWeek array
    const th = document.createElement('th'); //for each day of the week, a new 'th' element is created
    th.textContent = day; //the text content of the 'th' element is set to the current day of the week
    headerRow.appendChild(th); //'th' is added to the headerRow
  });

  thead.appendChild(headerRow); //after populating the 'headerRow' above with day names, it is added to the 'thead' element. 'thead' is the header section of the calendar table
  table.appendChild(thead); //finally, the thead (with the populated header row) is appended to the main table element

  // Create days
  let dayCounter = 1;
  for (let i = 0; i < 6; i++) { //outer loop create rows (weeks) in the calendar. It iterates up to 6 times, representing the maximum number of rows in a month
    const row = document.createElement('tr'); //creates a new HTML 'tr' (table row) element for each week
  
    for (let j = 0; j < 7; j++) { //inner loop creates individual cells (days) within each row
      const cell = document.createElement('td'); //creates a new HTML 'td' (table cell) element for each day
      if (i === 0 && j < firstDayOfMonth) {  // hecks if the cell belongs to the previous month
        cell.textContent = ''; // Empty cells before the first day of the month and sets the text content to an empty string
      } 
      else if (dayCounter <= daysInMonth) { //checks if the dayCounter is within the current month's range
        cell.textContent = dayCounter; //sets the text content of the cell to the current day.


        //calls checkAndAddHoliday function to check and add holiday-related styling and behavior based on various holidays
        checkAndAddHoliday(cell, year, month, dayCounter, easterDate, 'holidays-observances-css', showEasterTooltip);
        checkAndAddHoliday(cell, year, month, dayCounter, goodFridayDate, 'holidays-observances-css', showGoodFridayTooltip);
        checkAndAddHoliday(cell, year, month, dayCounter, mlkJrDayDate, 'holidays-observances-css', showMlkJrDayTooltip);
        checkAndAddHoliday(cell, year, month, dayCounter, presidentDayDate, 'holidays-observances-css', showPresidentDayTooltip);
        checkAndAddHoliday(cell, year, month, dayCounter, dayLightSavingStartDayDate, 'holidays-observances-css', showDayLightSavingStartsTooltip);
        checkAndAddHoliday(cell, year, month, dayCounter, dayLightSavingEndDayDate, 'holidays-observances-css', showDayLightSavingEndsTooltip);
        checkAndAddHoliday(cell, year, month, dayCounter, mothersDayDate, 'holidays-observances-css', showMothersDayTooltip);
        checkAndAddHoliday(cell, year, month, dayCounter, fathersDayDate, 'holidays-observances-css', showFathersDayTooltip);
        checkAndAddHoliday(cell, year, month, dayCounter, memorialDayDate, 'holidays-observances-css', showMemorialDayTooltip);
        checkAndAddHoliday(cell, year, month, dayCounter, laborDayDate, 'holidays-observances-css', showLaborDayTooltip);
        checkAndAddHoliday(cell, year, month, dayCounter, columbusDayDate, 'holidays-observances-css', showColumbusDayTooltip);
        checkAndAddHoliday(cell, year, month, dayCounter, electionDayDate, 'holidays-observances-css', showElectionDayTooltip);
        checkAndAddHoliday(cell, year, month, dayCounter, veteransDayDate, 'holidays-observances-css', showVeteransDayTooltip);     
        checkAndAddHoliday(cell, year, month, dayCounter, thanksgivingDayDate, 'holidays-observances-css', showThanksgivingDayTooltip);

        //retrieves the array of holidays for the current month from the holidays object.
        const monthHolidays = holidays[month];

        //applies holiday-related styling and behavior to calendar cell
        applyHolidays(cell, dayCounter, monthHolidays);

        //highlights the current day in the calendar cell
        highlightCurrentDay(cell, year, month, dayCounter, currentDate, currentDay);
        
        //increment dayCounter
        dayCounter++;
      }
      //appends the cell to the current row
      row.appendChild(cell); 
    }
    //appends the row to the tbody (body) of the calendar table.
    tbody.appendChild(row); 
  }
  //appends the tbody to the main table element
  table.appendChild(tbody); 

  //Returns the complete calendar table
  return table; 
}


/*************************************
** Function to get Thanksgiving Day Date
*************************************/
function getThanksgivingDayDate(year) {
  const novemberFirst = new Date(year, 10, 1);
  const dayOfWeek = novemberFirst.getDay(); //if dayOfWeek = 0, then it's Sunday. If = 1, then it's Monday, etc...
  
  // Elements in array are based off of calcuating the first of November to the fourth Thursday of November
  // Ex: if first of Nov. is Sunday (0), then add 25 days to get to fourth Thursday
  // Ex: if first of Nov. is Thursday (5), then add 21 days to get to fourth Thursday
  const daysToAddMap = [25, 24, 23, 22, 21, 27, 26];
  
  // Calculate days to add
  const daysToAdd = daysToAddMap[dayOfWeek];
  
  // Calculate Labor Day date
  const thanksgivingDayDate = new Date(year, 10, 1 + daysToAdd);
  return thanksgivingDayDate;
}


/************************************
** Function to get Veteran's Day Date
************************************/
function getVeteransDayObserveDate(year) {
  const veteransDayDate = new Date(year, 10, 11); // Veterans Day is always on November 11th
  const dayOfWeek = veteransDayDate.getDay(); //if dayOfWeek = 0, then it's Sunday. If = 1, then it's Monday, etc...

  let veteransDayObservedDate;
  if(dayOfWeek === 6) { //if Saturday
    veteransDayObservedDate = new Date(year, 10, 10); 
    return veteransDayObservedDate; //return Friday, November 10th
  }
  else if (dayOfWeek === 0) { //if Sunday
    veteransDayObservedDate = new Date(year, 10, 12); 
    return veteransDayObservedDate //return Monday, November 13th
  }
  else {
    veteransDayObservedDate = new Date(year, 10, 11);
    return veteransDayObservedDate; //return November 11th. Could be anyday, Monday through Friday, depending on the year
  }
}


/***********************************
** Function to get Election Day Date
************************************/
function getElectionDayDate(year) {
  const novemberFirst = new Date(year, 10, 1);
  const dayOfWeek = novemberFirst.getDay(); //if dayOfWeek = 0, then it's Sunday. If = 1, then it's Monday, etc...
  
  // Elements in array are based off of calcuating the first of November to the first Tueday of November
  // Ex: if first of Nov. is Sunday (0), then add 2 days to get to second Monday
  // Ex: if first of Nov. is Thursday (5), then add 5 days to get to second Monday
  const daysToAddMap = [2, 8, 7, 6, 5, 4, 3];
  
  // Calculate days to add
  const daysToAdd = daysToAddMap[dayOfWeek];
  
  // Calculate Labor Day date
  const electionDayDate = new Date(year, 10, 1 + daysToAdd);
  return electionDayDate;
}



/***********************************
** Function to get Columbus Day Date
************************************/
function getColumbusDayDate(year) {
  const octoberFirst = new Date(year, 9, 1);
  const dayOfWeek = octoberFirst.getDay(); //if dayOfWeek = 0, then it's Sunday. If = 1, then it's Monday, etc...
  
  // Elements in array are based off of calcuating the first of October to the second Monday of October
  // Ex: if first of Oct. is Sunday (0), then add 8 days to get to second Monday
  // Ex: if first of Oct. is Thursday (5), then add 11 days to get to second Monday
  const daysToAddMap = [8, 14, 13, 12, 11, 10, 9];
  
  // Calculate days to add
  const daysToAdd = daysToAddMap[dayOfWeek];
  
  // Calculate Labor Day date
  const columbusDayDate = new Date(year, 9, 1 + daysToAdd);
  return columbusDayDate;
}


/***********************************
** Function to get Memorial Day Date
************************************/
function getLaborDayDate(year) {
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
  const laborDayDate = new Date(year, 8, 1 + daysToAdd);
  return laborDayDate;
}


/***********************************
** Function to get Memorial Day Date
************************************/
function getMemorialDayDate(year) {
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
  const memorialDayDate = new Date(year, 4, 1 + daysToAdd);
  return memorialDayDate;
}


/***********************************
** Function to get Father's Day Date
************************************/
function getFathersDayDate(year) {
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
  const fathersDayDate = new Date(year, 5, 1 + daysToAdd);
  return fathersDayDate;
}


/***********************************
** Function to get Mother's Day Date
************************************/
function getMothersDayDate(year) {
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
  const mothersDayDate = new Date(year, 4, 1 + daysToAdd);
  return mothersDayDate;
}


/****************************************
** Function to get DayLightSavingEndDay
****************************************/
function getDayLightSavingEndDayDate(year) {
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
  const dayLightSavingEndDayDate = new Date(year, 10, 1 + daysToAdd);
  return dayLightSavingEndDayDate;
}


/****************************************
** Function to get DayLightSavingStartDayDate
****************************************/
function getDayLightSavingStartDayDateDate(year) {
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
  const dayLightSavingStartDayDate = new Date(year, 2, 1 + daysToAdd);
  return dayLightSavingStartDayDate;
}


/*******************************
** Function to get President Day
*******************************/
function getPresidentDayDate(year) {
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
  const presidentDayDate = new Date(year, 1, 1 + daysToAdd);
  return presidentDayDate;
}


/********************************************
** Function to get Martin Luther King Jr Date
********************************************/
function getMartinLutherKingJrDayDate(year) {
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
  const mlkJrDayDate = new Date(year, 0, 1 + daysToAdd);
  return mlkJrDayDate;
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


/**********************************
** Display Election Day Date in Nov
**********************************/
function showElectionDayTooltip(event) {
  const tooltip = document.getElementById('holiday-tooltip');
  tooltip.innerHTML = "Election Day";
  tooltip.style.display = 'block';
  tooltip.style.left = `${event.pageX + 10}px`;
  tooltip.style.top = `${event.pageY - 20}px`;
}


/**********************************
** Display Election Day Date in Nov
**********************************/
function showVeteransDayTooltip(event) {
  const tooltip = document.getElementById('holiday-tooltip');
  tooltip.innerHTML = "Veterans Day Observed";
  tooltip.style.display = 'block';
  tooltip.style.left = `${event.pageX + 10}px`;
  tooltip.style.top = `${event.pageY - 20}px`;
}


/**************************************
** Display Thanksgiving Day Date in Nov
**************************************/
function showThanksgivingDayTooltip(event) {
  const tooltip = document.getElementById('holiday-tooltip');
  tooltip.innerHTML = "Thanksgiving Day";
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
