var express = require('express');
var router = express.Router();
var models  = require('../models');
var base64url = require('base64url');
const axios = require('axios')
/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.query)

	res.json({
		status: 200,
		message: 'succcesful',
	});
});


router.get('/policy',async function(req, res, next) {

  axios.get('http://13.67.68.169:8080/databases/RegencyProd/docs?list=AllianceCRM_Insurance_Policy&Reference=RIH/2019/FC/57149288')
    .then( response => {
      console.log(response.data)
      res.send(JSON.stringify(response.data))
    })



  //retrieve patient, we should build patient db in the future

});


module.exports = router;
