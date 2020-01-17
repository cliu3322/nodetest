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

module.exports = router;
