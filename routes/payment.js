
var express = require('express');
var router = express.Router();
var models  = require('../models');
const formidable = require('formidable')
const Excel = require('exceljs');
const sequelize = require('sequelize');
const moment = require('moment');
var MailConfig = require('../email/config');
var hbs = require('nodemailer-express-handlebars');
var gmailTransport = MailConfig.GmailTransport;

MailConfig.ViewOption(gmailTransport,hbs);
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

  models.PaymentToAccountant.findAll({
    include: [{// Notice `include` takes an ARRAY
      model: models.PaymentReceiptsToAccount,
      attributes: ['id', 'name', 'url'],
    }], 
    
  }).then(paymentToAccountant => {
    res.send(paymentToAccountant);
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


router.post('/paymentReceipt2', function(req, res, next) {
  try {
    var form = new formidable.IncomingForm();
    form.uploadDir = "../upload/paymentSlipt";
    form.keepExtensions = true;
    form.multiples = true;
    form.parse(req);
  
    var files = []
    var data = {}
    form.on('file', function (name, file){
      files.push(file)
    });
    form.on('field', function(name, value) {
      data[name]= value;
    });
  
    form.on('end',async function() {
      try {
  
        if(files.length > 1)
          throw new Error('file length is longer than 1');
  
        console.log({name:files[0].name, url: files[0].path, data: data})
        const fileRecord = await models.PaymentReceiptsToAccount.create({PaymentToAccountantsId:data.PaymentToAccountantsId,name:files[0].name, url: files[0].path})
        res.send(fileRecord);
      } catch(e) {
        console.log(e)
        res.sendStatus(500)
      }
    });
  } catch (error) {
    console.log(error)
  }

});

router.get('/paymentReceipt2', function(req, res, next) {

});


router.get('/sendToAccountant', async function(req, res, next) {
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

  let setting = await models.SharedSettings.findOne({limit: 1,order: [ [ 'createdAt', 'DESC' ]]})

  console.log('setting.paymentPasswordsetting----------------', setting.paymentPassword)
  worksheet.protect(setting.paymentPassword)
  const fileName = Date.now()
  workbook.xlsx.writeFile('../upload/paymentReport/'+fileName+'.xlsx').then(() => {
    //send email, insert payment to Account file, send res
    //console.log('../upload/paymentReport/'+fileName+'.xlsx')
    models.PaymentToAccountant.create({SendAt:Date.now(), url:'../upload/paymentReport/'+fileName+'.xlsx', name:fileName}).then(paymentToAccountant => {
      //send email
      
      var email = {
        from: 'vip@whitehouse.org', // sender address
        to: setting.accountantEmail+','+setting.forwardEmail, // list of receivers
        subject: 'payment to accountant', // Subject line
        template: 'payment',
        context: {
          reportDate: new Date(Number(fileName)),
        },
        attachments: [
          {
            filename: fileName+'.xlsx',
            path: '../upload/paymentReport/'+fileName+'.xlsx',
            cid: 'unique@nodemailer.com' //same cid value as in the html img src
          },
          {
            filename: 'a.png',
            path: __dirname +'/../views/img/a.png',
            cid: 'unique@unique' //same cid value as in the html img src
          }
        ]
      }
      gmailTransport.sendMail(email).then(result => {
        res.send(result)
      }).catch(e=> {
        console.log(e);
        res.status(500).send(e)
      });
      
    })
  })
});

router.get('/resendToAccountant', async function(req, res, next) {
  let setting = await models.SharedSettings.findOne({limit: 1,order: [ [ 'createdAt', 'DESC' ]]})

  let email = {
    from: 'vip@whitehouse.org', // sender address
    to: setting.accountantEmail+','+setting.forwardEmail, // list of receivers
    subject: 'payment to accountant', // Subject line
    template: 'payment',
    context: {
      reportDate: new Date(Number(req.query.name)),
    },
    attachments: [
      {
        filename: req.query.name+'.xlsx',
        path: '../upload/paymentReport/'+req.query.name+'.xlsx',
        cid: 'unique@nodemailer.com' //same cid value as in the html img src
      }, 
      {
        filename: 'a.png',
        path: __dirname +'/../views/img/a.png',
        cid: 'unique@unique' //same cid value as in the html img src
      }
    ]
  }
  gmailTransport.sendMail(email).then(result => {
    res.send(result)
  }).catch(e=> {
    console.log(e);
    res.status(500).send(e)
  });
});


module.exports = router;
