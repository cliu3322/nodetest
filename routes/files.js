var express = require('express');
var router = express.Router();
var models  = require('../models');
var d3 = require('d3-array');

var humanname  = require('humanname');



/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.query.url)
  res.download(req.query.url);
});


module.exports = router;
