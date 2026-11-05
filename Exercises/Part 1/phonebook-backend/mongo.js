import mongoose from "mongoose"
import dns from "node:dns"

dns.setServers(["1.1.1.1", "8.8.8.8"])

if (process.argv.length < 3) {
  console.log("Give password as argument")
  process.exit(1)
}

const url = process.env.MONGODB_URI

mongoose.set("strictQuery", false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model("Person", personSchema)

if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to the phonebook`)
    mongoose.connection.close()
  })
}
if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log("Phonebook:")
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}
