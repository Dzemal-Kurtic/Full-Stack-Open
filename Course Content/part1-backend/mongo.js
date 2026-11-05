import mongoose from "mongoose"
import dns from "node:dns"

if (process.argv.length < 3) {
  console.log("give password as argument")
  process.exit(1)
}

dns.setServers(["1.1.1.1", "8.8.8.8"])

const url = process.env.MONGODB_URI

mongoose.set("strictQuery", false)

mongoose.connect(url, { family: 4 })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model("Note", noteSchema)

Note.find({}).then((result) => {
  result.forEach((note) => {
    console.log(note)
  })
  mongoose.connection.close()
})
