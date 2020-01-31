var express = require('express');
var router = express.Router();
var jsonwebtoken = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Config = require('../config');
var models  = require('../models');
const { secretKey } = Config;

/* GET users listing. */
router.get('/user', function(req, res, next) {
  jsonwebtoken.verify(req.query.idToken, secretKey, (error, decoded) => {
    models.User.findByPk(decoded.id)
    .then(user => {
      res.send(user);
    })
    .catch(e => {
      console.log(e)
      res.sendStatus(500).send(e)
    })
    
  })
  
});

router.put('/user', function(req, res, next) {
  console.log('req.query.newPassword', req.query.newPassword)
  if(req.query.newPassword) {
    var hash = bcrypt.hashSync(req.query.newPassword, 8);
    req.query.password = hash
  }
  models.User.findByPk(req.query.id)
  .then(user => {
    user.update(req.query).then(updatedUser => {
      res.send(updatedUser);
    })
  })
  .catch(e => {
    console.log(e)
    res.sendStatus(500).send(e)
  })
});

router.get('/settings', function(req, res, next) {
    models.SharedSettings.findOne({
      limit: 1,
      order: [ [ 'createdAt', 'DESC' ]]
    })
    .then(settings => {
      res.send(settings);
    })
    .catch(e => {
      console.log(e)
      res.sendStatus(500).send(e)
    })
});

router.put('/settings', function(req, res, next) {
  console.log(req.body)
  models.SharedSettings.create(req.body)
  .then(setting => {
    setting.update(req.query).then(updatedSetting => {
      res.send(updatedSetting);
    })
  })
  .catch(e => {
    console.log(e)
    res.sendStatus(500).send(e)
  })
});

router.get('/exchangeRateDate', function(req, res, next) {
  models.ExchangeRate.findOne({})
  .then(exchangeRate => {
    res.send(exchangeRate);
  })
  .catch(e => {
    res.sendStatus(500).send(e)
  })
});

module.exports = router;
