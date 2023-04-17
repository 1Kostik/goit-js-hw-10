const fetchCountries = function(name)  {
  return fetch(`https://restcountries.com/v3.1/name/${name}`);
}
export { fetchCountries };