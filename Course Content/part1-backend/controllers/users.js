import express from "express"
import bcrypt from "bcrypt"
import User from "../models/user.js"

const usersRouter = express.Router()

usersRouter.get("/", async (request, response) => {
  const users = User.find({})
  response.json(users)
})

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

export default usersRouter
