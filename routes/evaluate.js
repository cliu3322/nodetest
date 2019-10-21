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


router.get('/getBasic',async function(req, res, next) {
  const claimID = base64url.decode(req.query.id)
  //retrieve policy: Approved YTD, policy Type
  //from Regency WT: Isured person, Previous, Start Date
  //? Approved YTD, Gross premium, Payment Frequency


  //retrieve claim, we don't have gender
  const claim = await models.ClaimInfo.findByPk(claimID, {

    include: [{
      model:models.ClaimInfoVisits,
      //attributes: ['id', 'billingUsdper','billingUsdper','billingUsdper','billingUsdper','billingUsdper','billingUsdper',],
      include: [
        {
          model: models.ClaimInfoVisitsFiles
        },
        {
          model: models.BillingInfoFiles,
        },
        {
          model: models.DocumentsFiles
        },
        {
          model: models.BillingInfo,
          include: [
            {
              model:models.BenefitCategories,
            },
            {
              model:models.BenefitSubCategories,
            }
          ]
        },

      ],
    }],
  })
  const patientClaims = await models.ClaimInfo.findAll({
    where: {patientFirstName:claim.patientFirstName, patientLastName:claim.patientLastName, patientDob:claim.patientDob },
    attributes: ['id', 'createdAt', 'cause'],
    include: [{
      model:models.ClaimInfoVisits,
      attributes: ['billingUsdper'],
      include: [
        {
          model: models.BillingInfo
        },
      ],
    }],

  })

  res.send({claim, patientClaims})

  //retrieve patient, we should build patient db in the future

});


module.exports = router;
