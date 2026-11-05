import express from "express"
import Person from "../models/person.js"

const personsRouter = express.Router()

personsRouter.get("/info", (req, res, next) => {
  Person.find({})
    .then((notes) => {
      res.send(
        `<p>Phonebook has info for ${notes.length} people</p><p>${new Date()}</p>`,
      )
    })
    .catch((error) => next(error))
})

personsRouter.get("/", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons)
    })
    .catch((error) => next(error))
})

personsRouter.get("/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (!person) {
        return res.status(404).end()
      }
      res.json(person)
    })
    .catch((error) => next(error))
})

personsRouter.post("/", (req, res, next) => {
  const body = req.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson)
    })
    .catch((error) => next(error))
})

personsRouter.put("/:id", (req, res, next) => {
  const { number } = req.body
  Person.findById(req.params.id)
    .then((person) => {
      if (!person) {
        return res.status(404).end()
      }
      person.number = number

      return person.save().then((updatedPerson) => {
        res.json(updatedPerson)
      })
    })
    .catch((error) => next(error))
})

personsRouter.delete("/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

export default personsRouter
