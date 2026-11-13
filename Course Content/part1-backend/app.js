import express from "express"
import mongoose from "mongoose"
import config from "./utils/config.js"
import logger from "./utils/logger.js"
import middleware from "./utils/middleware.js"
import notesRouter from "./controllers/notes.js"
import usersRouter from "./controllers/users.js"
import loginRouter from "./controllers/login.js"
import testingRouter from "./controllers/testing.js"
import dns from "node:dns"

const app = express()

logger.info("connecting to MongoDB")

dns.setServers(["1.1.1.1", "8.8.8.8"])

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB")
  })
  .catch((error) => {
    logger.error("error connection to MongoDB:", error.message)
  })

app.use(express.static("dist"))
app.use(express.json())
app.use(middleware.requestLogger)

app.use("/api/login", loginRouter)
app.use("/api/notes", notesRouter)
app.use("/api/users", usersRouter)

if (process.env.NODE_ENV === "test") {
  app.use("/api/testing", testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app
