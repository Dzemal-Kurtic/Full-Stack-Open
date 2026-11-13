import { useState, useEffect } from "react"
import { Routes, Route, Link, useMatch } from "react-router-dom"
import noteService from "./services/notes"
import Home from "./components/Home"
import Footer from "./components/Footer"
import NoteForm from "./components/NoteForm"
import NoteList from "./components/NoteList"
import Note from "./components/Note"

const App = () => {
  const [notes, setNotes] = useState([])

  const match = useMatch("/notes/:id")
  const note = match ? notes.find((note) => note.id === match.params.id) : null

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes)
    })
  }, [])

  const addNote = (noteObject) => {
    noteService.create(noteObject).then((returnedNote) => {
      setNotes(notes.concat(returnedNote))
    })
  }

  const deleteNote = (id) => {
    noteService.remove(id).then(() => {
      setNotes(notes.filter((n) => n.id !== id))
    })
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)))
      })
      .catch(() => {
        /*
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        */
        setNotes(notes.filter((n) => n.id !== id))
      })
  }

  const padding = {
    padding: 5,
  }

  return (
    <div>
      <div>
        <Link style={padding} to="/">
          home
        </Link>
        <Link style={padding} to="/notes">
          notes
        </Link>
        <Link style={padding} to="/create">
          new note
        </Link>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notes" element={<NoteList notes={notes} />} />
        <Route
          path="/notes/:id"
          element={
            <Note
              note={note}
              toggleImportanceOf={toggleImportanceOf}
              deleteNote={deleteNote}
            />
          }
        />
        <Route path="/create" element={<NoteForm createNote={addNote} />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
