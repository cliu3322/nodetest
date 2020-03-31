var express = require('express');
var router = express.Router();
var models  = require('../models');
var base64url = require('base64url');
const sequelize = require('sequelize');
var MailConfig = require('../email/config');
var hbs = require('nodemailer-express-handlebars');
var gmailTransport = MailConfig.GmailTransport;
const moment = require('moment');
MailConfig.ViewOption(gmailTransport,hbs);
/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.query)

	res.json({
		status: 200,
		message: 'succcesful',
	});
});


router.get('/assessment',async function(req, res, next) {
  const claimID = base64url.decode(req.query.id)
  //retrieve policy: Approved YTD, policy Type
  //from Regency WT: Isured person, Previous, Start Date
  //? Approved YTD, Gross premium, Payment Frequency


  //retrieve claim, we don't have gender

  const assessment = await models.Acessment.findByPk(claimID, {attributes: ['adhere', 'forPreExisting','otherExclusion','reasonable','relatePreExisting']})

  const evaluate = await models.Comments.findOne({
    where: {
      claimInfoId:claimID,
      group:'evaluate'
    },
    order: [ [ 'createdAt', 'DESC' ]]
  }).then(evaluate => evaluate);
  res.send({assessment ,evaluate})
  //retrieve patient, we should build patient db in the future

});

router.post('/assessment',async function(req, res, next) {
  var comment = req.body.comment
  const commentResult = await models.Comments.create(comment)
  const assessmentResult = await  models.Acessment.findByPk(req.body.assessment.claimInfoId).then(assessment => {
    if(assessment) {
      return assessment.update(req.body.assessment)
    } else {
      return models.Acessment.create(req.body.assessment)
    }
  })
  const claimResult = await models.ClaimInfo.findByPk(req.body.assessment.claimInfoId).then(item => {
    return item.update({ status: req.body.status})
  })
  res.send({commentResult,assessmentResult ,claimResult})
});

router.get('/policyClaims', function(req, res, next) {
  const claimID = req.query.id
  models.ClaimInfo.findByPk(claimID, {attributes: [ 'policyNumber']}).then(claim => {
    models.ClaimInfo.findAll({
      where: {
        policyNumber: claim.policyNumber,
        status:{[sequelize.Op.or]:['ca', 'cp', 'cc']}
      },
      attributes: ['id', 'createdAt','cause'],
      include: [{
        model:models.ClaimInfoVisits,
        attributes: ['id', 'billingRate',],
        include: [
          {
            model: models.BillingInfo,
          },
        ],
      }],
    }).then(patientClaims => {
      res.send(patientClaims)
    })
  })
  //retrieve patient, we should build patient db in the future
});

router.get('/patientClaims', function(req, res, next) {
  const claimID = req.query.id
  models.ClaimInfo.findByPk(claimID, {attributes: ['patientFirstName', 'patientLastName','patientDob', 'policyNumber']}).then(claim => {
    models.ClaimInfo.findAll({
      where: {
        policyNumber: claim.policyNumber,
        patientFirstName: claim.patientFirstName,
        patientLastName: claim.patientLastName,
        patientDob:claim.patientDob, 
        status:{[sequelize.Op.or]:['ca', 'cp', 'cc']}
      },
      attributes: ['id', 'createdAt','cause'],
      include: [{
        model:models.ClaimInfoVisits,
        attributes: ['id', 'billingRate',],
        include: [
          {
            model: models.BillingInfo,
          },
        ],
      }],
    }).then(patientClaims => {
      res.send(patientClaims)
    })
  })


  //retrieve patient, we should build patient db in the future

});

// router.post('/decision', function(req, res, next) {
//   // const claimID = base64url.decode(req.query.id)
//   console.log(req.body)
//   models.Comments.create(req.body.decision).then(comment => {
//     models.ClaimInfo.findByPk(req.body.decision.claimInfoId).then(item => {
//       return item.update({ approvedAt: Date.now(), ...req.body.status})
//     })
//     res.json(comment);
//   }).catch( e => {
//     console.log(e)
//     res.sendStatus(500).send(e)
//   })


// });


router.post('/decision', async function(req, res, next) {
  // const claimID = base64url.decode(req.query.id)
  try {
    console.log(req.body)
    await models.Comments.create(req.body.decision)
    const claim = await models.ClaimInfo.findByPk('RIH/YYYY/XX/11111111-15', {
      include: [{
        model:models.ClaimInfoVisits,
        attributes: ['id', 'dateOfAdmissionVisit','hospitalOrClinicName','billingCurrency', 'billingRate'],
        include: [{
          model:models.BillingInfo,
          attributes: ['value', 'approved'],
        }],
      }],
    }).then(item => {
      return item.update({ approvedAt: Date.now(), ...req.body.status})
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

      let template, subject
      if(req.body.status.decisionStatus === 'approved') {
        template = 'decision_approved'
        subject = 'Your claim has been approved'
      } else if (req.body.status.decisionStatus === 'declined') {
        template = 'decision_declined'
        subject =  'Your claim has been assessed'
      } else {
        throw new Error('status is not correct');
      }
      MailConfig.ViewOption(gmailTransport,hbs);
      const contactName = result.contactFirstName + ' ' + result.contactLastName
      const patientName = result.patientFirstName + ' ' + result.patientLastName
      const reason = "<p>this si the because</p>"
      var email = {
        from: MailConfig.from, // sender address
        to: setting.forwardEmail+','+result.contactEmail, 
        subject: subject, // Subject line
        template: 'decision_approved',
        context: {
          ucn:result.id,
          visits:visits,
          contactName:contactName,
          patientName: contactName===patientName?'your':(patientName+"'s"),
          cause: result.cause,
          email: "eric.liu.bkk@gmail.com",
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
    console.log(claim)
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }


    // models.ClaimInfo.findByPk(req.body.decision.claimInfoId, {
    //   include: [{
    //     model:models.ClaimInfoVisits,
    //     attributes: ['id', 'dateOfAdmissionVisit','hospitalOrClinicName','billingCurrency', 'billingRate'],
    //     include: [{
    //       model:models.BillingInfo,
    //       attributes: ['value', 'approved'],
    //     }],
    //   }],
    // }).then(item => {
    //   console.log('item', item)
    //   item.update({ approvedAt: Date.now(), ...req.body.status}).then(async updated => {
    //     const setting = await models.SharedSettings.findOne({limit: 1,order: [ [ 'createdAt', 'DESC' ]]})
    //     const result = item.toJSON()
    //     const status = result.status
    //     console.log(result)
    //     let template
    //     if(req.body.status === 'approved') {
    //       template = 'decision_approved'
    //     } else if (req.body.status === 'declined') {
    //       template = 'decision_declined'
    //     } else {
    //       throw new Error('status is not correct');
    //     }
    //     var email = {
    //       from: MailConfig.from, // sender address
    //       to:  'eric.liu.bkk@gmail.com, '+ req.body.decision.contactEmail,// list of receivers
    //       subject: 'decision', // Subject line
    //       template: 'decision',
    //       context: {
    //         value: req.body.decision.email,
    //       },
    //       attachments: [
    //         {
    //           filename: 'a.png',
    //           path: __dirname +'/../views/img/a.png',
    //           cid: 'unique@unique' //same cid value as in the html img src
    //         }
    //       ]
    //     }
      
    //     gmailTransport.sendMail(email).then(result => {
    //       res.send(result)
    //     }).catch(e=> {
    //       console.log(e);
    //       res.status(500).send(e)
    //     });
    //   })
    // })



});



module.exports = router;
