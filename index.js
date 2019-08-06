/**
 * fix next button scrolling width on mobile
 * Don't reset rider info cards every time you navigate to the info screen
 * add actual date selection
 * add prices and half-day option
 * link to big ring site? or support?
 * make & add size charts
 * Give cards IDs
 * stack next and back buttons and make them full width for mobile?
 * https://docs.google.com/document/d/14S-1wbTMa63vxLuZx3-d4fP0cyHfL3N09GlYWPsnfi0/edit
*/

const plusbtns = document.getElementsByClassName('plusbtn');
const bikenums = document.getElementsByClassName('bikenum');
const backbtn = document.getElementById('backbtn');
const nextbtn = document.getElementById('nextbtn');

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

function makeMonth(indate, table, thisMonth=true) {
  let year = indate.getFullYear();
  checkLeapYear(year); //change number of days in February
  table.parentNode.getElementsByTagName('td')[0].textContent = months[indate.getMonth()] + ' ' + year;
  let firstDay = Math.abs(indate.getDay() - (indate.getDate() % 7)); //get offset for the first day of the month
  console.log(indate.getDay() + indate.getDate() % 7 + 1);
  let numDays = monthDays[indate.getMonth()]; //get the number of days for the current month
  let tempRow = table.insertRow(0); //insert the first row
  for (let i = 0; i < 7; i++) { //insert blank spaces for offset
    let tempCell = tempRow.insertCell(i);
    if (i >= firstDay) {
      let date = i + 1 - firstDay
      tempCell.textContent = date;
      tempCell.classList.add('monthDay');
      if (date === indate.getDate() && thisMonth) {
        tempCell.classList.add('blue');
      }
    }
  }
  for (let i = 1; i < Math.ceil(numDays/7); i++) { //start at one to do the rest of the rows
    tempRow = table.insertRow(i);
    for (let j = 0; j < 7; j++) {
      let tempCell = tempRow.insertCell(j);
      let date = (j+1)+(i*7)-firstDay;
      if (date === indate.getDate() && thisMonth) {
        tempCell.classList.add('blue');
      }
      if (date > numDays) break;

      tempCell.textContent = date;
      tempCell.classList.add('monthDay');
    }
  }
}

// go to the next page and 
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

function selectedBikeCards() {
  bikeCards.innerHTML = ''; //figure out a better solution. Match curSelection against selectedBikes?4
  let bikesList = Object.keys(selectedBikes);
  for (let i in bikesList) {
    for (let j = 0; j < selectedBikes[bikesList[i]]; j++) {
      assembleCard(bikesList[i])
    }
  }
}

function assembleCard(bike, num) {
  let card = document.createElement('div');
  card.className = 'oneRider';

  let bikeName = document.createElement('span');
  bikeName.className = 'riderBikeName';
  bikeName.textContent = bikeNames[bike];
  card.appendChild(bikeName);

  let nameField = document.getElementById('nameIn').content.cloneNode(true);
  card.appendChild(nameField);

  let sizeSelect = document.getElementById(bike + 'Size').content.cloneNode(true);
  card.appendChild(sizeSelect);

  let heightOption = document.getElementById('height').content.cloneNode(true); //maybe? have to get weight in there somehow
  card.appendChild(heightOption);

  if (bike === 'habit') {
    let weightField = document.getElementById('weight').content.cloneNode(true);
    card.appendChild(weightField);
  }

  if (bike !== 'venezia') {
    let pedalSelect = document.getElementById('pedals').content.cloneNode(true);
    card.appendChild(pedalSelect);
  }

  let HFKSH = document.getElementById('HFKSH').content.cloneNode(true);
  card.appendChild(HFKSH);

  bikeCards.appendChild(card);
  //bike name (diff)
  //name field (same)
  //size, model, weight (diff)
  //pedals (except venezia)
  //helmet, flat kit, seat height (same)
}

function nextbtnWidth() { //change the width of the "next" button
  let scroll = document.scrollingElement;
  nextbtn.style.width = scroll.scrollHeight - scroll.scrollTop < scroll.clientHeight + 16 ? 'calc(40vw + 15px)' : '';
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
  else if (e.target.closest('#showHeight')) { //to show height field - might have to change to class
    e.target.closest('#heightDiv').getElementsByClassName('heightIn')[0].classList.remove('none'); //have to make it select the right one
    // document.getElementById('sizeReq').classList.add('none'); //hide asterisk on size?
    e.target.closest('#showHeight').classList.add('none');
  }
  else if (e.target.closest('#curMonth')) {
    e.target.classList.toggle('blue');
  }
}, false);

document.addEventListener('scroll', nextbtnWidth, false);

