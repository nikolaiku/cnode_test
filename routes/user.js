const { log, randomStr } = require('../utils')
const {
    session,
    currentUser,
    template,
    loginRequired,
    headerFromMapper
} = require('./main')

const User = require('../models/user')

const login = (request) => {
    const headers = {
        'Content-type': 'text/html'
    }
    let result
    log('debug request method', request.method)
    if (request.method === 'POST') {
        const form = request.form()
        const u = User.create(form)

        if (u.validateLogin()) {
            const sid = randomStr()
            session[sid] = u.username
            headers['Set-Cookie'] = `user=${sid}`
            result = '登录成功'
        } else {
            result = '用户名或密码错误'
        }
    } else {
        result = ''
    }
    const u = currentUser(request)
    let username
    if (u === null) {
        username = ''
    } else {
        username = u.username
    }
    let body = template('login.html')
    body = body.replace('{{username}}', username)
    body = body.replace('{{result}}', result)
    const header = headerFromMapper(headers)
    const r = header + '\r\n' + body
    return r
}

const register = (request) => {
    let result
    if (request.method === 'POST') {
        const form = request.form()
        const u = User.create(form)
        if (u.validateRegister()) {
            u.save()
            const us = User.all()
            result = `注册成功<br><pre>${us}</pre>`
        } else {
            result = `用户名和密码长度必须大于2或者用户名已存在`
        }
    } else {
        result = ''
    }
    let body = template('register.html')
    body = body.replace('{{result}}', result)
    const headers = {
        'Content-type': 'text/html'
    }
    const header = headerFromMapper(headers)
    const r = header + '\r\n' + body
    return r
}

const profile = (request) => {
    const headers = {
        'Content-type': 'text/html'
    }
    const header = headerFromMapper(headers)
    let body = template('profile.html')
    const u = currentUser(request)
    body = body.replace('{{username}}', u.username)
    body = body.replace('{{password}}', u.password)
    body = body.replace('{{note}}', u.note)
    const r = header + '\r\n' + body
    return r
}

const routeUser = {
    '/login': login,
    '/register': register,
    '/profile': loginRequired(profile)
}

module.exports = routeUser