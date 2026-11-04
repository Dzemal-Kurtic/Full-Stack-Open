import "dotenv/config"
import express from "express"
import morgan from "morgan"
import Person from "./models/person.js"

let persons = []

const app = express()
app.use(express.static("dist"))
app.use(express.json())
app.use(morgan("tiny"))

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`,
  )
})

app.get("/api/persons", (req, res) => {
  Person.find({}).then((person) => {
    res.json(person)
  })
})

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then((person) => {
    res.json(person)
  })
})

app.post("/api/persons", (req, res) => {
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

  person.save().then((savedPerson) => {
    res.json(savedPerson)
  })
})

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id
  persons = persons.filter((person) => person.id !== id)
  res.status(204).end()
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})
