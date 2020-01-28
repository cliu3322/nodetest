// https://docs.microsoft.com/en-us/outlook/rest/node-tutorial
//https://medium.com/@tariqul.islam.rony/sending-email-through-express-js-using-node-and-nodemailer-with-custom-functionality-a999bb7cd13c
//https://www.youtube.com/watch?v=38aE1lSAJZ8
var express = require('express')
var router = express.Router()
var models = require('../models')





// middleware to hanlde errors
const awaitErorrHandlerFactory = middleware => {
  return async (req, res, next) => {
    try {
      await middleware(req, res, next)
    } catch (err) {
      next(err)
    }
  }
}
//https://stackoverflow.com/questions/28206680/using-group-by-and-joins-in-sequelize
/* GET users listing. */
router.get('/', async function (req, res, next) {
  console.log('aiyamaya')
  let setting = await models.SharedSettings.findOne({limit: 1,order: [ [ 'createdAt', 'DESC' ]]})
  console.log(setting)

  res.send(setting)


})


router.get('/test', async function (req, res, next) {
  var claims = await models.ClaimInfo.findAll({
    //attributes: ['id', 'policyNumber'],
    include: [{
      model:models.ClaimInfoVisits,
      attributes: ['id', 'billingRate'],
      include: [{
        model:models.BillingInfo,
        attributes: ['value','approved'],
        include: [{
          model:models.BenefitSubCategories,
          attributes: ['name'],
        }],
      }],
    }],
  });

  var claimArry = JSON.stringify(claims)

  var result = JSON.parse(claimArry).map(claim => {
    var newclaim = claim.ClaimInfoVisits.reduce((acc,curr) => {

      curr.BillingInfos.map(bill => {
        bill.value /= curr.billingRate
        bill.approved /= curr.billingRate
        return bill
      })
      return acc.concat(curr.BillingInfos)
    },[]).reduce((acc,obj) => {
      var key = obj.BenefitSubCategory.name;
      if(key === '') {
        key = 'Other'
      }

      key += ' claimed'
      if (acc[key] === undefined) {
        acc[key] = 0;
      }
      acc[key] += obj.value;

      var keyapproved = obj.BenefitSubCategory.name;
        if(keyapproved === '') {
          keyapproved = 'Other'
        }

      keyapproved += ' approved'
      if (acc[keyapproved] === undefined) {
        acc[keyapproved] = 0;
      }
      acc[keyapproved] += obj.approved;

      return acc;
    },[])
    Object.assign(claim, newclaim)
    delete claim['ClaimInfoVisits']

    return claim
  })


  res.json(result)
})

router.get('/test1', async function (req, res, next) {
  var claims = await models.ClaimInfoVisits.findAll({
    attributes: ['id', [models.sequelize.fn('sum', models.sequelize.col('BillingInfos.value')), 'visitTotal']],
    include: [{
      model:models.BillingInfo,
      attributes: [],
    }],
    group: ['ClaimInfoVisits.id'],
    raw: false
  });

  res.send(claims)


})


module.exports = router
