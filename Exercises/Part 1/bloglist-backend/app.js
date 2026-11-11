import express from "express"
import mongoose from "mongoose"
import dns from "node:dns"
import blogsRouter from "./controllers/blogs.js"
import usersRouter from "./controllers/users.js"
import loginRouter from "./controllers/login.js"
import middleware from "./utils/middleware.js"
import config from "./utils/config.js"

const app = express()

dns.setServers(["1.1.1.1", "8.8.8.8"])

mongoose.connect(config.MONGODB_URI, { family: 4 })

app.use(express.json())

app.use(middleware.tokenExtractor)

app.use("/api/login", loginRouter)
app.use("/api/blogs", blogsRouter)
app.use("/api/users", usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app
