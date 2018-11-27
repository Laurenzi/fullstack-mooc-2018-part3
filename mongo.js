const mongoose = require("mongoose")

if ( process.env.NODE_ENV !== 'production' ) {
    require('dotenv').config()
  }
  
const url = process.env.MONGODB_URI

mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

console.log("Argumenttien pituus:", process.argv.length)
process.argv.forEach(argument => {console.log(argument)})

if (process.argv.length === 4) {


const personObject = {
    name: process.argv[2],
    number: process.argv[3]
};

const newPerson = new Person(personObject)

newPerson.save()
.then(result => {
    console.log(`lisättiin henkilö ${result.name} numero ${result.number} puhelinluetteloon.`)
    mongoose.connection.close()
})

} else {
    Person.find({})
    .then(persons => {
        console.log("puhelinluettelo:")
        persons.map(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}