// https://docs.microsoft.com/en-us/outlook/rest/node-tutorial
//https://medium.com/@tariqul.islam.rony/sending-email-through-express-js-using-node-and-nodemailer-with-custom-functionality-a999bb7cd13c
//https://www.youtube.com/watch?v=38aE1lSAJZ8
var express = require('express')
var router = express.Router()
var models = require('../models')
//var XLSX = require('xlsx')
const moment = require('moment');
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


router.get('/', function (req, res, next) {
  models.ClaimInfo.findAll({
    attributes: ['id', 'policyNumber', [models.sequelize.fn('sum', models.sequelize.col('ClaimInfoVisits.id')), 'total_cost']],
    where: req.query,
    include: [{
      model:models.ClaimInfoVisits,
      attributes: [],
    }],
    group: ['ClaimInfo.id', 'ClaimInfo.policyNumber'],
    raw: false
  })
  .then(claim => res.send(claim))
  .catch(e => {
    console.log(e)
    res.sendStatus(500).send(e)
  })




})


router.get('/csv', async function (req, res, next) {
  try {
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
    console.log('csv result', result)
    res.send(result)
  } catch(e) {
    console.log(e)
    res.sendStatus(500).send(e)
  }
})

router.get('/json', function (req, res, next) {
  models.ClaimInfo.findAll({
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
  })
  .then(claim => res.send(claim))
  .catch(e => {
    console.log(e)
    res.sendStatus(500).send(e)
  })



})

router.get('/claimCount', function (req, res, next) {
  models.ClaimInfo.findAll({
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
  })
  .then(claim => res.send(claim))
  .catch(e => {
    console.log(e)
    res.sendStatus(500).send(e)
  })



})

router.get('/USDApproved1', function (req, res, next) {
  models.BillingInfo.findAll({
    attributes: ['value'],
    include: [{
      model:models.ClaimInfoVisits,
      attributes: ['billingRate'],
      include: [{
        model:models.ClaimInfo,
        where: {[sequelize.Op.or]: [{status: 'ca'}, {status: 'cp'}]},
        attributes: ['status'],
        group : [[sequelize.fn('DATEADD',sequelize.literal('MONTH'), sequelize.fn('DATEDIFF',sequelize.literal('MONTH'), 0, sequelize.col('createdAt')),0)]],
      }],
    }],
  })
  .then(bill => res.send(bill))
  .catch(e => {
    console.log(e)
    res.sendStatus(500).send(e)
  })

})

router.get('/USDApproved', function (req, res, next) {
  models.ClaimInfo.findAll({
    attributes: ['createdAt'],
    include: [{
      model:models.ClaimInfoVisits,
      attributes: ['billingRate'],
      include: [{
        model:models.BillingInfo,
        attributes: ['value', 'approved']
      }],
    }],
    where: {[sequelize.Op.or]: [{status: 'ca'}, {status: 'cp'}]},
    //group : [[sequelize.fn('DATEADD',sequelize.literal('MONTH'), sequelize.fn('DATEDIFF',sequelize.literal('MONTH'), 0, sequelize.col('ClaimInfo.createdAt')),0)]],
  })
  .then(bill => res.send(bill))
  .catch(e => {
    console.log(e)
    res.sendStatus(500).send(e)
  })
})

router.get('/USDRejected', function (req, res, next) {
  models.ClaimInfo.findAll({
    attributes: ['createdAt'],
    include: [{
      model:models.ClaimInfoVisits,
      attributes: ['billingRate'],
      include: [{
        model:models.BillingInfo,
        attributes: ['value', 'approved']
      }],
    }],
    where: {[sequelize.Op.or]: [ {status: 'cp'},{status: 'cd'}, ]},
    //group : [[sequelize.fn('DATEADD',sequelize.literal('MONTH'), sequelize.fn('DATEDIFF',sequelize.literal('MONTH'), 0, sequelize.col('ClaimInfo.createdAt')),0)]],
  })
  .then(bill => res.send(bill))
  .catch(e => {
    console.log(e)
    res.sendStatus(500).send(e)
  })
})

router.get('/approvedClaimedCountByType', function (req, res, next) {
  models.ClaimInfo.findAll({
    attributes: ['policyType', [sequelize.fn('COUNT', 'policyType'), 'policyTypeCount']],
    where: {[sequelize.Op.or]: [{status: 'ca'}, {status: 'cp'}]},
    group: ['policyType'],
    //group : [[sequelize.fn('DATEADD',sequelize.literal('MONTH'), sequelize.fn('DATEDIFF',sequelize.literal('MONTH'), 0, sequelize.col('ClaimInfo.createdAt')),0)]],
  })
  .then(claim => res.send(claim))
  .catch(e => {
    console.log(e)
    res.sendStatus(500).send(e)
  })
})


router.get('/turnaroundTime', function (req, res, next) {
  models.ClaimInfo.findAll({
    attributes: ['createdAt', 'updatedAt'],
    where: {
      [sequelize.Op.or]: [{status: 'cd'}, {status: 'cp'}, {status: 'ca'}, {status: 'cc'}],
    },
    where: {
      updatedAt: {
        [sequelize.Op.gte]: moment().subtract(90, 'days').toDate()
      }
    },
  })
  .then(claim => res.send(claim))
  .catch(e => {
    console.log(e)
    res.sendStatus(500).send(e)
  })
})


router.get('/USDApproved0', function (req, res, next) {
  models.ClaimInfo.findAll({
    attributes: ['createdAt'],
    include: [{
      model:models.ClaimInfoVisits,
      attributes: ['billingRate'],
      include: [{
        model:models.BillingInfo,
        attributes: [[sequelize.fn('sum', sequelize.col('value')), 'valueT'],[sequelize.fn('sum', sequelize.col('approved')), 'approvedT']]
      }],
    }],
    where: {[sequelize.Op.or]: [{status: 'ca'}, {status: 'cp'}]},
    //group : [[sequelize.fn('DATEADD',sequelize.literal('MONTH'), sequelize.fn('DATEDIFF',sequelize.literal('MONTH'), 0, sequelize.col('ClaimInfo.createdAt')),0)]],
  })
  .then(bill => res.send(bill))
  .catch(e => {
    console.log(e)
    res.sendStatus(500).send(e)
  })
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

  res.json(claims)


})


module.exports = router
