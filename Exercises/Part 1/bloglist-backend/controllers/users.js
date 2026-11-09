import express from "express"
import bcrypt from "bcrypt"
import User from "../models/user.js"

const usersRouter = express.Router()

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  })
  response.json(users)
})

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body

  if (!(password && password.length >= 3)) {
    return response
      .status(400)
      .send({ error: "password must be at least 3 characters long" })
  }

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
