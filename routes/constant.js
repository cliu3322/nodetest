var express = require('express');
var router = express.Router();
var models  = require('../models');
var d3 = require('d3-array');

var humanname  = require('humanname');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ firstName: 'constant' })
});

router.get('/getCurrencyRate', async function(req, res, next) {
  try {
    const response = await models.ExchangeRate.findAll({});
    res.json(response);
  } catch(e) {
    console.log(e)
    res.sendStatus(500)
  }

});


router.get('/name', async function(req, res, next) {
  try {
    const response = await models.RejectedClaimsOldData.findAll({attributes: ['id','patientName','policyNumber', 'cause',
  'createdAt']});


    var ok = response.map(
      item => {
        console.log(item.createdAt)
        // policyType
        var policyType
        var typeList = ["TLS", "LI", "MM", "ST", "CO", "FC"];
        if (typeList.includes(item.policyNumber.split('/')[2])) {
          policyType = item.policyNumber.split('/')[2]
        } else if ( item.policyNumber === '-') {
          policyType = '-'
        } else if ( item.policyNumber.split('/')[0] === 'PIH') {
          policyType = 'PIH'
        } else {
          console.log(item)
        }

        //patientName
        var patientFirstName, patientLastName
        if (item.patientName === null) {
          patientFirstName =  null;
          patientLastName = null;
        } else {
          patientFirstName = humanname.parse(item.patientName).firstName;
          patientLastName = humanname.parse(item.patientName).lastName;
        }

        //reimbursementCurrency
        var parsedReimbursementResult
        var parseReimbursement =  item.reimbusementCurrency.split('(')
        if (parseReimbursement.length===1) {
          if (parseReimbursement[0] === '-') {
            parsedReimbursementResult = null;
          } else {
            var exchangeRate = await models.ExchangeRate.findOne({where: {name:(parseReimbursement[0])}})
            if (exchangeRate !== null) {
              //console.log(exchangeRate.code)
              parsedReimbursementResult =exchangeRate.code
            } else {
              var exchangeRate2 = await models.ExchangeRate.findOne({where: {code:parseReimbursement[0]}})
              if (exchangeRate2 !== null) {
                parsedReimbursementResult = exchangeRate2.code
              } else {
                if (item.reimbusementCurrency === 'Myanmar Kyat') {
                  parsedReimbursementResult = 'MMK'
                } else {
                  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
                  console.log(item.reimbusementCurrency)
                }

              }

            }
          }

          //console.log(exchangeRate)
        }
        else if (parseReimbursement.length===2) {
          //console.log(parseReimbursement[1].split(')')[0])
          parsedReimbursementResult = parseReimbursement[1].split(')')[0]
        } else {
          console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
          console.log(parseReimbursement)
        }




        var newItem = {id: item.id+'-'+item.policyNumber,
          createdBy:0,
          policyNumber:item.policyNumber,
          policyType:policyType,
          patientFirstName:patientFirstName,
          patientLastName:patientLastName,
          cause:item.cuase,
          createdAt:item.createdAt,
          reimbusementCurrency:parsedReimbursementResult
        }
        return newItem

      }
    )
    res.json(ok);
  } catch(e) {
    console.log(e)
    res.sendStatus(500)
  }

});

module.exports = router;
