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


router.get('/rejected', async function(req, res, next) {
  var attributes = ['id','patientName','policyNumber',
     'cause','createdAt', 'ReimbursementCurrency', 'email', 'contactPhoneNumber','contactHomeAddress', 'bankAccount',
     'accountHoldersName','bankName', 'bankAddress', 'swift', 'ibanCodeSortCode', 'status',
     'decisioner','decisionDate', 'decisionReason', 'hospitalName', 'hospitalLocation','doctorName',
     'billingCurrency', 'claimedTotalUSD','billingTotalUSD', 'hospitalDate',
   ]
  for (var i = 1; i < 42; i++) {
   attributes.push(i.toString())
  }

  const response = await models.RejectedClaimsExcel.findAll({attributes: attributes});

  const getData = async () => {
    return await Promise.all(
      response.map(
        async item => {

          try {
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
            //
            // //patientName
            // var patientFirstName, patientLastName
            // if (item.patientName === null) {
            //   patientFirstName =  null;
            //   patientLastName = null;
            // } else {
            //   patientFirstName = humanname.parse(item.patientName).firstName;
            //   patientLastName = humanname.parse(item.patientName).lastName;
            // }
            //
            // //reimbursementCurrency
            // var parsedReimbursementResult
            //
            // var parseReimbursement =  item.ReimbursementCurrency.split('(')
            // if (parseReimbursement.length===1) {
            //   if (parseReimbursement[0] === '-') {
            //     parsedReimbursementResult = null;
            //   } else {
            //     var exchangeRate = await models.ExchangeRate.findOne({where: {name:(parseReimbursement[0])}})
            //     if (exchangeRate !== null) {
            //       //console.log(exchangeRate.code)
            //       parsedReimbursementResult =exchangeRate.code
            //     } else {
            //       var exchangeRate2 = await models.ExchangeRate.findOne({where: {code:parseReimbursement[0]}})
            //       if (exchangeRate2 !== null) {
            //         parsedReimbursementResult = exchangeRate2.code
            //       } else {
            //         if (item.ReimbursementCurrency === 'Myanmar Kyat') {
            //           parsedReimbursementResult = 'MMK'
            //         } else {
            //           console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
            //           console.log(item.ReimbursementCurrency)
            //         }
            //
            //       }
            //
            //     }
            //   }
            //
            //   //console.log(exchangeRate)
            // }
            // else if (parseReimbursement.length===2) {
            //   //console.log(parseReimbursement[1].split(')')[0])
            //   parsedReimbursementResult = parseReimbursement[1].split(')')[0]
            // } else {
            //   console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
            //   console.log(parseReimbursement)
            // }
            //
            //
            // //billingCurrency
            // var parsedBillingResult
            //
            // var parseReimbursement =  item.billingCurrency.split('(')
            // if (parseReimbursement.length===1) {
            //   if (parseReimbursement[0] === '-') {
            //     parsedBillingResult = null;
            //   } else {
            //     var exchangeRate = await models.ExchangeRate.findOne({where: {name:(parseReimbursement[0])}})
            //     if (exchangeRate !== null) {
            //       //console.log(exchangeRate.code)
            //       parsedBillingResult =exchangeRate.code
            //     } else {
            //       var exchangeRate2 = await models.ExchangeRate.findOne({where: {code:parseReimbursement[0]}})
            //       if (exchangeRate2 !== null) {
            //         parsedBillingResult = exchangeRate2.code
            //       } else {
            //         if (item.billingCurrency === 'Myanmar Kyat') {
            //           parsedBillingResult = 'MMK'
            //         } else if (item.billingCurrency === 'Ukraine Hryvnia') {
            //           parsedBillingResult = 'UAH'
            //         }
            //          else {
            //           console.log('$$$$$$$$$$$')
            //           console.log(item.id)
            //           console.log(item.billingCurrency)
            //           parsedBillingResult = null
            //         }
            //
            //       }
            //
            //     }
            //   }
            //
            //   //console.log(exchangeRate)
            // }
            // else if (parseReimbursement.length===2) {
            //   //console.log(parseReimbursement[1].split(')')[0])
            //   parsedBillingResult = parseReimbursement[1].split(')')[0]
            // } else {
            //   console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
            //   console.log(parseReimbursement)
            // }
            //
            // //RCExchangeRate
            // if (item.approvedUSD && item.approvedReimbursement) {
            //   item.RCExchangeRate = item.approvedReimbursement/item.approvedUSD
            //   console.log(item.RCExchangeRate)
            // }
            //
            //
            // //gop
            // item.gop = item.bankName === 'GOP'?true:false
            //

            //for billingInfo
            var billingInfos = []

            for (var i = 1; i < 42; i++) {
              if (item[i] !== null && item[i]>0) {
                if (item[i] >  67295000) {
                  console.log('*************************************************')
                  console.log(item.id)
                }
                billingInfos.push({billingSubCat:i, value:item[i]})
              }

            }
            if (item.billingTotalUSD/item.claimedTotalUSD >  6729500) {
              console.log('*************************************************')
              console.log(item.id)
            }

            //
            // var newItem = {
            //   id: item.id+'-'+item.policyNumber,
            //   createdBy:1,
            //   policyNumber:item.policyNumber,
            //   policyType:policyType,
            //   patientFirstName:patientFirstName,
            //   patientLastName:patientLastName,
            //   cause:item.cuase,
            //   createdAt:item.createdAt,
            //   reimbusementCurrency:parsedReimbursementResult,
            //   contactEmail:item.email,
            //   contactPhoneNumber: item.contactPhoneNumber,
            //   contactHomeAddress:item.contactHomeAddress,
            //   bankAccountNumber: item.bankAccount,
            //   accountHoldersName: item.accountHoldersName,
            //   bankName: item.bankName,
            //   bankAddress: item.bankAddress,
            //   swift: item.swift,
            //   ibanCodeSortCode: item.ibanCodeSortCode,
            //   status: item.status,
            //   decisioner: item.rejector,
            //   decisionDate: item.decisionDate,
            //   decisionReason: item.decisionReason,
            //   gop:item.gop,
            //   RCExchangeRate:item.RCExchangeRate,
            //   ClaimInfoVisits: [{
            //     claimInfoId: item.id+'-'+item.policyNumber,
            //     visitNumber: 1,
            //     dateOfAdmissionVisit: item.hospitalDate,
            //     doctorName: item.doctorName,
            //     hospitalDate: item.hospitalDate,
            //     hospitalOrClinicCountry: item.hospitalLocation,
            //     billingCurrency: parsedBillingResult,
            //     createdAt: item.createdAt,
            //     billingUsdper: item.billingTotalUSD/item.claimedTotalUSD,
            //     BillingInfos : billingInfos
            //   }]
            // }
            // var result = await models.ClaimInfo.create(newItem,{
            //   // include: [{
            //   //   model:models.ClaimInfoVisits,
            //   //   include: [{
            //   //     model: models.BillingInfo,
            //   //   }],
            //   // }],
            // })


            var newItem = {
              claimInfoId: item.id+'-'+item.policyNumber,
              visitNumber: 1,
              dateOfAdmissionVisit: item.hospitalDate,
              doctorName: item.doctorName,
              hospitalDate: item.hospitalDate,
              hospitalOrClinicCountry: item.hospitalLocation,
              billingCurrency: null,
              createdAt: item.createdAt,
              billingUsdper: null,
              BillingInfos : billingInfos
            }


            //var result = await models.BillingInfo.create(billingInfos)


            return Promise.resolve(newItem)
          }
          catch(e) {
            console.log(e)
            return Promise.reject(e)
          }
        }
      )
    )
  }


  const results = await getData()
  //
  models.ClaimInfoVisits.bulkCreate(results,{
        include: [{
          model: models.BillingInfo,
        }],
  })
  res.json(results)

    //res.json('results');

});


router.get('/approved', async function(req, res, next) {

    const response = await models.ApprovedClaimsExcel.findAll({attributes: ['id','patientName','policyNumber',
     'cause','createdAt', 'ReimbursementCurrency', 'email', 'contactPhoneNumber','contactHomeAddress', 'bankAccount',
     'accountHoldersName','bankName', 'bankAddress', 'swift', 'ibanCodeSortCode', 'status',
     'decisioner','decisionDate', 'note', 'approvedUSD', 'approvedReimbursement'
   ]});

    const getData = async () => {
     return await Promise.all(
         response.map(
          async item => {
            try {
              var policyType
              var typeList = ["TLS", "LI", "MM", "ST", "CO", "FC"];
              if (item.policyNumber === null) {
                console.log('policy')
                console.log(item.id)
                policyType = null
                return
              } else if (typeList.includes(item.policyNumber.split('/')[2])) {
                policyType = item.policyNumber.split('/')[2]
              } else if ( item.policyNumber === '-') {
                policyType = '-'
              } else if ( item.policyNumber.split('/')[0] === 'PIH') {
                policyType = 'PIH'
              } else {
                console.log('policyNumber')
                console.log(item.id)
                return
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
              if (item.ReimbursementCurrency === null) {
                parsedReimbursementResult = null
              } else {
                var parseReimbursement =  item.ReimbursementCurrency.split('(')
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
                        if (item.ReimbursementCurrency === 'Myanmar Kyat') {
                          parsedReimbursementResult = 'MMK'
                        } else {
                          console.log('Currency')
                          console.log(item.id)
                          return
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
                  console.log(item.id)
                }

                //RCExchangeRate
                if (item.approvedUSD && item.approvedReimbursement) {
                  item.RCExchangeRate = item.approvedReimbursement/item.approvedUSD
                  //console.log(item.RCExchangeRate)
                }
              }



              //gop
              item.gop = item.bankName === 'GOP'?true:false

              var newItem = {id: item.id+'-'+item.policyNumber,
                createdBy:1,
                policyNumber:item.policyNumber,
                policyType:policyType,
                patientFirstName:patientFirstName,
                patientLastName:patientLastName,
                cause:item.cause,
                createdAt:item.createdAt,
                reimbusementCurrency:parsedReimbursementResult,
                contactEmail:item.email,
                contactPhoneNumber: item.contactPhoneNumber,
                contactHomeAddress:item.contactHomeAddress,
                bankAccountNumber: item.bankAccount,
                accountHoldersName: item.accountHoldersName,
                bankName: item.bankName,
                bankAddress: item.bankAddress,
                swift: item.swift,
                ibanCodeSortCode: item.ibanCodeSortCode,
                status: item.status,
                decisioner: item.decisioner,
                decisionDate: item.decisionDate,
                decisionReason: item.decisionReason,
                gop:item.gop,
                RCExchangeRate:item.RCExchangeRate
              }
              //console.log(newItem)
              return Promise.resolve(newItem)
            }
            catch(e) {
              console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
              console.log(e)
              return Promise.reject(e)
            }
          }
         )
       )
     }

    const result = await getData()
    //console.log('result',result)
    try {
      var bulkCreateClaimInfos = await models.ClaimInfo.bulkCreate(result)
      res.json(bulkCreateClaimInfos);
    }
    catch(e) {
      console.log(e)
    }



});

router.get('/test',async function(req, res, next) {
  //const response = await models.Test.destroy({name:'qewr'});
  // const response = await models.Test.findOne({ where: { id: 1 }} ).then(task => {
  //   // now you see me...
  //   return task.destroy();
  // })

  const response = await models.Test.create({ name:'werwer' } )

  res.json(response)
});

module.exports = router;
