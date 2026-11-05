import "dotenv/config"
import express from "express"
import morgan from "morgan"
import Person from "./models/person.js"

const app = express()
app.use(express.static("dist"))
app.use(express.json())
app.use(morgan("tiny"))

app.get("/info", (req, res, next) => {
  Person.find({})
    .then((notes) => {
      res.send(
        `<p>Phonebook has info for ${notes.length} people</p><p>${new Date()}</p>`,
      )
    })
    .catch((error) => next(error))
})

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons)
    })
    .catch((error) => next(error))
})

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (!person) {
        return res.status(404).end()
      }
      res.json(person)
    })
    .catch((error) => next(error))
})

app.post("/api/persons", (req, res, next) => {
  const body = req.body

  if (!body.name) {
    return res.status(400).json({ error: "name must be present" })
  }
  if (!body.number) {
    return res.status(400).json({ error: "number must be present" })
  }
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

app.put("/api/persons/:id", (req, res, next) => {
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

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((person) => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" })
}

const errorHandler = (error, req, res, next) => {
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" })
  }
  next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})
