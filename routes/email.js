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
router.get('/', async function (req, res, next) {
  const claim = await models.ClaimInfo.findByPk('RIH/YYYY/XX/11111111-5', {
    include: [{
      model:models.ClaimInfoVisits,
      attributes: ['id', 'dateOfAdmissionVisit','hospitalOrClinicName',],
    }],
  })
  const result = claim.toJSON()
  MailConfig.ViewOption(gmailTransport,hbs);
  var email = {
    from: 'vip@whitehouse.org', // sender address
    to: 'cliu3322@hawaii.edu'+','+result.contactEmail, // list of receivers
    subject: 'Your claim has been registered', // Subject line
    template: 'red_v3',
    context: {
      ucn:result.id,
      visits:result.ClaimInfoVisits,
      contactName:result.contactFirstName + ' ' + result.contactLastName,
      patientName: result.patientFirstName + ' ' + result.patientLastName,
      cause: result.cause,
      email: "tariqul.islam.rony@gmail.com",
      address: req.body.claimID
    },
    attachments: [{
        filename: 'a.png',
        path: __dirname +'/../views/img/a.png',
        cid: 'unique@nodemailer.com' //same cid value as in the html img src
    }]
  }
  console.log(email)
  gmailTransport.sendMail(email).then(result => {
    res.send(result)
  }).catch(e=> {
    console.log(e);
    res.status(500).send(e)
  });
})


router.get('/test', async function (req, res, next) {
  MailConfig.ViewOption(gmailTransport,hbs);
  var email = {
    from: 'vip@whitehouse.org', // sender address
    to: 'cliu3322@hawaii.edu'+',eric.sqlserver@gmail.com', // list of receivers
    subject: 'Your claim has been registered', // Subject line
    template: 'payment',
    context: {
      ucn:'result.id',
    },
    attachments: [{
        filename: 'a.png',
        path: __dirname +'/../views/img/a.png',
        cid: 'unique@nodemailer.com' //same cid value as in the html img src
    }]
  }
  console.log(email)
  gmailTransport.sendMail(email).then(result => {
    res.send(result)
  }).catch(e=> {
    console.log(e);
    res.status(500).send(e)
  });
})


router.get('/send', awaitErorrHandlerFactory(async (req, res, next) => {
  console.log(req.body)
  var result = await main().catch(console.error);
  res.send(result)
}))

router.post('/send', awaitErorrHandlerFactory(async (req, res, next) => {
  console.log(req.body)
  const claim = await models.ClaimInfo.findByPk(req.body.claimID, {
    include: [{
      model:models.ClaimInfoVisits,
      attributes: ['id', 'dateOfAdmissionVisit','hospitalOrClinicName',],
    }],
  })
  const result = claim.toJSON()
  MailConfig.ViewOption(gmailTransport,hbs);
  var email = {
    from: 'vip@whitehouse.org', // sender address
    to: 'cliu3322@hawaii.edu'+','+result.contactEmail, // list of receivers
    subject: 'Your claim has been registered', // Subject line
    template: 'red_v3',
    context: {
      ucn:result.id,
      visits:result.ClaimInfoVisits,
      contactName:result.contactFirstName + ' ' + result.contactLastName,
      patientName: result.patientFirstName + ' ' + result.patientLastName,
      cause: result.cause,
      email: "tariqul.islam.rony@gmail.com",
      address: req.body.claimID
    },
    attachments: [{
        filename: 'a.png',
        path: __dirname +'/../views/img/a.png',
        cid: 'unique@nodemailer.com' //same cid value as in the html img src
    }]
  }
  console.log(email)
  gmailTransport.sendMail(email).then(result => {
    res.send(result)
  }).catch(e=> {
    console.log(e);
    res.status(500).send(e)
  });
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
        to: 'eric.sqlserver@gmail.com', // list of receivers
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
        to: 'eric.sqlserver@gmail.com', // list of receivers
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
