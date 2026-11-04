import "dotenv/config"
import express from "express"
import Note from "./models/note.js"

let notes = []

const requestLogger = (req, res, next) => {
  console.log(`Method ${req.method}`)
  console.log(`Path   ${req.path}`)
  console.log(`Body   ${req.body}`)
  console.log(`-------`)
  next()
}
const app = express()

app.use(express.static("dist"))
app.use(express.json())
app.use(requestLogger)

app.get("/api/notes", (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes)
  })
})

app.get("/api/notes/:id", (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (note) {
        res.json(note)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.post("/api/notes", (req, res) => {
  const body = req.body

  if (!body.content) {
    return res.status(400).json({ error: "content missing" })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then((savedNote) => {
    response.json(savedNote)
  })
})

app.put("/api/notes/:id", (req, res, next) => {
  const { content, important } = req.body
  Note.findById(req.params.id)
    .then((note) => {
      if (!note) {
        return res.status(404).end()
      }
      note.content = content
      note.important = important

      return note.save().then((updatedNote) => {
        res.json(updatedNote)
      })
    })
    .catch((error) => next(error))
})

app.delete("/api/notes/:id", (req, res) => {
  Note.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.log(error)
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})
