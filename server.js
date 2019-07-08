const net = require('net')

const host = ''
const port = 7000

const server = new net.Server()

server.listen(port, host, () => {
    console.log('listening === >', server.address)
})

server.on('connection', (socket) => {
    const address = socket.remoteAddress
    const port = socket.remotePort
    const family = socket.remoteFamily

    console.log('connected client info === > ', address, port, family)

    socket.on('data', (data) => {
        const r = data.toString()
        console.log('接收到的原始数据 === > ', r)

        const response = 'hello world'

        socket.write(response)
    })
})

server.on('error', (error) => {
    console.log('server error', error)
})

server.on('close', () => {
    console.log('server closed')
})