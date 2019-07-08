const net = require('net')

const host = '0.0.0.0'
const port = 7000

const client = new net.Socket()

client.connect(port, host, () => {
    console.log('connect to:', host, port)
    // 向服务器发送一个消息
    const request = 'data from client'
    client.write(request)
})

client.on('data', (d) => {
    console.log('data === > ', d, d.toString())
    client.destroy()
})

client.on('close', function () {
    console.log('connection closed')
})