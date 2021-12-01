import React from 'react'
import Person from './Person'

const Persons = ({ phonesToShow }) => {
    return (
        phonesToShow.map(person => {
            return <Person key={person.name} person={person} />
        })
    )
}

export default Persons
