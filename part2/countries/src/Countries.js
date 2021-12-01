import React from 'react'
import Country from './Country'
import CountryInfo from './CountryInfo'

const Countries = ({ filteredCountries }) => {
    if (filteredCountries.length > 10) {
        return (
            <div>
                Too many matches. Specify another filter
            </div>
        )
    } else if (filteredCountries.length === 1) {
        return (
            <>
                <CountryInfo country={filteredCountries[0]} />
            </>
        )
    }
    return (
        <>
            {filteredCountries.map(country =>
                <Country key={country.name.common} country={country} />
            )}
        </>
    )
}

export default Countries
