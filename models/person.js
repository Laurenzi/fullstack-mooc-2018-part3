const mongoose = require("mongoose")

const url = process.env.MONGODB_URI

mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

Person.format = (person) => {
    return {
        id: person._id,
        name: person.name,
        number: person.number
    }
}

module.exports = Person
