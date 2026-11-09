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
  errorHandler,
  unknownEndpoint,
}
