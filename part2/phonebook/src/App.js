import axios from 'axios'
import React, { useState, useEffect } from 'react'
import Filter from './Filter'
import PersonForm from './PersonForm'
import Persons from './Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [filterName, setFilterName] = useState('')

  useEffect(() => {
    axios.get("http://localhost:3001/persons")
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const handleInputChange = (event) => {
    setNewName(event.target.value)
  }

  const handlePhoneInputChange = (event) => {
    setNewPhone(event.target.value)
  }

  const handleFilterInput = (event) => {
    setFilterName(event.target.value)
  }

  const phonesToShow = persons.filter(person => person["name"].toLowerCase().startsWith(filterName.toLowerCase()))

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
      <Filter filterName={filterName} handleFilterInput={handleFilterInput} />
      <h2>Add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleInputChange={handleInputChange}
        newPhone={newPhone}
        handlePhoneInputChange={handlePhoneInputChange}
      />
      <h2>Numbers</h2>
      <Persons phonesToShow={phonesToShow} />
    </div>
  )
}

export default App