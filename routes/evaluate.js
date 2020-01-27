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


router.get('/assessment',async function(req, res, next) {
  const claimID = base64url.decode(req.query.id)
  //retrieve policy: Approved YTD, policy Type
  //from Regency WT: Isured person, Previous, Start Date
  //? Approved YTD, Gross premium, Payment Frequency


  //retrieve claim, we don't have gender

  const assessment = await models.Acessment.findByPk(claimID, {attributes: ['adhere', 'forPreExisting','otherExclusion','reasonable','relatePreExisting']})

  const evaluate = await models.Comments.findOne({
    where: {
      claimInfoId:claimID,
      group:'evaluate'
    },
    order: [ [ 'createdAt', 'DESC' ]]
  }).then(evaluate => evaluate);
  res.send({assessment ,evaluate})
  //retrieve patient, we should build patient db in the future

});

router.post('/assessment',async function(req, res, next) {
  var comment = req.body.comment
  const commentResult = await models.Comments.create(comment)
  const assessmentResult = await  models.Acessment.findByPk(req.body.assessment.claimInfoId).then(assessment => {
    if(assessment) {
      return assessment.update(req.body.assessment)
    } else {
      return models.Acessment.create(req.body.assessment)
    }
  })
  const claimResult = await models.ClaimInfo.findByPk(req.body.assessment.claimInfoId).then(item => {
    return item.update({ status: req.body.status})
  })
  res.send({commentResult,assessmentResult ,claimResult})
});

router.get('/policyClaims', function(req, res, next) {
  const claimID = req.query.id
  models.ClaimInfo.findByPk(claimID, {attributes: [ 'policyNumber']}).then(claim => {
    models.ClaimInfo.findAll({
      where: {
        policyNumber: claim.policyNumber,
        status:{[sequelize.Op.or]:['ca', 'cp', 'cc']}
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

router.get('/patientClaims', function(req, res, next) {
  const claimID = req.query.id
  models.ClaimInfo.findByPk(claimID, {attributes: ['patientFirstName', 'patientLastName','patientDob', 'policyNumber']}).then(claim => {
    models.ClaimInfo.findAll({
      where: {
        policyNumber: claim.policyNumber,
        patientFirstName: claim.patientFirstName,
        patientLastName: claim.patientLastName,
        patientDob:claim.patientDob, 
        status:{[sequelize.Op.or]:['ca', 'cp', 'cc']}
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

router.post('/decision', function(req, res, next) {
  // const claimID = base64url.decode(req.query.id)
  console.log(req.body)
  models.Comments.create(req.body.decision).then(comment => {
    models.ClaimInfo.findByPk(req.body.decision.claimInfoId).then(item => {
      return item.update({ approvedAt: Date.now(), ...req.body.status})
    })
    res.json(comment);
  }).catch( e => {
    console.log(e)
    res.sendStatus(500).send(e)
  })


});


module.exports = router;
