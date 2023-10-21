import { createServer } from 'node:http'
import { Buffer } from 'node:buffer'
import { json } from 'node:stream/consumers'

const PORT = 3000

const cars = { }

const server = createServer(async (request, response) => {
    // https://nodejs.org/api/url.html#url-strings-and-url-objects
    // request.url: '/cars/42' -> resource: 'cars', idStr: '42'
    //const pathname = request.url.split('?')[0]
    const pathname = new URL(request.url, `http://${request.headers.host}`).pathname
    const [ , resource, idStr ] = pathname.split('/')

    const idNum = Number(idStr)
    const id = Math.trunc(idNum) // NaN and Infinity must be handled later
    const validID = Number.isInteger(id) && id > 0 && id === idNum && id in cars

    if ((resource !== 'cars') || (idStr && !validID)) {
        response.statusCode = 404
        response.end()
        return
    }

    const { method } = request

    if (method === 'GET' || method === 'HEAD') {
        //                GET /cars/42 or GET /cars
        const data = validID ? cars[id] : cars
        const buffer = Buffer.from(JSON.stringify(data))
        response.setHeader('Content-Type', 'application/json')
        response.setHeader('Content-Length', buffer.length)
        method === 'GET' && response.write(buffer)
    }
    else if (method === 'POST') {
        const data = await json(request)
        const id = Math.max(0, ...Object.keys(cars).map(Number)) + 1
        cars[id] = { ...data, id }
        response.statusCode = 201
        response.setHeader('Location', `/cars/${id}`)
    }
    else if (method === 'PUT' && validID) {
        const data = await json(request)
        cars[id] = { ...data, id }
        response.statusCode = 204
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
