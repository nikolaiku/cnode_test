const express = require('express')

const User = require('../models/user')
const { log } = require('../utils')
const { currentUser } = require('./main')

const index = express.Router()

index.get('/', (request, response) => {
    response.redirect('/topic')
})

// 获取页面
index.get('/login', (request, response) => {
    const args = {
        next_url: request.query.next_url || ''
    }
    response.render('index/login.html', args)
})

// 验证用户名和密码后重定向到nextUrl
index.post('/login', (request, response) => {
    const form = request.body
    const u = User.findOne('username', form.username)
    if (u.validateAuth(form)) {
        // 直接指定 request.session 的 key, 然后通过这个 key 来获取设置的值
        request.session.uid = u.id
        const nextUrl = form.next_url || '/'
        response.redirect(nextUrl)
    }
})

// 获取页面
index.get('/register', (request, response) => {
    response.render('index/register.html')
})

// 注册用户后重定向
index.post('/register', (request, response) => {
    const form = request.body
    const u = User.create(form)
    response.redirect('/login')
})

//清除数据后重定向
index.get('/logout', (request, response) => {
    request.session = null
    response.redirect('/')
})

module.exports = index

