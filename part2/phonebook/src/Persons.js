import React from 'react'
import Person from './Person'

const Persons = ({ phonesToShow, deletePerson }) => {
    return (
        phonesToShow.map(person => {
            return <Person key={person.name} person={person} deletePerson={deletePerson} />
        })
    )
}

export default Persons
