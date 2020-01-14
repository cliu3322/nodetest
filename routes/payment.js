var express = require('express');
var router = express.Router();
var models  = require('../models');
var base64url = require('base64url');
const sequelize = require('sequelize');
/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.query)

    res.json({
        status: 200,
        message: 'succcesful',
    });
});

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


router.get('/updateStatus', function(req, res, next) {

 
  models.ClaimInfo.update(
    {isPaid: true}, 
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



module.exports = router;
