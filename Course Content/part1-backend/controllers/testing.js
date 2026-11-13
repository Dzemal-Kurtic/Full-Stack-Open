import express from "express"
import Note from "../models/note.js"
import User from "../models/user.js"

const router = express.Router()

router.post("/reset", async (request, response) => {
  await Note.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

export default router
