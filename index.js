const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())

const morgan = require('morgan')
const bodyParser = require('body-parser')

const Person = require('./models/person')

app.use(express.static('build'))

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))


app.use(bodyParser.json())

let persons = [
        {
          "name": "Martti Tienari",
          "number": "040-123456",
          "id": 2
        },
        {
          "name": "Arto Järvinen",
          "number": "040-123456",
          "id": 3
        },
        {
          "name": "Lea Kutvonen",
          "number": "040-123456",
          "id": 4
        },
        {
          "name": "Tervepä Terve",
          "number": "123123",
          "id": 6
        }
      ]
app.get("/api/persons", (request, response) => {
    Person.find({})
    .then(persons => {
        response.json(persons.map(Person.format))
    })
    
})

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id
    Person.findById(id)
    .then(person => {
        if (person) {
            response.json(Person.format(person))
        } else {
            response.status(404).end()
        }
    })
    .catch(error => {
        console.log("Saatiin virhe henkilön hakemisen yhteydessä:", error)
        response.status(400).send({error: 'malformatted id'})
    })
})

app.post("/api/persons", (request, response) => {

    const body = request.body
    
    if (body.name === undefined) {
        return response.status(400).json({error: 'name missing'})
    } else if (body.number === undefined) {
        return response.status(400).json({error: 'name missing'})
    } else {
        Person.find({name: body.name})
        .then(result => {
          if (result.length != 0) {
              console.log("Löytyi muka sama!", result)
              return response.status(400).json({error: 'name must be unique'})
          } else {
            const personObject = {
                name: body.name,
                number: body.number || ''
            }
            const newPerson = new Person(personObject)
                newPerson.save()
                .then(result => {
                return response.json(Person.format(result))
            })
          }
        })
    }
})

app.put("/api/persons/:id", (request, response) => {
    const id = request.params.id
    const updatedPerson = {
        name: request.body.name,
        number: request.body.number
    }

    Person.findByIdAndUpdate(id, updatedPerson, { new: true} )
    .then(updatedPerson => {
        console.log("Päivitetyn henkilön tiedot:", updatedPerson)
        response.json(Person.format(updatedPerson))
    })
    .catch(error => {
        console.log("Pieleen meni, poikkeus:", error)
        response.status(400).send({ error: "malformatted id" })
    })
})

app.delete("/api/persons/:id", (request, response) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => {
        console.log("Saatiin virhe henkilön poistamisen yhteydessä:", error)
        response.status(400).send({error: 'malformatted id'})
    })
})

app.get("/info", (request, response) => {
    Person.find({})
    .then(persons => 
    response.send(`<p>Puhelinluettelossa ${persons.reduce((acc, curr) => acc + 1, 0)} henkilön tiedot.</p>
    <p>${new Date()}<p>`))
    .catch(error => {
        response.send("<h1>Virhe haettaessa tietoja puhelinluettelosta.</h1>")
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
