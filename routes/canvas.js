const express = require('express')
const canvas = express.Router()

canvas.get('/', (request, response) => {
    response.render('canvas/index.html')
})

canvas.get('/bird', (request, response) => {
    response.render('canvas/flamengo.html')
})

canvas.get('/planet', (request, response) => {
    response.render('canvas/planet.html')
})

module.exports = canvas