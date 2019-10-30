import { O_NONBLOCK } from 'constants';

const http = require('http')
const https = require('https')

const express = require('express')
const url = require('url')
const bodyParser = require('body-parser')
const nunjucks = require('nunjucks')

const app = express()

app.use(bodyParser.json())

const asset = __dirname + '/static'
app.use('/static', express.static(asset))

nunjucks.configure('templates', {
  autoescape: true,
  express: app,
  noCache: true
})

const log = console.log.bind(console)

const clientByProtocol = (protocol) => {
  if (protocol === 'http:') {
    return http
  } else {
    return https
  }
}

const apiOptions = () => {
  const envServer = process.env.apiServer
  const defaultServer = 'http://0.0.0.0:4000'
  const server = envServer || defaultServer
  const result = url.parse(server)
  const obj = {
    headers: {
      'Content-Type': 'application/json'
    },
    rejectUnauthorized: false
  }
  const options = Object.assign({}, obj, result)

  if (options.href.length > 0) {
    delete options.href
  }

  return options
}