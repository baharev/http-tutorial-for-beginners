

# Server-side HTTP request-response cycle

We will implement the REST API that we discussed in the previous video.

# Accessing the attributes of the HTTP request

Let us assume that we have received the following HTTP request:

```
PATCH /cars/2
Host: localhost:3000
Content-Type: application/json

{
    "year": 2023
}
```

and we want to access the following attributes of this HTTP request on the server:

| attribute| value   |
|---------:|---------|
| method   | PATCH   |
| resource | cars    |
| ID       | 2       |
| body     | { year: 2023 } |

## In Node.js

Whenever we receive an HTTP request, Node.js will call our code with a `request` object.
This object has the following attributes:

 - `request.method`

 - `request.url` gives us `"/cars/2"` (ignoring query strings for now),
we have to parse it ourselves: `"cars"` and `2`

 - There is no `request.body` attribute for good reasons; we have to explicitly load the body ourselves.

```js
import { json } from 'node:stream/consumers'

const body = await json(request)
```

In practice, one would want to reject the request if the payload size is above a certain limit.


## In Express.js

Whatever works in Node.js, the same *usually* works in Express.js without any changes.


 - `request.method` would work but `app.patch()` is the idiomatic way in Express.js.

 - `request.path` gives us `"/cars/2"`, and just like in Node.js, we have to parse it ourselves: `"cars"` and `2`. However, unlike `request.url`, it correctly handles the query string by default.

 - We must explicitly ask Express.js to load the data into `request.body`:

```js
import express from 'express'

const app = express()

app.use(express.json())

// The data will be available as request.body
```

See also: https://expressjs.com/en/4x/api.html#express.json

Unlike Node.js, the size is always limited, the default `limit` is 100kb.

-------------------------------------------------------------

# Generating the server response

Let us assume that we have finished processing the following HTTP request:

```
POST /cars
Host: localhost:3000
Content-Type: application/json

{
    "make": "Ferrari",
    "year": 1987
}
```

and we want to send the following response back to the client:

```
HTTP/1.1 201 Created
Location: /cars/2
```

## In Node.js

When Node.js calls our code with the `request` object, it also gives us a
`response` object, and we “write” our response to this object. For example,
to create the above response, we write:

```js
response.statusCode = 201
response.setHeader('Location', '/cars/2')
response.end()
```

or (more or less the same) as a one-liner:

```js
response.writeHead(201, {'Location': '/cars/2'}).end()
```


## In Express.js

Whatever works in Node.js, the same *usually* works in Express.js without any changes. However, the idiomatic way to generate the above response in Express.js is:

```js
response.status(201).location('/cars/2').end()
```

---------------------------------------------------------------------

## Sending a response with data / message body

Let us assume that we have finished processing the following HTTP request:

```
GET /cars/2
Host: localhost:3000
```

and the server response includes a message body, the requested data:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "make": "Ferrari",
  "year": 1987,
  "id": 2
}
```

**In Node.js:**

```js
response.statusCode = 200
response.setHeader('Content-Type', 'application/json')
response.write(JSON.stringify({ make: "Ferrari", year: 1987, id: 2 }))
response.end()
```

A somewhat shorter solution (more or less the same as the above):

```js
response.writeHead(200, {'Content-Type': 'application/json'})
response.end(JSON.stringify({ make: "Ferrari", year: 1987, id: 2 }))
```

**In Express.js:**

```js
response.send({ make: "Ferrari", year: 1987, id: 2 })
```
