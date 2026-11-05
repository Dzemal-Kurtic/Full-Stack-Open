import express from "express"
import mongoose from "mongoose"
import dns from "node:dns"
import "dotenv/config"
import blogsRouter from "./controllers/blogs.js"

const app = express()

dns.setServers(["1.1.1.1", "8.8.8.8"])

mongoose.connect(process.env.MONGODB_URI, { family: 4 })

app.use(express.json())

app.use("/api/blogs", blogsRouter)

export default app
