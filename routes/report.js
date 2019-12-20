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
  var params = null
  console.log(req.query)
  switch (req.query['2']) {
    case 'claims':
      params = [{status: 'cd'}, {status: 'cp'}, {status: 'ca'}, {status: 'cc'}]
      break;
    case 'pendings':
      params = [{status: 'pr'}, {status: 'pe'}, {status: 'pd'}, {status: 're-pd'}, {status: 're-pr'}]
      break;
  
    default:
      break;
  }
  try {
    var claims = await models.ClaimInfo.findAll({
      //attributes: ['id', 'policyNumber'],
      where: {
        [sequelize.Op.and]: {
          [sequelize.Op.or]: params, 
          createdAt:{[sequelize.Op.between]:  [ moment(req.query['0']), moment(req.query['1'])]}
        }
      },
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
  // models.ClaimInfo.findAll({
  //   // attributes: [[sequelize.fn('CONVERT',sequelize.literal('varchar'), sequelize.col('createdAt'),101),'day'], [sequelize.fn('COUNT', 'status'), 'statusCount'], 'status'],
  //   // //group:'createdAt'
  //   // group : [[sequelize.fn('CONVERT',sequelize.literal('varchar'), sequelize.col('createdAt'),101)], 'status']
  //   attributes: [
  //     [sequelize.fn('DATEADD',sequelize.literal('MONTH'), sequelize.fn('DATEDIFF',sequelize.literal('MONTH'), 0, sequelize.col('createdAt')),0),'month'],
  //     [sequelize.fn('COUNT', sequelize.literal("case status when 'pr' then 1 else null end")), 'prCount'],
  //     [sequelize.fn('COUNT', sequelize.literal("case status when 'cp' then 1 else null end")), 'cpCount']
  //   ],
  //   where: {
  //     [sequelize.Op.and]: {
  //       createdAt:{[sequeliz[sequelize.fn('COUNT', sequelize.literal("case status when 'cp' then 1 else null end")), 'cpCount']e.Op.between]:  [ moment(req.query['0']), moment(req.query['1'])]}
  //     }
  //   },
  //   //group:'createdAt'
  //   group : [[sequelize.fn('DATEADD',sequelize.literal('MONTH'), sequelize.fn('DATEDIFF',sequelize.literal('MONTH'), 0, sequelize.col('createdAt')),0)]],
  //   order: [[sequelize.fn('DATEADD',sequelize.literal('MONTH'), sequelize.fn('DATEDIFF',sequelize.literal('MONTH'), 0, sequelize.col('createdAt')),0)]],
  //   raw: true
  // })
  // .then(claim => res.send(claim))
  // .catch(e => {
  //   console.log(e)
  //   res.sendStatus(500).send(e)
  // })

  models.ClaimInfo.findAll({
    attributes: [
      [sequelize.fn('DATEADD',sequelize.literal('MONTH'), sequelize.fn('DATEDIFF',sequelize.literal('MONTH'), 0, sequelize.col('createdAt')),0), 'month'],
      [sequelize.fn('COUNT', sequelize.literal("case status when 'cp' then 1 when 'ca' then 1 else null end")), 'ApprovedCount'],
      [sequelize.fn('COUNT', sequelize.literal("case status when 'cd' then 1 else null end")), 'DeclinedCount']
    ],
    where: {
      [sequelize.Op.and]: {
        createdAt:{[sequelize.Op.between]:  [ moment(req.query['0']), moment(req.query['1'])]}
      }
    },
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
  // models.ClaimInfo.findAll({
  //   attributes: ['createdAt'],
  //   include: [{
  //     model:models.ClaimInfoVisits,
  //     attributes: ['billingRate'],
  //     include: [{
  //       model:models.BillingInfo,
  //       attributes: ['value', 'approved']
  //     }],
  //   }],
  //   where: {
  //     [sequelize.Op.and]: {
  //       [sequelize.Op.or]: [{status: 'cd'}, {status: 'cp'}, {status: 'ca'}, {status: 'cc'}], 
  //       createdAt:{[sequelize.Op.between]:  [ moment(req.query['0']), moment(req.query['1'])]}
  //     }
  //   },
  // })
  // .then(bill => res.send(bill))
  // .catch(e => {
  //   console.log(e)
  //   res.sendStatus(500).send(e)
  // })
    models.ClaimInfo.findAll({
    attributes: [
      [sequelize.fn('DATEADD',sequelize.literal('MONTH'), sequelize.fn('DATEDIFF',sequelize.literal('MONTH'), 0, sequelize.col('ClaimInfo.createdAt')),0), 'month'], 
      [sequelize.fn('SUM', sequelize.col('[ClaimInfoVisits->BillingInfos].approved')), 'sum']
    ],
    include: [{
      model:models.ClaimInfoVisits,
      attributes: [],
      include: [{
        model:models.BillingInfo,
        attributes: []
      }],
    }],
    where: {
      [sequelize.Op.and]: {
        [sequelize.Op.or]: [ {status: 'cp'}, {status: 'ca'}, {status: 'cc'}], 
        createdAt:{[sequelize.Op.between]:  [ moment(req.query['0']), moment(req.query['1'])]}
      }
    },
    group : [[sequelize.fn('DATEADD',sequelize.literal('MONTH'), sequelize.fn('DATEDIFF',sequelize.literal('MONTH'), 0, sequelize.col('ClaimInfo.createdAt')),0)]],
    order: [[sequelize.fn('DATEADD',sequelize.literal('MONTH'), sequelize.fn('DATEDIFF',sequelize.literal('MONTH'), 0, sequelize.col('ClaimInfo.createdAt')),0)]],
    raw: true
  })
  .then(bill => res.send(bill))
  .catch(e => {
    console.log(e)
    res.sendStatus(500).send(e)
  })
})

router.get('/USDRejected', function (req, res, next) {
  models.ClaimInfo.findAll({
    attributes: [
      [sequelize.fn('DATEADD',sequelize.literal('MONTH'), sequelize.fn('DATEDIFF',sequelize.literal('MONTH'), 0, sequelize.col('ClaimInfo.createdAt')),0), 'month'], 
      [sequelize.fn('SUM', sequelize.col('[ClaimInfoVisits->BillingInfos].approved')), 'sum']
    ],
    include: [{
      model:models.ClaimInfoVisits,
      attributes: [],
      include: [{
        model:models.BillingInfo,
        attributes: []
      }],
    }],
    where: {
      [sequelize.Op.and]: {
        [sequelize.Op.or]: [{status: 'cd'}], 
        createdAt:{[sequelize.Op.between]:  [ moment(req.query['0']), moment(req.query['1'])]}
      }
    },
    group : [[sequelize.fn('DATEADD',sequelize.literal('MONTH'), sequelize.fn('DATEDIFF',sequelize.literal('MONTH'), 0, sequelize.col('ClaimInfo.createdAt')),0)]],
    order: [[sequelize.fn('DATEADD',sequelize.literal('MONTH'), sequelize.fn('DATEDIFF',sequelize.literal('MONTH'), 0, sequelize.col('ClaimInfo.createdAt')),0)]],
    raw: true
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
    where: {
      [sequelize.Op.and]: {
        [sequelize.Op.or]: [{status: 'cp'}, {status: 'ca'}, {status: 'cc'}], 
        createdAt:{[sequelize.Op.between]:  [ moment(req.query['0']), moment(req.query['1'])]}
      }
    },
    group: ['policyType'],
    //group : [[sequelize.fn('DATEADD',sequelize.literal('MONTH'), sequelize.fn('DATEDIFF',sequelize.literal('MONTH'), 0, sequelize.col('ClaimInfo.createdAt')),0)]],
  })
  .then(claim => res.send(claim))
  .catch(e => {
    console.log(e)
    res.sendStatus(500).send(e)
  })
})

router.get('/approvedClaimedCountByValue', async function (req, res, next) {
  const lte = await models.ClaimInfo.findAll({
    attributes: [ [sequelize.fn('Sum', sequelize.col('[ClaimInfoVisits->BillingInfos].[approved]')), 'total']],
    where: {
      [sequelize.Op.and]: {
        [sequelize.Op.or]: [ {status: 'cp'}, {status: 'ca'}, {status: 'cc'}], 
        //createdAt:{[sequelize.Op.between]:  [ moment(req.query['0']), moment(req.query['1'])]}
      }
    },
    include: [{
      model:models.ClaimInfoVisits,
      attributes: [],
      include: [{
        model:models.BillingInfo,
        attributes: []
      }],
    }],
    group :  sequelize.col('[ClaimInfo].id'), 
    having: sequelize.where(sequelize.fn('SUM', sequelize.col('[ClaimInfoVisits->BillingInfos].approved')), {
      [sequelize.Op.lte]: 250,
    }),
    //group : [[sequelize.fn('DATEADD',sequelize.literal('MONTH'), sequelize.fn('DATEDIFF',sequelize.literal('MONTH'), 0, sequelize.col('ClaimInfo.createdAt')),0)]],
  })

  const gt = await models.ClaimInfo.findAll({
    attributes: [ [sequelize.fn('Sum', sequelize.col('[ClaimInfoVisits->BillingInfos].[approved]')), 'total']],
    where: {
      [sequelize.Op.and]: {
        [sequelize.Op.or]: [ {status: 'cp'}, {status: 'ca'}, {status: 'cc'}], 
        //createdAt:{[sequelize.Op.between]:  [ moment(req.query['0']), moment(req.query['1'])]}
      }
    },
    include: [{
      model:models.ClaimInfoVisits,
      attributes: [],
      include: [{
        model:models.BillingInfo,
        attributes: []
      }],
    }],
    group :  sequelize.col('[ClaimInfo].id'), 
    having: sequelize.where(sequelize.fn('SUM', sequelize.col('[ClaimInfoVisits->BillingInfos].approved')), {
      [sequelize.Op.gt]: 250,
    }),
    //group : [[sequelize.fn('DATEADD',sequelize.literal('MONTH'), sequelize.fn('DATEDIFF',sequelize.literal('MONTH'), 0, sequelize.col('ClaimInfo.createdAt')),0)]],
  })
  res.send([{lte:lte.length, gt:gt.length}])
})

router.get('/turnaroundTime', function (req, res, next) {
  models.ClaimInfo.findAll({
    attributes: ['createdAt', 'updatedAt'],
    where: {
      [sequelize.Op.and]: {
        [sequelize.Op.or]: [{status: 'cd'}, {status: 'cp'}, {status: 'ca'}, {status: 'cc'}], 
        createdAt:{[sequelize.Op.between]:  [ moment(req.query['0']), moment(req.query['1'])]}
      }
    },
  })
  .then(claim => res.send(claim))
  .catch(e => {
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
