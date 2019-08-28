// https://docs.microsoft.com/en-us/outlook/rest/node-tutorial

var express = require('express')
var router = express.Router()
var models = require('../models')
var nodeoutlook = require('nodejs-nodemailer-outlook')
var imaps = require('imap-simple')


var config = {
  imap: {
    user: 'liuchunyi1987@hotmail.com',
    password: 'baza7183',
    host: 'imap-mail.outlook.com',
    port: 993,
    tls: true,
    authTimeout: 3000
  }
}

// middleware to hanlde errors
const awaitErorrHandlerFactory = middleware => {
  return async (req, res, next) => {
    try {
      await middleware(req, res, next)
    } catch (err) {
      next(err)
    }
  }
}

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a test')
})

router.get('/send', awaitErorrHandlerFactory(async (req, res, next) => {
  imaps.connect(config).then(function (connection) {
    return connection.getBoxes((err, boxes) => console.log('boxes',boxes))
  }).catch(error => console.log(error))
}))

module.exports = router
