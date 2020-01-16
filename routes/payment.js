
var express = require('express');
var router = express.Router();
var models  = require('../models');
var base64url = require('base64url');
const Excel = require('exceljs');
const sequelize = require('sequelize');
const moment = require('moment');
/* GET home page. */

const awaitErorrHandlerFactory = middleware => {

  return async (req, res, next) => {
    try {
      await middleware(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

router.get('/', function(req, res, next) {
    console.log(req.query)

    res.json({
        status: 200,
        message: 'succcesful',
    });
});


router.post('/upload', awaitErorrHandlerFactory(async (req, res, next) => {
  var form = new formidable.IncomingForm();
  form.uploadDir = "../upload/temp";
  form.keepExtensions = true;
  form.parse(req);
  form.on('error', err =>  {
      res.sendStatus(500)
  });

  form.on('file', (name, file) =>  {

  });

  form.on('file', (name, file) =>  {
    res.send({name:file.name, path:file.path });
  });


}));

router.get('/toBePaid', async function(req, res, next) {
    var response = {};
    var query = {}
    try {
      var claims = await models.ClaimInfo.findAll({
        where: {
            [sequelize.Op.and]: [
                {isSendToAccountant:{[sequelize.Op.is]:null}},
                {[sequelize.Op.or]: [{gop: 0}, {gop: null}]}, 
                {[sequelize.Op.or]: [{status: 'cp'}, {status: 'ca'}, , {status: 'cc'}]}
            ]
        },
        include: [{
          model:models.ClaimInfoVisits,
          attributes: ['id', 'billingRate'],
          include: [{
            attributes: ['value'],
            model: models.BillingInfo,
          }],
        }],
        raw: false
      });
  
  
      response = claims
    } catch(e) {
      console.log(e)
      response.error = e;
    }
    res.json(response);
});

router.get('/paid', async function(req, res, next) {
    var response = {};
    var query = {}
    try {
      var claims = await models.ClaimInfo.findAll({
        where: {
            [sequelize.Op.and]: [
                {isPaid:true},
                {[sequelize.Op.or]: [{gop: 0}, {gop: null}]}, 
                {[sequelize.Op.or]: [{status: 'cp'}, {status: 'ca'}, , {status: 'cc'}]}
            ]
        },
        include: [{
          model:models.ClaimInfoVisits,
          attributes: ['id', 'billingRate'],
          include: [{
            attributes: ['value'],
            model: models.BillingInfo,
          }],
        }],
        raw: false
      });
  
  
      response = claims
    } catch(e) {
      console.log(e)
      response.error = e;
    }
    res.json(response);
});


// router.get('/sendToAccountant', function(req, res, next) {

 
//   models.ClaimInfo.update(
//     {isSendToAccountant: true, sendToAccountantAt: Date.now()}, 
//     {
//       where: {
//         [sequelize.Op.and]: [
//             {isPaid:{[sequelize.Op.is]:null}},
//             {[sequelize.Op.or]: [{gop: 0}, {gop: null}]}, 
//             {[sequelize.Op.or]: [{status: 'cp'}, {status: 'ca'}, , {status: 'cc'}]}
//         ]
//       },
//     }
//   ).then(claims => {
//     res.send(claims)
//   }).catch( e => {
//     console.log(e)
//     res.sendStatus(500).send(e)
//   })
//     //retrieve patient, we should build patient db in the future

// });

router.get('/reportToAccountant', function(req, res, next) {
  models.PaymentToAccountant.findAll({}).then(paymentToAccountant => {
    res.json(paymentToAccountant);
  }).catch( e => {
    console.log(e)
    res.sendStatus(500).send(e)
  })
    //retrieve patient, we should build patient db in the future

});


router.post('/paymentReceipt', function(req, res, next) {

  console.log(req.body)
  models.PaymentReceipts.bulkCreate(req.body).then(paymentReceipt => {
    res.json(paymentReceipt);
  }).catch( e => {
    console.log(e)
    res.sendStatus(500).send(e)
  })
    //retrieve patient, we should build patient db in the future

});

router.get('/paymentReceipt', function(req, res, next) {
  models.PaymentReceipts.findAll({}).then(paymentReceipts => {
    res.json(paymentReceipts);
  }).catch( e => {
    console.log(e)
    res.sendStatus(500).send(e)
  })
    //retrieve patient, we should build patient db in the future

});


router.get('/sendToAccountant', async function(req, res, next) {
  console.log('asdfads1111111111111f')
  var response = {};
  try {
    var claims = await models.ClaimInfo.findAll({
      where: {
          [sequelize.Op.and]: [
              {[sequelize.Op.or]: [{isSendToAccountant:{[sequelize.Op.is]:null}}, {isSendToAccountant: false}]},
              {[sequelize.Op.or]: [{gop: 0}, {gop: null}]}, 
              {[sequelize.Op.or]: [{status: 'cp'}, {status: 'ca'}, , {status: 'cc'}]}
          ]
      },
      include: [{
        model:models.ClaimInfoVisits,
        attributes: ['id', 'billingRate'],
        include: [{
          attributes: ['value'],
          model: models.BillingInfo,
        }],
      }],
      raw: false
    }).then(claimsResults => {
      console.log(claimsResults)
      claimsResults.forEach(claim => claim.update({isSendToAccountant:true}))
      return claimsResults
    });


    response = claims
  } catch(e) {
    console.log(e)
    response.error = e;
  }
  let result = response.map(claim => { 
    let {ClaimInfoVisits , ...rest} = claim.dataValues
    let totalUSD = claim.dataValues.ClaimInfoVisits.reduce((visitAcc, visitCurr) => (visitAcc + visitCurr.BillingInfos.reduce((billingAcc, billingCurr) => (billingAcc + billingCurr.value), 0)), 0)
    return [
      totalUSD, 
      totalUSD * rest.RCExchangeRate,
      claim.id, 
      claim.status,
      claim.contactEmail,
      claim.contactPhoneNumberCountryCode + claim.contactPhoneNumber,
      claim.contactHomeAddress,
      claim.bankAccountNumber,
      claim.accountHoldersName,
      claim.bankName,
      claim.bankAddress,
      claim.swift,
      moment(claim.approvedAt).format('DD MMM YYYY'),
    ]
  })
  // create workbook & add worksheet
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet('ExampleSheet');
  const header = [
    "Total USD", "Total R/C", 
    "UCN", "Status", 
    "Email Address",
    "Phone Number",
    "Client's Address", 
    "Bank Account No", 
    "Account Holder Name",
    "Bank Name",
    "bANK Address",
    "SWIFT Code",
    "IBAN Code",
    "Date Approved"]
  worksheet.addRow(header)
  worksheet.addRows(result);
  worksheet.protect('password')
  const fileName = Date.now()
  workbook.xlsx.writeFile('../upload/paymentReport/'+fileName+'.xlsx').then(() => {
    //send email, insert payment to Account file, send res
    //console.log('../upload/paymentReport/'+fileName+'.xlsx')
    models.PaymentToAccountant.create({SendAt:Date.now(), url:'../upload/paymentReport/'+fileName+'.xlsx', name:fileName}).then(paymentToAccountant => {
      //send email
      res.send(paymentToAccountant)
    })
  })
});

module.exports = router;
