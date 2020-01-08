const express = require('express')
const canvas = express.Router()

const data = require('../static/temp/vc.js')

canvas.get('/', (request, response) => {
    response.render('canvas/index.html')
})

canvas.get('/bird', (request, response) => {
    response.render('canvas/flamengo.html')
})

canvas.get('/planet', (request, response) => {
    response.render('canvas/planet.html')
})

canvas.get('/resume', (request, response) => {
    const args = {
        info: data
    }
    response.render('canvas/resume.html', args)
})

module.exports = canvas