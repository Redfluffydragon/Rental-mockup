/**
 * Add unable to progress without required elements
 * Don't reset rider info cards every time you navigate to the info screen
 * add date selection
 * add prices and half-day option
 * add height option for sizing
 * add helmet option
 * link to big ring site? or support?
 * make sure next/back buttons don't get in the way in mobile
 */

const plusbtns = document.getElementsByClassName('plusbtn');
const bikenums = document.getElementsByClassName('bikenum');
const backbtn = document.getElementById('backbtn');

const bikePage = document.getElementById('bikePage');
const infoPage = document.getElementById('infoPage');
const payPage = document.getElementById('payPage');

const bikeCards = document.getElementById('bikeCards');

const curMonth = document.getElementById('curMonth');
const nextMonth = document.getElementById('nextMonth');
let page = 0;
let firstTime = true; //? maybe ?
const pages = [bikePage, infoPage, payPage];

let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
let monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

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

function makeMonth(indate, table, thisMonth=true) {
  let year = indate.getFullYear();
  checkLeapYear(year); //change number of days in February
  table.parentNode.getElementsByTagName('td')[0].textContent = months[indate.getMonth()] + ' ' + year;
  let firstDay = indate.getDay() - indate.getDate() % 7 + 1; //get offset for the first day of the month
  let numDays = monthDays[indate.getMonth()]; //get the number of days for the current month
  let tempRow = table.insertRow(0); //insert the first row
  for (let i = 0; i < 7; i++) { //insert blank spaces for offset
    let tempCell = tempRow.insertCell(i);
    if (i >= firstDay) {
      tempCell.textContent = i + 1 - firstDay;
    }
  }
  for (let i = 1; i < Math.ceil(numDays/7); i++) {
    tempRow = table.insertRow(i);
    for (let j = 0; j < 7; j++) {
      let tempCell = tempRow.insertCell(j);
      let date = (j+1)+(i*7)-firstDay;
      if (date === indate.getDate() && thisMonth) {
        tempCell.style.background = '#0275d8';
      }
      if (date > numDays) break;

      tempCell.textContent = date;
    }
  }
}

//put in months
window.addEventListener('load', e => {
  let getDate = new Date();
  makeMonth(getDate, curMonth);
  getDate.setMonth(getDate.getMonth()+1);
  makeMonth(getDate, nextMonth, false);
}, false);

function newPage() {
  for (let i = 0; i < pages.length; i++) {
    pages[i].classList.add('none');
  }
  pages[page].classList.remove('none');
  if (pages[page] === infoPage) {
    selectedBikeCards();
  }
}

function selectedBikeCards() {
  bikeCards.innerHTML = ''; //figure out a better solution. Matching?
  let bikesList = Object.keys(selectedBikes);
  for (let i in bikesList) {
    for (let j = 0; j < selectedBikes[bikesList[i]]; j++) {
      let getTemp = document.getElementById(bikesList[i] + 'Template');
      let dupe = getTemp.content.cloneNode(true);
      bikeCards.appendChild(dupe);
    }
  }
}

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
    scroll(0, 0); //scroll to the top - only needed because I'm doing this on a single url
    if (page < pages.length-1) page++;
    if (page > 0) {
      backbtn.classList.remove('none');
    }
    newPage();
  }
  else if (e.target.matches('#backbtn')) {
    scroll(0, 0);
    page--;
    if (page === 0) backbtn.classList.add('none');
    newPage();
  }
}, false);