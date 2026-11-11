import jwt from "jsonwebtoken"
import User from "../models/user.js"

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("Authorization")
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "")
  } else {
    request.token = null
  }
  next()
}

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" })
  }

  const user = await User.findById(decodedToken.id)
  if (!user) {
    return response.status(401).json({ error: "user not found" })
  }

  request.user = user
  next()
}

const errorHandler = (error, request, response, next) => {
  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  }
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  }
  if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    return response
      .status(400)
      .json({ error: "expected 'username' to be unique" })
  }
  if (error.name === "JsonWebTokenError") {
    return response.status(401).send({ error: "token invalid" })
  }
  if (error.name === "TokenExpiredError") {
    return response.status(401).json({
      error: "token expired",
    })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

export default {
  tokenExtractor,
  userExtractor,
  errorHandler,
  unknownEndpoint,
}
