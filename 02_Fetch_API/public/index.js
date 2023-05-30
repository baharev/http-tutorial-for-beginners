// GET /data.json HTTP/1.1
// Host: localhost:3000
//
// (no body)

// https://developer.mozilla.org/en-US/docs/Web/API/fetch#syntax
//
// fetch(url, options)
// options = { method, headers, body }

const url = 'http://localhost:3000/data.json'

const options = {
    method: 'GET',
    headers: { },
    body: null,
}

const response = await fetch('/data.json')
