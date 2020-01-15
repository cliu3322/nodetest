var express = require('express');
var router = express.Router();
var models  = require('../models');
var base64url = require('base64url');
const sequelize = require('sequelize');
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
                {isPaid:{[sequelize.Op.is]:null}},
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


router.get('/sendToAccountant', function(req, res, next) {

 
  models.ClaimInfo.update(
    {isSendToAccountant: true, sendToAccountantAt: Date.now()}, 
    {
      where: {
        [sequelize.Op.and]: [
            {isPaid:{[sequelize.Op.is]:null}},
            {[sequelize.Op.or]: [{gop: 0}, {gop: null}]}, 
            {[sequelize.Op.or]: [{status: 'cp'}, {status: 'ca'}, , {status: 'cc'}]}
        ]
      },
    }
  ).then(claims => {
    console.log('asdfadsfadfasdfasdf')
    console.log(claims)
    res.send(claims)
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


module.exports = router;
