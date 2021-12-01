import React from 'react'

const CountryInfo = ({ country }) => {
    const langArray = []
    for (const language in country.languages) {
        langArray.push(country.languages[language])
    }

    return (
        <div>
            <h2>{country.name.common}</h2>
            <p>capital {country.capital}</p>
            <p>population {country.population}</p>
            <h4>languages</h4>
            <ul>
                {langArray.map(lang => <li>{lang}</li>)}
            </ul>
            <img src={country.flags.png} alt="" />
        </div>
    )
}

export default CountryInfo
