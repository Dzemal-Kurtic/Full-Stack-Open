import express from "express"
import morgan from "morgan"
import cors from "cors"

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
]

const app = express()
app.use(express.static("dist"))
app.use(cors())
app.use(express.json())
app.use(morgan("tiny"))

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`,
  )
})

app.get("/api/persons", (req, res) => {
  res.json(persons)
})

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id
  const person = persons.find((person) => person.id === id)
  if (!person) {
    return res.status(404).end()
  }
  res.json(person)
})

const generateId = () => {
  return String(Math.floor(Math.random() * 9999999999))
}

app.post("/api/persons", (req, res) => {
  const body = req.body ?? {}
  if (!body.name) {
    return res.status(400).json({ error: "name must be present" })
  }
  const isPresent = persons.some((person) => person.name === body.name)
  if (isPresent) {
    return res.status(400).json({ error: "name must be unique" })
  }
  if (!body.number) {
    return res.status(400).json({ error: "number must be present" })
  }
  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }
  persons = persons.concat(newPerson)
  res.json(newPerson)
})

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id
  persons = persons.filter((person) => person.id !== id)
  res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})
