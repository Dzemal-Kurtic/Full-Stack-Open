import React, { useState, useEffect } from 'react'
import Filter from './Filter'
import PersonForm from './PersonForm'
import Persons from './Persons'
import phoneService from './services/phonebook'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [filterName, setFilterName] = useState('')

  useEffect(() => {
    phoneService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
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

    const newPerson = {
      name: newName,
      number: newPhone
    }

    if (!persons.find(person => person["name"] === newName)) {


      phoneService.create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName("")
          setNewPhone("")
        })
    } else {
      const person = persons.find(person => person["name"] === newName)
      const result = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      if (result) {
        phoneService.update(person.id, newPerson)
        setPersons(persons.map(updatedPerson => updatedPerson.id === person.id ? newPerson : updatedPerson))
        setNewName("")
        setNewPhone("")
      }
    }
  }

  const deletePerson = (id) => {
    const person = persons.find(person => person.id === id)
    const result = window.confirm(`Delete ${person.name} ?`)
    if (result) {
      phoneService.deletePerson(id)
      setPersons(persons.filter(person => person.id !== id))
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
      <Persons phonesToShow={phonesToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App