// https://docs.microsoft.com/en-us/outlook/rest/node-tutorial
//https://medium.com/@tariqul.islam.rony/sending-email-through-express-js-using-node-and-nodemailer-with-custom-functionality-a999bb7cd13c
//https://www.youtube.com/watch?v=38aE1lSAJZ8
var express = require('express')
var router = express.Router()
var models = require('../models')
var hbs = require('nodemailer-express-handlebars');
const moment = require('moment');
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
  const result = claim.toJSON().map(item => ({id:item.id, hospitalOrClinicName:item.hospitalOrClinicName, dateOfAdmissionVisit: moment(item.dateOfAdmissionVisit).format('DD MMM YYYY'),}))
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
  console.log(result.ClaimInfoVisits)
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
  try {
    const claim = await models.ClaimInfo.findByPk('sdf-5', {
      include: [{
        model:models.ClaimInfoVisits,
        attributes: ['id', 'dateOfAdmissionVisit','hospitalOrClinicName',],
      }],
    })
    const setting = await models.SharedSettings.findOne({limit: 1,order: [ [ 'createdAt', 'DESC' ]]})
    if(!(claim && setting)) {
      res.status(500).send({error: 'no record'})
    } else {
      const result = claim.toJSON()
      let visits = result.ClaimInfoVisits.map(item => ({
        id:item.id, hospitalOrClinicName:item.hospitalOrClinicName, 
        dateOfAdmissionVisit: moment(item.dateOfAdmissionVisit).format('DD MMM YYYY'),
        patient: result.contactFirstName + ' ' + result.contactLastName,
      }))
      MailConfig.ViewOption(gmailTransport,hbs);
      var email = {
        from: MailConfig.from, // sender address
        to: setting.forwardEmail+','+result.contactEmail, 
        subject: 'Your claim has been registered', // Subject line
        template: 'red_v3',
        context: {
          ucn:result.id,
          visits:visits,
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
      console.log(result.ClaimInfoVisits)
      var emailRes = await gmailTransport.sendMail(email)
      res.send(emailRes)
    }

  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }

}))



router.post('/send', awaitErorrHandlerFactory(async (req, res, next) => {
  console.log('req.body',req.body)
  try {
    const claim = await models.ClaimInfo.findByPk(req.body.claimID, {
      include: [{
        model:models.ClaimInfoVisits,
        attributes: ['id', 'dateOfAdmissionVisit','hospitalOrClinicName',],
      }],
    })
    const setting = await models.SharedSettings.findOne({limit: 1,order: [ [ 'createdAt', 'DESC' ]]})
    if(!(claim && setting)) {
      res.status(500).send({error: 'no record'})
    } else {
      const result = claim.toJSON()
      MailConfig.ViewOption(gmailTransport,hbs);
      var email = {
        from: 'vip@whitehouse.org', // sender address
        to: setting.forwardEmail+','+result.contactEmail, // list of receivers
        subject: 'Your claim has been registered', // Subject line
        template: 'red_v3',
        context: {
          ucn:result.id,
          visits:result.ClaimInfoVisits,
          contactName:result.contactFirstName + ' ' + result.contactLastName,
          patientName: result.patientFirstName + ' ' + result.patientLastName,
          cause: result.cause,
          email: result.contactEmail,
          address: req.body.claimID
        },
        attachments: [{
            filename: 'a.png',
            path: __dirname +'/../views/img/a.png',
            cid: 'unique@nodemailer.com' //same cid value as in the html img src
        }]
      }
      console.log('email', email)
      gmailTransport.sendMail(email).then(result => {
        console.log('result', result)
        res.send(result)
      }).catch(e=> {
        console.log(e);
        res.status(500).send(e)
      });
    }

  }
  catch (e) {
    console.log(e);
  }
}))



router.get('/decision_approved', awaitErorrHandlerFactory(async (req, res, next) => {
  try {
    const claim = await models.ClaimInfo.findByPk('RIH/YYYY/XX/11111111-15', {
      include: [{
        model:models.ClaimInfoVisits,
        attributes: ['id', 'dateOfAdmissionVisit','hospitalOrClinicName','billingCurrency', 'billingRate'],
        include: [{
          model:models.BillingInfo,
          attributes: ['value', 'approved'],
        }],
      }],
    })
    const setting = await models.SharedSettings.findOne({limit: 1,order: [ [ 'createdAt', 'DESC' ]]})
    if(!(claim && setting)) {
      res.status(500).send({error: 'no record'})
    } else {
      const result = claim.toJSON()
      const status = result.status
      let visits = result.ClaimInfoVisits.map(item => ({
        id:item.id, hospitalOrClinicName:item.hospitalOrClinicName, 
        dateOfAdmissionVisit: moment(item.dateOfAdmissionVisit).format('DD MMM YYYY'),
        patient: result.contactFirstName + ' ' + result.contactLastName,
        approved_billing: (item.BillingInfos.reduce((acc, curr) => (acc + curr.approved), 0)*item.billingRate).toFixed(2) + ' ' + item.billingCurrency, 
        approved_reimbursement: (item.BillingInfos.reduce((acc, curr) => (acc + curr.approved), 0)*result.RCExchangeRate).toFixed(2) + ' ' + result.reimbusementCurrency
      }))

      MailConfig.ViewOption(gmailTransport,hbs);
      const contactName = result.contactFirstName + ' ' + result.contactLastName
      const patientName = result.patientFirstName + ' ' + result.patientLastName
      const reason = "<p>this si the because</p>"
      console.log(result)
      var email = {
        from: MailConfig.from, // sender address
        to: setting.forwardEmail+','+result.contactEmail, 
        subject: 'Your claim has been approved', // Subject line
        template: 'decision_approved',
        context: {
          ucn:result.id,
          visits:visits,
          contactName:contactName,
          patientName: contactName===patientName?'your':(patientName+"'s"),
          cause: result.cause,
          email: "tariqul.islam.rony@gmail.com",
          address: req.body.claimID,
          status: status, 
          reason: reason, 
          bankName:result.bankName, 
          bankAddress:result.bankAddress,
          accountHolderName:result.accountHoldersName, 
          accountNumber:result.bankAccountNumber, 
          swift:result.swift, 
          iban:result.ibanCodeSortCode,
        },
        attachments: [{
            filename: 'a.png',
            path: __dirname +'/../views/img/a.png',
            cid: 'unique@nodemailer.com' //same cid value as in the html img src
        }]
      }
      var emailRes = await gmailTransport.sendMail(email)
      res.send(emailRes)
    }

  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }

}))



router.get('/decision_declined', awaitErorrHandlerFactory(async (req, res, next) => {
  try {
    const claim = await models.ClaimInfo.findByPk('RIH/YYYY/XX/11111111-15', {
      include: [{
        model:models.ClaimInfoVisits,
        attributes: ['id', 'dateOfAdmissionVisit','hospitalOrClinicName','billingCurrency', 'billingRate'],
        include: [{
          model:models.BillingInfo,
          attributes: ['value', 'approved'],
        }],
      }],
    })
    const setting = await models.SharedSettings.findOne({limit: 1,order: [ [ 'createdAt', 'DESC' ]]})
    if(!(claim && setting)) {
      res.status(500).send({error: 'no record'})
    } else {
      const result = claim.toJSON()
      const status = result.status
      let visits = result.ClaimInfoVisits.map(item => ({
        id:item.id, hospitalOrClinicName:item.hospitalOrClinicName, 
        dateOfAdmissionVisit: moment(item.dateOfAdmissionVisit).format('DD MMM YYYY'),
        patient: result.contactFirstName + ' ' + result.contactLastName,
        approved_billing: (item.BillingInfos.reduce((acc, curr) => (acc + curr.approved), 0)*item.billingRate).toFixed(2) + ' ' + item.billingCurrency, 
        approved_reimbursement: (item.BillingInfos.reduce((acc, curr) => (acc + curr.approved), 0)*result.RCExchangeRate).toFixed(2) + ' ' + result.reimbusementCurrency
      }))

      MailConfig.ViewOption(gmailTransport,hbs);
      const contactName = result.contactFirstName + ' ' + result.contactLastName
      const patientName = result.patientFirstName + ' ' + result.patientLastName
      const reason = "<p>this si the because</p>"
      console.log(result)
      var email = {
        from: MailConfig.from, // sender address
        to: setting.forwardEmail+','+result.contactEmail, 
        subject: 'Your claim has been assessed', // Subject line
        template: 'decision_declined',
        context: {
          ucn:result.id,
          visits:visits,
          contactName:contactName,
          patientName: contactName===patientName?'your':(patientName+"'s"),
          cause: result.cause,
          email: "tariqul.islam.rony@gmail.com",
          address: req.body.claimID,
          status: status, 
          reason: reason, 
          bankName:result.bankName, 
          bankAddress:result.bankAddress,
          accountHolderName:result.accountHoldersName, 
          accountNumber:result.bankAccountNumber, 
          swift:result.swift, 
          iban:result.ibanCodeSortCode,
        },
        attachments: [{
            filename: 'a.png',
            path: __dirname +'/../views/img/a.png',
            cid: 'unique@nodemailer.com' //same cid value as in the html img src
        }]
      }
      var emailRes = await gmailTransport.sendMail(email)
      res.send(emailRes)
    }

  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }

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
