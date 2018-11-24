const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const app = express()

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
    response.json(persons)
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.post("/api/persons", (request, response) => {
    const id = Math.floor(Math.random() * Math.floor(60000));
    const body = request.body
    
    if (body.name === undefined) {
        return response.status(400).json({error: 'name missing'})
    } else if (body.number === undefined) {
        return response.status(400).json({error: 'name missing'})
    } else if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({error: 'name must be unique'})
    }
    const personObject = {
        name: body.name,
        number: body.number || '',
        id: id
    }
    
    persons = persons.concat(personObject)
    response.json(personObject)
})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        persons = persons.filter(person => person.id !== id)
        response.status(204).end()
    } else {
        response.status(404).end()
    }
})

app.get("/info", (request, response) => {
    console.log("saatiin pyyntö!")
    response.send(`<p>Puhelinluettelossa ${persons.reduce((acc, curr) => acc + 1, 0)} henkilön tiedot.</p>
    <p>${new Date()}<p>`)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
