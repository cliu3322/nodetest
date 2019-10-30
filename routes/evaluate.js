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


router.get('/assessment',async function(req, res, next) {
  const claimID = base64url.decode(req.query.id)
  //retrieve policy: Approved YTD, policy Type
  //from Regency WT: Isured person, Previous, Start Date
  //? Approved YTD, Gross premium, Payment Frequency


  //retrieve claim, we don't have gender
  console.log(claimID)
  const assessment = await models.Acessment.findByPk(claimID, {attributes: ['adhere', 'forPreExisting','otherExclusion','reasonable','relatePreExisting']})
  console.log('assessment', assessment)



  const evaluate = await models.Comments.findOne({
    where: {
      claimInfoId:claimID,
      group:'evaluate'
    },
    order: [ [ 'createdAt', 'DESC' ]]
  }).then(evaluate => evaluate);
  res.send({assessment, evaluate})
  //retrieve patient, we should build patient db in the future

});

router.post('/assessment',async function(req, res, next) {

  var comment = {claimInfoId:req.body.data.claimInfoId, createdBy:req.body.data.createdBy, group:'evaluate', message:req.body.data.rationale}
  models.Comments.create(comment).then(comment => {
    models.Acessment.findByPk(req.body.data.claimInfoId).then(assessment => {
      if(assessment) {
        assessment.update(req.body.data)
      } else {
        models.Acessment.create(req.body.data)
      }
    })
    res.json(comment);
  }).catch( e => {
    console.log(e)
    res.sendStatus(500).send(e)
  })


});


router.get('/patientClaims', function(req, res, next) {
  const claimID = base64url.decode(req.query.id)

  console.log(claimID)
  models.ClaimInfo.findByPk(claimID, {attributes: ['patientFirstName', 'patientLastName','patientDob']}).then(claim => {
    models.ClaimInfo.findAll({
      where: {
        patientFirstName: claim.patientFirstName,
        patientLastName: claim.patientLastName,
        patientDob:claim.patientDob
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

module.exports = router;