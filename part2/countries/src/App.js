import './App.css';
import Filter from './Filter';
import Countries from './Countries';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [countries, setCountries] = useState([])
  const [filterCountries, setFilterCountries] = useState("")

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all")
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFilterCountries = (event) => {
    setFilterCountries(event.target.value)
  }

  const filteredCountries = countries.filter(country => {
    return country.name.common.toLowerCase().includes(filterCountries.toLowerCase())
  })

  return (
    <>
      <div>
        find countries
        <Filter filterCountries={filterCountries} handleFilterCountries={handleFilterCountries} />
      </div>
      <Countries filteredCountries={filteredCountries} />
    </>)
}

export default App;
