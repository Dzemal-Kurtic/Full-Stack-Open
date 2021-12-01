import React from 'react'

const PersonForm = ({ addPerson, newName, handleInputChange, newPhone, handlePhoneInputChange }) => {
    return (
        <form onSubmit={addPerson}>
            <div>
                name:
                <input
                    value={newName}
                    onChange={handleInputChange}
                />
                <div>
                    number:
                    <input
                        value={newPhone}
                        onChange={handlePhoneInputChange}
                    />
                </div>
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default PersonForm
