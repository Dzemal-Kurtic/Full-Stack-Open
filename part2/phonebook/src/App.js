import React, { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])

  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')

  const handleInputChange = (event) => {
    setNewName(event.target.value)
  }

  const handlePhoneInputChange = (event) => {
    setNewPhone(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    if (!persons.find(person => person["name"] === newName)) {
      setPersons([
        ...persons,
        {
          name: newName,
          number: newPhone
        }
      ])
    } else {
      alert(`${newName} is already added to phonebook`)
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with
        <input />
      </div>
      <h2>add a new</h2>
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
      <h2>Numbers</h2>
      {persons.map(person => {
        return <p key={person.name}>{person.name} {person.number}</p>
      })}
      <div>debug: {newName} {newPhone}</div>
    </div>
  )
}

export default App