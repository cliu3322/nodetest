// https://docs.microsoft.com/en-us/outlook/rest/node-tutorial
//https://medium.com/@tariqul.islam.rony/sending-email-through-express-js-using-node-and-nodemailer-with-custom-functionality-a999bb7cd13c
//https://www.youtube.com/watch?v=38aE1lSAJZ8
var express = require('express')
var router = express.Router()
var models = require('../models')
const nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
var fs = require('fs');

var MailConfig = require('../email/config');
var gmailTransport = MailConfig.GmailTransport;






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
  console.log('trigger')
  var result = await main().catch(console.error);
  res.send(result)
}))


router.post('/sendhtml', awaitErorrHandlerFactory(async (req, res, next) => {

  var result = await sendhtml(req.body.html).catch(console.error);
  res.send(result)
}))


async function sendhtml(html) {
    MailConfig.ViewOption(gmailTransport,hbs);
    console.log(html)
    try {
      var info = await gmailTransport.sendMail({
        from: 'liuchunyi1987@hotmail.com', // sender address
        to: 'eric.sqlserver@gmail.com, cwhite@welcometoalliance.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        html: html,
        context: {
          name:"tariqul_islam",
          email: "tariqul.islam.rony@gmail.com",
          address: "52, Kadamtola Shubag dhaka"
        },
        attachments: [{
            filename: 'a.png',
            path: __dirname +'/../views/img/a.png',
            cid: 'unique@nodemailer.com' //same cid value as in the html img src
        }]
      });

      await gmailTransport.sendMail({
        from: 'liuchunyi1987@hotmail.com', // sender address
        to: 'eric.sqlserver@gmail.com, cwhite@welcometoalliance.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        template: 'test',
        context: {
          name: html,
          email: "tariqul.islam.rony@gmail.com",
          address: "52, Kadamtola Shubag dhaka"
        },
        attachments: [{
            filename: 'a.png',
            path: __dirname +'/../views/img/a.png',
            cid: 'unique@nodemailer.com' //same cid value as in the html img src
        }]
      });


      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      return info
    }
    catch (e) {
      console.log(e);
    }
}


async function main() {
    MailConfig.ViewOption(gmailTransport,hbs);


    try {
      var info = await gmailTransport.sendMail({
        from: 'liuchunyi1987@hotmail.com', // sender address
        to: 'eric.sqlserver@gmail.com, cliu3322@hawaii.edu', // list of receivers
        subject: 'Hello ✔', // Subject line
        template: 'threecolumns',
        context: {
          name:"tariqul_islam",
          email: "tariqul.islam.rony@gmail.com",
          address: "52, Kadamtola Shubag dhaka"
        },
        attachments: [{
            filename: 'a.png',
            path: __dirname +'/../views/img/a.png',
            cid: 'unique@nodemailer.com' //same cid value as in the html img src
        }]
      });



      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      return info
    }
    catch (e) {
      console.log(e);
    }
}

module.exports = router
