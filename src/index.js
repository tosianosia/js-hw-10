import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import getRefs from './js/getRefs';
import { fetchCountries } from './js/fetchCountries';
import './css/common.css';

const refs = getRefs();
const DEBOUNCE_DELAY = 300;
const ALERT_MESSAGE =
  'Too many matches found. Please enter a more specific name.';
const ERROR_MESSAGE = 'Oops, there is no country with that name';

refs.searchInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  const searchQuery = e.target.value;
  const name = searchQuery.trim();

  if (!name) {
    clearMarkup();
    return;
  }

  fetchCountries(name)
    .then(response => {
      clearMarkup();

      response.length > 10
        ? Notify.info(ALERT_MESSAGE)
        : renderMarkup(response);
    })
    .catch(() => {
      clearMarkup();
      Notify.failure(ERROR_MESSAGE);
    });
}

function renderMarkup(response) {
  if (response.length === 1) {
    refs.countryInfo.innerHTML = createCountryInfoMarkup(response);
  } else {
    refs.countryList.innerHTML = createCountryListMarkup(response);
  }
}

function createCountryListMarkup(countries) {
  return countries
    .map(({ name, flags }) => {
      return `
    <li class="country-item">
      <img src="${flags.svg}" alt="${name.official}" width="40">
      <p class="country-name">${name.official}</p>
    </li>
    `;
    })
    .join('');
}

function createCountryInfoMarkup(country) {
  return country
    .map(({ name, capital, population, flags, languages }) => {
      const allLanguages = Object.values(languages).join(', ');

      return `
      <div class="country-header">
        <img src="${flags.svg}" alt="${name.official}" width="40">
        <h2 class="country-name">${name.common}</h2>
      </div>
      <p class="country-text">Capital: <span class="country-value">${capital}</span></p>
      <p class="country-text">Population: <span class="country-value">${population}</span></p>
      <p class="country-text">
        Languages : <span class="country-value">${allLanguages}</span>
      </p>
      `;
    })
    .join('');
}

function clearMarkup() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}
