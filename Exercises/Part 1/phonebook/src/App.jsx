import { useState, useEffect } from "react"

import personServices from "./services/persons"
import Filter from "./components/Filter"
import Form from "./components/Form"
import Persons from "./components/Persons"
import Notification from "./components/Notification"

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personServices.getAll().then((returnedPersons) => {
      setPersons(returnedPersons)
    })
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()

    const existingPerson = persons.find((person) => person.name === newName)
    if (existingPerson) {
      if (
        confirm(
          `${newName} is already added to the phonebook, replace the old number with the new one?`,
        )
      ) {
        const newPerson = {
          ...existingPerson,
          number: newNumber,
        }
        personServices
          .update(newPerson)
          .then((person) => {
            setPersons(persons.map((p) => (p.id !== person.id ? p : person)))
            setNewName("")
            setNewNumber("")
            setSuccessMessage(`Updated ${person.name}`)
            setTimeout(() => {
              setSuccessMessage(null)
            }, 4000)
          })
          .catch((error) => {
            setErrorMessage(
              `Information of ${newPerson.name} has already been removed from server`,
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 4000)
          })
      }
      return
    }
    const newPerson = {
      name: newName,
      number: newNumber,
    }

    personServices.create(newPerson).then((person) => {
      setPersons(persons.concat(person))
      setNewName("")
      setNewNumber("")
      setSuccessMessage(`Added ${person.name}`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 4000)
    })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleDelete = (id) => {
    const name = persons.find((person) => person.id === id).name
    if (confirm(`Delete ${name}`)) {
      personServices.remove(id).then(() => {
        setPersons(persons.filter((person) => person.id !== id))
      })
    }
  }

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} type={"success"} />
      <Notification message={errorMessage} type={"error"} />
      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
      <h3>Add a new</h3>
      <Form
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        handleSubmit={handleSubmit}
      />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App
