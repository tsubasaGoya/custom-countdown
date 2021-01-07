const inputContainer = document.getElementById('inputContainer');
const countdownForm = document.getElementById('countdownForm');
const dateEl = document.getElementById('datePicker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdownTitle');
const countdownBtn = document.getElementById('countdownBtn');
const timeEls = document.querySelectorAll('span');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('completeInfo');
const completeBtn = document.getElementById('completeBtn');

let countdownTitle = '';
let countdownDate = '';
let countdownValue = Date;
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// Set Date Input Min range with Today's Date
const today = new Date().toISOString().split('T')[0];
// console.log(today);
dateEl.setAttribute('min', today);

// Populate Countdown / Complete UI
function updateDOM() {
    countdownActive = setInterval(() => {
        // const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        // console.log(tz);
        const now = (new Date().getTime()); //set time to PST
        const distance = countdownValue - now;
        const days = Math.floor(distance / day);
        const hours = Math.floor((distance % day) / hour);
        const minutes = Math.floor((distance % hour) / minute);
        const seconds = Math.floor((distance % minute) / second);
        // Hide Input
        inputContainer.hidden = true;
        // If the countdown has ended, show complete
        if (distance < 0) {
            countdownEl.hidden = true;
            clearInterval(countdownActive);
            completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
            completeEl.hidden = false;
        } else {
            // Show the countdoen in progreess
            countdownElTitle.textContent = `${countdownTitle}`;
            timeEls[0].textContent = `${days}`;
            timeEls[1].textContent = `${hours}`;
            timeEls[2].textContent = `${minutes}`;
            timeEls[3].textContent = `${seconds}`;
            completeEl.hidden = true;
            countdownEl.hidden = false;
        }
    }, second);
}

// Get Values from Form input
function updateCountdown(e) {
    e.preventDefault();
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;
    savedCountdown = {
        title: countdownTitle,
        date: countdownDate,
    };
    localStorage.setItem('countdown', JSON.stringify(savedCountdown));
    if (countdownDate === '') {
        alert('Date must not be empty');
    } else {
        // Get number version of current Date, update DOM
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}

// Reset All Values
function reset() {
    // Hide Countdowns, show inputs
    countdownEl.hidden = true;
    completeEl.hidden = true;
    inputContainer.hidden = false;
    // Stopr the countdown
    clearInterval(countdownActive);
    // Reset values
    countdownTitle = '';
    countdownDate = '';
    localStorage.removeItem('countdown');
}

function restorePreviousCountdown() {
    // Get countdown from localStorage if available
    if (localStorage.getItem('countdown')) {
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}

// Event Listeners
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

// On load, check localStorage
restorePreviousCountdown();