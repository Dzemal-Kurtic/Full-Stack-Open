import React from 'react'

const Filter = ({ filterCountries, handleFilterCountries }) => {
    return (
        <>
            <input value={filterCountries} onChange={handleFilterCountries} />
        </>
    )
}

export default Filter
