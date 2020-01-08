const express = require('express')
const canvas = express.Router()

canvas.get('/', (request, response) => {
    response.render('canvas/index.html')
})

canvas.get('/bird', (request, response) => {
    response.render('canvas/flamengo.html')
})

module.exports = canvas