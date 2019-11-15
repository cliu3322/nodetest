// https://docs.microsoft.com/en-us/outlook/rest/node-tutorial
//https://medium.com/@tariqul.islam.rony/sending-email-through-express-js-using-node-and-nodemailer-with-custom-functionality-a999bb7cd13c
//https://www.youtube.com/watch?v=38aE1lSAJZ8
var express = require('express')
var router = express.Router()
var models = require('../models')
//var XLSX = require('xlsx')
const sequelize = require('sequelize');




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


router.get('/', async function (req, res, next) {
  var claims = await models.ClaimInfo.findAll({
    attributes: ['id', 'policyNumber', [models.sequelize.fn('sum', models.sequelize.col('ClaimInfoVisits.id')), 'total_cost']],
    where: req.query,
    include: [{
      model:models.ClaimInfoVisits,
      attributes: [],
    }],
    group: ['ClaimInfo.id', 'ClaimInfo.policyNumber'],
    raw: false
  });

  res.send(claims)


})


router.get('/csv', async function (req, res, next) {
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
  // var ws = XLSX.utils.json_to_sheet(result);
  // var wb = XLSX.utils.book_new();
  // XLSX.utils.book_append_sheet(wb, ws, 'report');
  // XLSX.writeFile(wb, 'out.xlsb');
  res.send(result)
})

router.get('/json', async function (req, res, next) {
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

  res.send(claims)


})

router.get('/claimCount', async function (req, res, next) {
  var claims = await models.ClaimInfo.findAll({
    // attributes: [[sequelize.fn('CONVERT',sequelize.literal('varchar'), sequelize.col('createdAt'),101),'day'], [sequelize.fn('COUNT', 'status'), 'statusCount'], 'status'],
    // //group:'createdAt'
    // group : [[sequelize.fn('CONVERT',sequelize.literal('varchar'), sequelize.col('createdAt'),101)], 'status']
    attributes: [
      [sequelize.fn('DATEADD',sequelize.literal('MONTH'), sequelize.fn('DATEDIFF',sequelize.literal('MONTH'), 0, sequelize.col('createdAt')),0),'month'],
      [sequelize.fn('COUNT', sequelize.literal("case status when 'pr' then 1 else null end")), 'prCount'],
      [sequelize.fn('COUNT', sequelize.literal("case status when 'cp' then 1 else null end")), 'cpCount']
    ],
    //group:'createdAt'
    group : [[sequelize.fn('DATEADD',sequelize.literal('MONTH'), sequelize.fn('DATEDIFF',sequelize.literal('MONTH'), 0, sequelize.col('createdAt')),0)]],
    order: [[sequelize.fn('DATEADD',sequelize.literal('MONTH'), sequelize.fn('DATEDIFF',sequelize.literal('MONTH'), 0, sequelize.col('createdAt')),0)]],
    raw: true
  });
  console.log(claims)
  res.send(claims)


})

router.get('/USD Approved', async function (req, res, next) {
  var claims = await models.ClaimInfo.findAll({
    // attributes: [[sequelize.fn('CONVERT',sequelize.literal('varchar'), sequelize.col('createdAt'),101),'day'], [sequelize.fn('COUNT', 'status'), 'statusCount'], 'status'],
    // //group:'createdAt'
    // group : [[sequelize.fn('CONVERT',sequelize.literal('varchar'), sequelize.col('createdAt'),101)], 'status']
    attributes: [
      [sequelize.fn('DATEADD',sequelize.literal('MONTH'), sequelize.fn('DATEDIFF',sequelize.literal('MONTH'), 0, sequelize.col('createdAt')),0),'month'],
      [sequelize.fn('COUNT', sequelize.literal("case status when 'pr' then 1 else null end")), 'prCount'],
      [sequelize.fn('COUNT', sequelize.literal("case status when 'cp' then 1 else null end")), 'cpCount']
    ],
    //group:'createdAt'
    group : [[sequelize.fn('DATEADD',sequelize.literal('MONTH'), sequelize.fn('DATEDIFF',sequelize.literal('MONTH'), 0, sequelize.col('createdAt')),0)]],
    order: [[sequelize.fn('DATEADD',sequelize.literal('MONTH'), sequelize.fn('DATEDIFF',sequelize.literal('MONTH'), 0, sequelize.col('createdAt')),0)]],
    raw: true
  });
  console.log(claims)
  res.send(claims)


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
