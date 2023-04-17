import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const DEBOUNCE_DELAY = 300;
Notify.init({
  position: 'center-top',
  cssAnimationStyle: 'fade',
  fontSize: '20px',
  width: '450px',
  closeButton: false,
});

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  event.preventDefault();
  const name = event.target.value.trim();
  if (!name) {
    clearInputValue();
    return;
  }
  fetchCountries(name)
    .then(response => response.json())
    .then(data => {
      if (data.length > 10) {
        notifyInfo();
        clearInputValue();
        return;
      }
      generatContent(data);
    })
    .catch(error => {
      clearInputValue();
      notifyInfoError();
    });
}

function generatContent(elements) {
  let drawCountrys = '';
  let refsCountrys = '';
  clearInputValue();

  if (elements.length === 1) {
    drawCountrys = creatCountryInfo(elements);
    refsCountrys = refs.countryInfo;
  } else {
    drawCountrys = creatListCountrys(elements);
    refsCountrys = refs.countryList;
  }
  drawOnPage(refsCountrys, drawCountrys);
}

function creatCountryInfo(element) {
  return element.map(
    ({ flags, name, capital, population, languages }) => `
     <img src="${flags.svg}" width="200" alt="" class="flag_country">
    <h2 class="name_country">${name.official}</h2>
     <ul>
    <li class="list">Capital : ${capital}</li>
    <li class="list">Population : ${population}</li>
    <li class="list">Languages : ${Object.values(languages)}</li>   
  </ul>`
  );
}

function creatListCountrys(element) {
  return element.map(
    ({ flags, name }) => `
  <img src="${flags.svg}" width="200" alt="" class="flag_country">
    <h2 class="name_country">${name.official}</h2>
  `
  );
}

function clearInputValue() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}

function notifyInfo() {
  Notify.info('Too many matches found. Please enter a more specific name.');
}

function notifyInfoError() {
  Notify.failure('Oops, there is no country with that name');
}

function drawOnPage(refs, markup) {
  refs.innerHTML = markup;
}
