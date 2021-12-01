import React from 'react'
import CountryInfo from './CountryInfo'
import { useState } from 'react'

const Country = ({ country }) => {
    const [showDetails, setShowDetails] = useState(false)

    const showCountryInfo = () => {
        setShowDetails(!showDetails)
    }

    if (!showDetails) {
        return (
            <div>
                {country.name.common}
                <button onClick={showCountryInfo}>show</button>
            </div>)
    }
    return (
        <div>
            {country.name.common}
            <CountryInfo country={country} />
            <button onClick={showCountryInfo}>hide</button>
        </div>
    )
}

export default Country
