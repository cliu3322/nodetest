var express = require('express');
var router = express.Router();
var models  = require('../models');
var base64url = require('base64url');


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.query)

	res.json({
		status: 200,
		message: 'succcesful',
	});
});


router.get('/comments',async function(req, res, next) {
  //const claimID = base64url.decode(req.query.id)
  const claimID = req.query.id
  console.log(claimID)
  //retrieve policy: Approved YTD, policy Type
  //from Regency WT: Isured person, Previous, Start Date
  //? Approved YTD, Gross premium, Payment Frequency

  models.Comments.findAll({
    where:{claimInfoId:claimID},
    order: [['createdAt', 'DESC']],
  }).then(comments => {

    res.json(comments);
  }).catch( e => {
    console.log(e)
    res.sendStatus(500).send(e)
  })


  //retrieve patient, we should build patient db in the future

});

router.post('/comments',async function(req, res, next) {
  // const claimID = base64url.decode(req.query.id)

  models.Comments.create(req.body).then(comment => {

    res.json(comment);
  }).catch( e => {
    console.log(e)
    res.sendStatus(500).send(e)
  })


});


module.exports = router;
