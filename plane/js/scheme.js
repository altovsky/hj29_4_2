'use strict'

const acSelect = document.getElementById('acSelect'),
  btnSeatMap = document.getElementById('btnSeatMap'),
  btnSetFull = document.getElementById('btnSetFull'),
  btnSetEmpty = document.getElementById('btnSetEmpty'),
  seatMapTitle = document.getElementById('seatMapTitle'),
  seatMapDiv = document.getElementById('seatMapDiv'),
  totalPax = document.getElementById('totalPax'),
  totalAdult = document.getElementById('totalAdult'),
  totalHalf = document.getElementById('totalHalf'),
  xhr = new XMLHttpRequest();
xhr.addEventListener('load', showSeatMap);
btnSeatMap.addEventListener('click', getScheme);
btnSetEmpty.disabled = btnSetFull.disabled = true;

function getScheme(event) {
  event.preventDefault();

  xhr.open('GET', `https://neto-api.herokuapp.com/plane/${acSelect.value}`, true);
  xhr.send();
}

function reCalculate() {
  totalPax.textContent = document.querySelectorAll('.adult').length + document.querySelectorAll('.half').length;
  totalAdult.textContent = document.querySelectorAll('.adult').length;
  totalHalf.textContent = document.querySelectorAll('.half').length;
}

function selectAll(event) {
  event.preventDefault();

  Array.from(seatMapDiv.querySelectorAll('.seat')).forEach(seat => {
    seat.classList.add('adult');
    seat.classList.remove('half');
  });

  reCalculate();
}

function removeSelection(event) {
  event.preventDefault();

  Array.from(seatMapDiv.querySelectorAll('.seat')).forEach(seat => {
    seat.classList.remove('adult');
    seat.classList.remove('half');
  });

  reCalculate();
}

function createElement(tagName, attributes, children) {
  const element = document.createElement(tagName);

  if (typeof attributes === 'object') {
    element.className = attributes.class;
  }

  if (typeof children === 'string') {
    element.textContent = children;
  } else if (children instanceof Array) {
    children.forEach(child => {
      element.appendChild(child)
    });
  }

  return element;
}

function showSeatMap() {
  const data = JSON.parse(xhr.responseText);
  Array.from(seatMapDiv.children).forEach(child => {
    child.parentElement.removeChild(child)
  });

  seatMapTitle.textContent = `${data.title} (${data.passengers} пассажиров)`;

  data.scheme.forEach((row, i) => {
    const nextRow = createElement('div', { class: 'row seating-row text-center' },
      [ createElement('div', { class: 'col-xs-1 row-number' },
        [ createElement('h2', {}, `${i + 1}`) ])
      ]
    );

    const seats = document.createDocumentFragment();
    seats.appendChild(createElement('div', { class: 'col-xs-5' }, ''));
    seats.appendChild(createElement('div', { class: 'col-xs-5' }, ''));

    for (let i = 0; i < 6; i++) {
      const seat = createElement('div', {class: 'col-xs-4'}, '');

      if (row === 6 || (row === 4 && i !== 0 && i !== 5)) {
        seat.classList.add('seat');
        seat.appendChild(createElement('span', { class: 'seat-label' }, data.letters6[i]));
      } else {
        seat.classList.add('no-seat');
      }

      if (i < 3) {
        seats.firstElementChild.appendChild(seat);
      } else {
        seats.lastElementChild.appendChild(seat);
      }
    }

    nextRow.appendChild(seats);
    seatMapDiv.appendChild(nextRow);
  });

  reCalculate();

  btnSetFull.disabled = btnSetEmpty.disabled = false;
  btnSetEmpty.addEventListener('click', removeSelection);
  btnSetFull.addEventListener('click', selectAll);
  Array.from(document.querySelectorAll('.seat')).forEach(seat => {
    seat.addEventListener('click', seatSelection)
  });
}

function seatSelection(event) {
  const targetSeat = event.currentTarget;

  if (event.altKey && !targetSeat.classList.contains('adult')) {
    targetSeat.classList.add('half');
  } else if (targetSeat.classList.contains('half')) {
    targetSeat.classList.remove('adult');
    targetSeat.classList.remove('half');
  } else {
    targetSeat.classList.toggle('adult');
  }

  reCalculate();
}
