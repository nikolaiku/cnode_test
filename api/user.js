const express = require('express')

const User = require('../models/user')
const Model = User
const { log } = require('../utils')
const { jsonResponse } = require('./main')

const router = express.Router()

router.post('/all', (request, response) => {
    console.log('all>>>>>>>>>>>')
    const ms = Model.all()
    const dict = {
        success: true,
        data: ms,
        message: ''
    }
    jsonResponse(request, response, obj)
})

module.exports = router