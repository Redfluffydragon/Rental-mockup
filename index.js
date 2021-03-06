/**
 * Don't reset rider info cards every time you navigate to the info screen
 * fix date selection
 * link to big ring site? or support?
 * make & add size charts - dyodo and f10
 * Give cards IDs
 * stack next and back buttons and make them full width for mobile?
 * add option to hide height field again
 * date checking - won't let them reserve a bike for a date if it's already out - something like "The bike you selected is not available on those date(s)"
 * https://docs.google.com/document/d/14S-1wbTMa63vxLuZx3-d4fP0cyHfL3N09GlYWPsnfi0/edit
*/

"use strict";

const backbtn = document.getElementById('backbtn');
const nextbtn = document.getElementById('nextbtn');

const bikePage = document.getElementById('bikePage');
const infoPage = document.getElementById('infoPage');
const payPage = document.getElementById('payPage');

const habitDiv = document.getElementById('habit');
let bikeDivs = document.getElementsByClassName('bikediv');

const bikeCards = document.getElementById('bikeCards');
const halfDayCheck = document.getElementById('halfDayCheck');

const curMonth = document.getElementById('curMonth');
const nextMonth = document.getElementById('nextMonth');

const hours = document.getElementById('hours');

let page = 0;
const pages = [bikePage, infoPage, payPage];

let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
let monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

let dateSelect = false;
let dates = [];
let rentDates = {
  start: 0,
  end: 0,
}

const isMobile = (typeof window.orientation !== 'undefined') || (navigator.userAgent.indexOf('IEMobile') !== -1);

//change the number of days in February for leap years
function checkLeapYear(year) {
  if (year % 4 === 0) {
    if (year % 100 === 0) {
      if (year % 400 === 0) {
        monthDays[1] = 29;
        return true;
      }
      return false;
    }
    monthDays[1] = 29;
    return true;
  }
  return false;
}

let selectedBikes = {
  habit: 0,
  synapse: 0,
  venezia: 0,
  dyodo: 0,
  f10: 0
};

let curSelection = {
  habit: 0,
  synapse: 0,
  venezia: 0,
  dyodo: 0,
  f10: 0
}

let bikeNames = {
  habit: 'Cannondale Habit',
  synapse: 'Cannondale Synapse',
  venezia: 'Bianchi Venezia',
  dyodo: 'Pinarello Dyodo',
  f10: 'Pinarello F10'
}

//set heights of bikedivs based on the height of the Habit one
function bikeDivHeight() {
  let newHeight = '';
  if (window.innerWidth > 749) {
    habitDiv.style.height = '';
    newHeight = habitDiv.offsetHeight + 30 + 'px';
  }
  for (let i = 0; i < bikeDivs.length; i++) {
    bikeDivs[i].style.height = newHeight;
  }
}

//check month dates: gray if already past, blue if today.
function checkDate(date, indate, thisMonth, tempCell) {
  if (thisMonth) {
    if (date < indate.getDate()) {
      tempCell.classList.add('gray');
      tempCell.setAttribute('doneGone', true);
    }
    else {
      tempCell.setAttribute('doneGone', false);

      if (date === indate.getDate()) {
        tempCell.classList.add('blue');
        rentDates.start = date; //set the start point to today
      }
    }
  }
  else {
    tempCell.setAttribute('doneGone', false);
  }
  tempCell.textContent = date;
  tempCell.classList.add('monthDay');
  dates.push({
    date: date,
    year: indate.getFullYear(),
    month: indate.getMonth(),
    cell: tempCell,
  });
}

//generate the months to select dates from
function makeMonth(indate, table, thisMonth=true) {
  let year = indate.getFullYear();
  checkLeapYear(year); //change number of days in February
  table.parentNode.getElementsByTagName('td')[0].textContent = months[indate.getMonth()] + ' ' + year;

  //I think this is working now
  let firstOccurrence = (indate.getDate() % 7) === 0 ? 7 : indate.getDate() % 7; //get the date of the first occurrence of the day of the week this month - if it's the seventh or whatever, set it equal to seven instead of zero
  let negDay = indate.getDay() - firstOccurrence + 1; //subtract that from the day of the week to get the day of the week of the first day
  let firstDay = negDay < 0 ? negDay + 7 : negDay; //fix it if it's negative.

  let numDays = monthDays[indate.getMonth()]; //get the number of days for the current month
  let tempRow = table.insertRow(0); //insert the first row
  for (let i = 0; i < 7; i++) { //insert blank spaces for offset
    let tempCell = tempRow.insertCell(i); //make a new cell
    if (i >= firstDay) { //only fill the cell if the month actually goes there

      let date = i + 1 - firstDay; //+1 because zero indexed, plus the firstday offset

      checkDate(date, indate, thisMonth, tempCell);
    }
  }
  for (let i = 1; i < Math.ceil(numDays/7); i++) { //start at one to do the rest of the rows/weeks
    tempRow = table.insertRow(i);
    for (let j = 0; j < 7; j++) {
      let tempCell = tempRow.insertCell(j);

      let date = (j+1)+(i*7)-firstDay; //date for the rest of the weeks
      
      checkDate(date, indate, thisMonth, tempCell);
      
      if (date >= numDays) break; //>= 'cause starting at zero? I'm not sure
    }
  }
}

// go to the next page and do stuff
function newPage() {
  for (let i = 0; i < pages.length; i++) {
    pages[i].classList.add('none');
  }
  pages[page].classList.remove('none');
  if (pages[page] === infoPage) {
    curSelection = selectedBikes;
    selectedBikeCards();
  }
  nextbtnWidth();
}

//check which bikes are selected
function selectedBikeCards() {
  bikeCards.innerHTML = ''; //figure out a better solution. Match curSelection against selectedBikes?
  let bikesList = Object.keys(selectedBikes);
  for (let i in bikesList) {
    for (let j = 0; j < selectedBikes[bikesList[i]]; j++) {
      assembleCard(bikesList[i])
    }
  }
}

//assemble the rider info cards for each bike selected
//use num to identify them?
function assembleCard(bike, num) {
  let card = document.createElement('div');
  card.className = 'oneRider';

  let bikeName = document.createElement('h3'); //get the right bike name
  bikeName.className = 'riderBikeName';
  bikeName.textContent = bikeNames[bike];
  card.appendChild(bikeName);

  let nameField = document.getElementById('nameIn').content.cloneNode(true); //rider name for all of them
  card.appendChild(nameField);

  let sizeSelect = document.getElementById(bike + 'Size').content.cloneNode(true); //get the right size select element
  card.appendChild(sizeSelect);

  let heightOption = document.getElementById('height').content.cloneNode(true); //height for all of them
  card.appendChild(heightOption);

  if (bike === 'habit') { //only habits get weight
    let weightField = document.getElementById('weight').content.cloneNode(true);
    card.appendChild(weightField);
  }

  if (bike !== 'venezia') { //venezias only get the pedals that come on them
    let pedalSelect = document.getElementById('pedals').content.cloneNode(true);
    card.appendChild(pedalSelect);
  }

  let HFKSH = document.getElementById('HFKSH').content.cloneNode(true); //helmet, flat kit, seat height for all of them
  card.appendChild(HFKSH);

  bikeCards.appendChild(card);
}

//change the width of the "next" button
function nextbtnWidth() {
  let scroll = document.scrollingElement;
  if (!isMobile)
    nextbtn.style.width = scroll.scrollHeight - scroll.scrollTop < scroll.clientHeight + 16 ? 'calc(40vw + 15px)' : '';

  else if (isMobile) 
    nextbtn.style.width = (scroll.scrollTop + window.innerHeight) > scroll.scrollHeight - 20 ? 'calc(40vw + 15px)' : '';
}

//check if there's a bike selected
function checkBikePage() {
  let bikeSum = 0;
  let bikeKeys = Object.keys(selectedBikes);
  for (let i in bikeKeys) bikeSum += selectedBikes[bikeKeys[i]];
  if (bikeSum === 0) {
    alert('Please select at least one bike before continuing.');
    return false;
  }
  return true;
}

//check for required fields
function checkInfoPage() {
  let filled = true;
  let names = document.getElementsByClassName('name');
  let sizes = document.getElementsByClassName('size');
  let heights = document.getElementsByClassName('heightIn');
  let heightInputs = document.getElementsByClassName('height');
  for (let i = 0; i < names.length; i++) {
    if (names[i].value === '') {
     names[i].style.border = '1px solid red';
     filled = false;
    }
  }
  for (let i = 0; i < sizes.length; i++) {
    if (sizes[i].value === 'Select size' && heights[i].classList.contains('none')) {
      sizes[i].style.border = '1px solid red';
      filled = false;
     }
     else if (heightInputs[i].value === '' && sizes[i].value === 'Select size') {
      heightInputs[i].style.border = '1px solid red';
      filled = false;
    }
  }
  return filled;
}

//call checks and go to next page
function goNextPage() {
  scroll(0, 0); //scroll to the top - only needed because I'm doing this on a single url
  if (page === 0) { //check if they selected any bikes
    if (!checkBikePage()) return;
  }
  else if (page === 1) {
    if (!checkInfoPage()) {
      alert('Please fill out all required fields before continuing.');
      return;
    }
  }
  if (page < pages.length-1) page++;
  if (page > 0) backbtn.classList.remove('none');
  newPage();
}

//switch to a half day ui and back
halfDayCheck.addEventListener('input', () => {
  nextMonth.closest('.month').classList.toggle('none');
}, false);

//generate this month and the next
window.addEventListener('load', () => {
  let getDate = new Date();
  makeMonth(getDate, curMonth);
  getDate.setMonth(getDate.getMonth()+1);
  makeMonth(getDate, nextMonth, false);
  nextbtnWidth();
  if (page > 0) {
    backbtn.classList.remove('none');
  }
  bikeDivHeight();
}, false);

window.addEventListener('resize', () => {
  bikeDivHeight();
  nextbtnWidth();
}, false);

window.addEventListener('keydown', e => {
  if (e.keyCode === 13) { //use enter to move to the next page
    e.preventDefault();
    goNextPage();
  }
}, false);

document.addEventListener('click', e => {
  if (e.target.matches('.plusbtn')) {
    let currnum = e.target.parentNode.getElementsByClassName('bikenum')[0];
    currnum.textContent++;
    let bikename = e.target.closest('.bikediv').id;
    selectedBikes[bikename]++;
  }
  else if (e.target.matches('.minbtn')) {
    let currnum = e.target.parentNode.getElementsByClassName('bikenum')[0];
    if (currnum.textContent > 0) currnum.textContent--;
    let bikename = e.target.closest('.bikediv').id;
    selectedBikes[bikename]--;
  }
  else if (e.target.matches('#nextbtn')) {
    goNextPage(); 
  }
  else if (e.target.matches('#backbtn')) {
    scroll(0, 0);
    page--;
    if (page === 0) backbtn.classList.add('none');
    newPage();
  }
  else if (e.target.closest('.showHeight')) { //to show height field
    e.target.closest('.heightDiv').getElementsByClassName('heightIn')[0].classList.remove('none');
    e.target.closest('.oneRider').getElementsByClassName('sizeReq')[0].classList.add('none'); //hide asterisk on size
    e.target.closest('.showHeight').classList.add('none');
  }
  else if (e.target.matches('.monthDay') && !e.target.classList.contains('gray')) {
    if (dateSelect || parseInt(e.target.textContent) < rentDates.start) {
      for (let i = 0; i < dates.length; i++) {
        dates[i].cell.classList.remove('blue');
        dates[i].cell.classList.remove('lightblue');
      }
      e.target.classList.add('blue');
      rentDates.start = parseInt(e.target.textContent);
      dateSelect = false;
    }
    else if (!dateSelect) {
      for (let i = rentDates.start; i < e.target.textContent-1; i++) {
        dates[i].cell.classList.remove('blue');
        dates[i].cell.classList.add('lightblue');
      }
      e.target.classList.remove('lightblue');
      e.target.classList.add('blue');
      for (let i = parseInt(e.target.textContent); i < dates.length; i++) {
        if (!dates[i].cell.classList.contains('lightblue')) {
          dates[i].cell.classList.remove('blue');
          break;
        }
        dates[i].cell.classList.remove('lightblue');
      }
      dateSelect = true;
    }
  }
  else if (e.target.matches('.showChart')) {
    e.preventDefault();
    e.target.closest('.oneRider').getElementsByClassName('sizeChart')[0].classList.toggle('none');
  }
  else if (e.target.matches('#showHours')) {
    e.preventDefault();
    hours.classList.toggle('none');
    hours.classList.toggle('inlineBlock');
  }
}, false);

document.addEventListener('touchstart', e => {
  if (Touch.target.matches('.monthDay') && !Touch.target.classList.contains('gray')) {
    if (dateSelect || parseInt(e.target.textContent) < rentDates.start) {
      for (let i = 0; i < dates.length; i++) {
        dates[i].classList.remove('blue');
        dates[i].classList.remove('lightblue');
      }
      Touch.target.classList.add('blue');
      rentDates.start = parseInt(Touch.target.textContent);
      dateSelect = false;
    }
    else if (!dateSelect) {
      for (let i = rentDates.start; i < Touch.target.textContent-1; i++) {
        dates[i].classList.remove('blue');
        dates[i].classList.add('lightblue');
      }
      Touch.target.classList.remove('lightblue');
      Touch.target.classList.add('blue');
      for (let i = parseInt(Touch.target.textContent); i < dates.length; i++) {
        if (!dates[i].classList.contains('lightblue')) {
          dates[i].classList.remove('blue');
          break;
        }
        dates[i].classList.remove('lightblue');
      }
      dateSelect = true;
    }
  }
}, false);

document.addEventListener('scroll', nextbtnWidth, false);
