const express = require('express')

const User = require('../models/user')
const { log } = require('../utils')
const { currentUser } = require('./main')

const index = express.Router()

index.get('/', (request, response) => {
    console.log('>>>>>>>>>>>>>routes-index-/->')
    const userList = User.all()
    const u = currentUser(request)
    const args = {
        users: userList,
        user: u,
    }
    console.log('debug u and args', u, args)
    response.render('index/index.html', args)
})

// 获取页面
index.get('/login', (request, response) => {
    console.log('>>>>>>>>>>>>>routes-index-login-get->')
    const args = {
        next_url: request.query.next_url || ''
    }
    response.render('index/login.html', args)
})

// 调用接口
index.post('/login', (request, response) => {
    console.log('>>>>>>>>>>>>>routes-index-login-post->')
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
    console.log('>>>>>>>>>>>>>routes-index-register-get->')
    response.render('index/register.html')
})

// 调用接口
index.post('/register', (request, response) => {
    console.log('>>>>>>>>>>>>>routes-index-register-post->')
    const form = request.body
    const u = User.create(form)
    response.redirect('/')
})

index.get('/logout', (request, response) => {
    console.log('>>>>>>>>>>>>>routes-index-logout->')
    // 注销登录的时候, 将 session 清空就可以了
    request.session = null
    response.redirect('/')
})

module.exports = index

