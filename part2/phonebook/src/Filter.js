import React from 'react'

const Filter = ({ filterName, handleFilterInput }) => {
    return (
        <div>
            filter shown with
            <input
                value={filterName}
                onChange={handleFilterInput}
            />
        </div>
    )
}

export default Filter
