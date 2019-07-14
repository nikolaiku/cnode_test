const fs = require('fs')

const {
    session,
    currentUser,
    template,
    headerFromMapper
} = require('./main')


const index = (request) => {
    const headers = {
        'Content-type': 'text/html'
    }
    const header = headerFromMapper(headers)
    let body = template('index.html')
    const u = currentUser(request)

    const username = u ? u.username : ''
    body = body.replace('{{username}}', username)
    const r = header + '\r\n' + body
    return r
}

const static = (request) => {
    const filename = require.query.file || 'doge.gif'
    const path = `static/${filename}`
    const body = fs.readFileSync(path)
    const header = headerFromMapper()

    const h = Buffer.from(header + '\r\n')
    const r = Buffer.concat([h, body])
    return r
}

const favicon = (request) => {
    const filename = 'favicon.ico'
    const path = `static/${filename}`
    const body = fs.readFileSync(path)
    const header = headerFromMapper()

    const h = Buffer.from(header + '\r\n')
    const r = Buffer.concat([h, body])
    return r
}

const routeIndex = {
    '/': index,
    '/static': static,
    '/favicon.ico': favicon
}

module.exports = routeIndex
