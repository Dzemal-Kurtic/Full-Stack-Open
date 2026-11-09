import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import User from "../models/user.js"

const loginRouter = express.Router()

loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.json(401).send({ error: "invalid username or password" })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = await jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  })

  response.status(200).json({
    token,
    username: user.username,
    name: user.name,
  })
})

export default loginRouter
