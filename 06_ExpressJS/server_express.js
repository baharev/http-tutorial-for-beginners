import express from 'express'

const PORT = 3000

const cars = { }

const app = express()

app.use(express.json())

app.param('id', (request, response, next, idStr) => {
    const idNum = Number(idStr)
    const id = Math.trunc(idNum) // NaN and Infinity must be handled later
    const validInt = Number.isInteger(id) && id > 0 && id === idNum
    if (validInt && id in cars) {
        request.params.id = id
        next()
    }
    else if (validInt)
        response.sendStatus(404)
    else
        response.status(400).send({ error: `invalid ID: ${idStr}` })
})

app.get('/cars', (request, response) => {
    response.send(cars)
})

app.get('/cars/:id', (request, response) => {
    const { id } = request.params
    response.send(cars[id])
})

app.post('/cars', (request, response) => {
    const data = request.body
    const id = Math.max(0, ...Object.keys(cars).map(Number)) + 1
    cars[id] = { ...data, id }
    response.status(201).location(`/cars/${id}`).end()
})

app.put('/cars/:id', (request, response) => {
    const data = request.body
    const { id } = request.params
    cars[id] = { ...data, id }
    response.sendStatus(204)
})

app.patch('/cars/:id', (request, response) => {
    const data = request.body
    const { id } = request.params
    cars[id] = { ...cars[id], ...data, id }
    response.sendStatus(204)
})

app.delete('/cars/:id', (request, response) => {
    const { id } = request.params
    delete cars[id]
    response.sendStatus(204)
})

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))
