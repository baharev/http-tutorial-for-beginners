// This is a simplified code below.

import { createServer } from 'node:http'
import { json } from 'node:stream/consumers'

const PORT = 3000

// You would use a database in practice:
const cars = { 
    1: { make: "McLaren", year : 1992, id: 1 }
} 

const server = createServer(async (request, response) => {
    const { method } = request
    // request.url: '/cars/42' -> resource: 'cars', id: 42
    const [ , resource, idStr ] = request.url.split('/')
    const idNum = Number(idStr)
    const id = Math.trunc(idNum) // NaN and Infinity must be handled later
    const validID = Number.isInteger(id) && id > 0 && id === idNum && id in cars

    if ((resource !== 'cars') || (idStr && !validID)) {
        response.statusCode = 404
    }
    else if (method === 'GET') {
        //                GET /cars/42 or GET /cars
        const data = validID ? cars[id] : cars
        response.setHeader('Content-Type', 'application/json')
        response.write(JSON.stringify(data))
    }
    else if (method === 'POST') {
        const data = await json(request)
        const id = Math.max(0, ...Object.keys(cars).map(Number)) + 1
        cars[id] = { ...data, id }
        response.statusCode = 201
        response.setHeader('Location', `/cars/${id}`)
    }
    else if (method === 'PATCH' && validID) {
        const data = await json(request)
        cars[id] = { ...cars[id], ...data, id }
        response.statusCode = 204
    }
    else if (method === 'DELETE' && validID) {
        delete cars[id]
        response.statusCode = 204
    }
    else {
        response.statusCode = 400
    }
    
    response.end()
})

server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))
