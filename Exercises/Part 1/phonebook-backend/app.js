import express from "express"
import mongoose from "mongoose"
import dns from "node:dns"
import config from "./utils/config.js"
import logger from "./utils/logger.js"
import middleware from "./utils/middleware.js"
import personsRouter from "./controllers/persons.js"
import morgan from "morgan"

const app = express()

logger.info("connecting to MongoDB")

dns.setServers(["1.1.1.1", "8.8.8.8"])

mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    console.log("connected to MongoDB")
  })
  .catch((error) => {
    console.log(`error connecting to MongoDB: ${error.message}`)
  })

app.use(express.static("dist"))
app.use(express.json())
app.use(morgan("tiny"))
app.use(middleware.requestLogger)

app.use("/api/persons", personsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app
