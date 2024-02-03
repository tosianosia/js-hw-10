const BASE_URL = 'https://restcountries.com/v3.1';
const searchParams = new URLSearchParams({
  fields: 'name,capital,population,flags,languages',
});

const fetchCountries = name => {
  return fetch(`${BASE_URL}/name/${name}?${searchParams}`).then(response => {
    if (response.ok) {
      return response.json();
    }

    throw new Error(response.statusText);
  });
};

export { fetchCountries };
