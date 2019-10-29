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
            //patientName
            var patientFirstName, patientLastName
            if (item.patientName === null) {
              patientFirstName =  null;
              patientLastName = null;
            } else {
              patientFirstName = humanname.parse(item.patientName).firstName;
              patientLastName = humanname.parse(item.patientName).lastName;
            }
            //
            //reimbursementCurrency
            var parsedReimbursementResult

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
                      console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
                      console.log(item.ReimbursementCurrency)
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


            //billingCurrency
            var parsedBillingResult

            var parseReimbursement =  item.billingCurrency.split('(')
            if (parseReimbursement.length===1) {
              if (parseReimbursement[0] === '-') {
                parsedBillingResult = null;
              } else {
                var exchangeRate = await models.ExchangeRate.findOne({where: {name:(parseReimbursement[0])}})
                if (exchangeRate !== null) {
                  //console.log(exchangeRate.code)
                  parsedBillingResult =exchangeRate.code
                } else {
                  var exchangeRate2 = await models.ExchangeRate.findOne({where: {code:parseReimbursement[0]}})
                  if (exchangeRate2 !== null) {
                    parsedBillingResult = exchangeRate2.code
                  } else {
                    if (item.billingCurrency === 'Myanmar Kyat') {
                      parsedBillingResult = 'MMK'
                    } else if (item.billingCurrency === 'Ukraine Hryvnia') {
                      parsedBillingResult = 'UAH'
                    }
                     else {
                      console.log('$$$$$$$$$$$')
                      console.log(item.id)
                      console.log(item.billingCurrency)
                      parsedBillingResult = null
                    }

                  }

                }
              }

              //console.log(exchangeRate)
            }
            else if (parseReimbursement.length===2) {
              //console.log(parseReimbursement[1].split(')')[0])
              parsedBillingResult = parseReimbursement[1].split(')')[0]
            } else {
              console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
              console.log(parseReimbursement)
            }

            //RCExchangeRate
            if (item.approvedUSD && item.approvedReimbursement) {
              item.RCExchangeRate = item.approvedReimbursement/item.approvedUSD
              console.log(item.RCExchangeRate)
            }

            //
            //gop
            item.gop = item.bankName === 'GOP'?true:false


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
             var newItem = {
              id: item.id+'-'+item.policyNumber,
              createdBy:1,
              policyNumber:item.policyNumber,
              policyType:policyType,
              patientFirstName:patientFirstName,
              patientLastName:patientLastName,
              cause:item.cuase,
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
              decisioner: item.rejector,
              decisionDate: item.decisionDate,
              decisionReason: item.decisionReason,
              gop:item.gop,
              RCExchangeRate:item.RCExchangeRate,
              ClaimInfoVisits: [{
                claimInfoId: item.id+'-'+item.policyNumber,
                visitNumber: 1,
                dateOfAdmissionVisit: item.hospitalDate,
                doctorName: item.doctorName,
                hospitalDate: item.hospitalDate,
                hospitalOrClinicCountry: item.hospitalLocation,
                billingCurrency: parsedBillingResult,
                createdAt: item.createdAt,
                billingRate: isNaN(item.billingTotalUSD/item.claimedTotalUSD)?null:item.billingTotalUSD/item.claimedTotalUSD,
                BillingInfos : billingInfos
              }]
            }
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


  models.ClaimInfo.bulkCreate(results,{
        include: [{
          model: models.ClaimInfoVisits,
          include: [{
            model: models.BillingInfo,
          }],
        }],
  })
  res.json(results)

    //res.json('results');

});


router.get('/approved', async function(req, res, next) {
  var attributes = ['id','patientName','policyNumber',
     'cause','createdAt', 'ReimbursementCurrency', 'email', 'contactPhoneNumber','contactHomeAddress', 'bankAccount',
     'accountHoldersName','bankName', 'bankAddress', 'swift', 'ibanCodeSortCode', 'status',
     'decisioner','decisionDate', 'note', 'hospitalName', 'hospitalLocation','doctorName',
     'billingCurrency', 'claimedTotalUSD','billingTotalUSD', 'hospitalDate','approvedUSD', 'approvedReimbursement'
   ]

   for (var i = 1; i < 42; i++) {
    attributes.push(i.toString())
   }

    const response = await models.ApprovedClaimsExcel.findAll({attributes: attributes});

   const getData = async () => {
     return await Promise.all(
       response.map(
         async item => {

           try {
             var policyType
             var typeList = ["TLS", "LI", "MM", "ST", "CO", "FC"];
             if (item.policyNumber === null) {
               console.log('item.policyNumber')
               console.log(item.id)
               policyType = null
             } else if (typeList.includes(item.policyNumber.split('/')[2])) {
                policyType = item.policyNumber.split('/')[2]
             } else if ( item.policyNumber === '-') {
               policyType = '-'
             } else if ( item.policyNumber.split('/')[0] === 'PIH') {
               policyType = 'PIH'
             } else {
               console.log('item.policyNumber')
               console.log(item.id)
               policyType = null
             }
             //
             //patientName
             var patientFirstName, patientLastName
             if (item.patientName === null) {
               patientFirstName =  null;
               patientLastName = null;
             } else {
               patientFirstName = humanname.parse(item.patientName).firstName;
               patientLastName = humanname.parse(item.patientName).lastName;
             }
             //
             //reimbursementCurrency


             var parsedReimbursementResult
             if (item.ReimbursementCurrency=== null) {
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
                         console.log('parsedReimbursementResult')
                         console.log(item.id)
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
                 console.log('parsedReimbursementResult')
                 console.log(item.id)
               }
             }


             //billingCurrency
             var parsedBillingResult
             if (item.billingCurrency=== null) {
               parsedBillingResult = null
             } else {
               var parseReimbursement =  item.billingCurrency.split('(')
               if (parseReimbursement.length===1) {
                 if (parseReimbursement[0] === '-') {
                   parsedBillingResult = null;
                 } else {
                   var exchangeRate = await models.ExchangeRate.findOne({where: {name:(parseReimbursement[0])}})
                   if (exchangeRate !== null) {
                     //console.log(exchangeRate.code)
                     parsedBillingResult =exchangeRate.code
                   } else {
                     var exchangeRate2 = await models.ExchangeRate.findOne({where: {code:parseReimbursement[0]}})
                     if (exchangeRate2 !== null) {
                       parsedBillingResult = exchangeRate2.code
                     } else {
                       if (item.billingCurrency === 'Myanmar Kyat') {
                         parsedBillingResult = 'MMK'
                       } else if (item.billingCurrency === 'Ukraine Hryvnia') {
                         parsedBillingResult = 'UAH'
                       }
                        else {
                         console.log('billingCurrency')
                         console.log(item.id)
                         parsedBillingResult = null
                       }

                     }

                   }
                 }

                 //console.log(exchangeRate)
               }
               else if (parseReimbursement.length===2) {
                 //console.log(parseReimbursement[1].split(')')[0])
                 parsedBillingResult = parseReimbursement[1].split(')')[0]
               } else {
                 console.log('parseReimbursement')
                 console.log(parseReimbursement)
                 parsedBillingResult = null
               }
             }

             //RCExchangeRate
             if (item.approvedUSD && item.approvedReimbursement) {
               item.RCExchangeRate = item.approvedReimbursement/item.approvedUSD

             }

             //
             //gop
             item.gop = item.bankName === 'GOP'?true:false


             //for billingInfo
             var billingInfos = []

             for (var i = 1; i < 42; i++) {
               if (item[i] !== null && item[i]>0) {
                 if (item[i] >  67295000) {
                   console.log('billingInfo')
                   console.log(item.id)
                 }
                 billingInfos.push({billingSubCat:i, value:item[i]})
               }

             }
             if (item.billingTotalUSD/item.claimedTotalUSD >  6729500) {
               console.log('billingUsdper infinit')
               console.log(item.id)
             }

             //billingUsdper
             var billingUsdper
             if (  item.billingTotalUSD=== null ||  item.claimedTotalUSD === null ) {
               console.log('billingUsdper')
               console.log(item.id)
               billingUsdper = null
             } else if (isNaN(item.billingTotalUSD/item.claimedTotalUSD)) {
               console.log('>>>>>>>>>>>>>>>>>>>')
               console.log(item.billingTotalUSD)
               console.log(item.claimedTotalUSD)
             } else if (item.billingTotalUSD/item.claimedTotalUSD> 0) {
               billingUsdper = item.billingTotalUSD/item.claimedTotalUSD
             } else {
               console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~')
               console.log(item.billingTotalUSD)
               console.log(item.claimedTotalUSD)
               billingUsdper = null
             }
             //
              var newItem = {
               id: item.id+'-'+item.policyNumber,
               createdBy:1,
               policyNumber:item.policyNumber,
               policyType:policyType,
               patientFirstName:patientFirstName,
               patientLastName:patientLastName,
               cause:item.cuase,
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
               decisioner: item.rejector,
               decisionDate: item.decisionDate,
               decisionReason: item.decisionReason,
               gop:item.gop,
               RCExchangeRate:isNaN(item.RCExchangeRate)?null:item.RCExchangeRate,
               //RCExchangeRate:null,
               ClaimInfoVisits: [{
                 claimInfoId: item.id+'-'+item.policyNumber,
                 visitNumber: 1,
                 dateOfAdmissionVisit: item.hospitalDate,
                 doctorName: item.doctorName,
                 hospitalDate: item.hospitalDate,
                 hospitalOrClinicCountry: item.hospitalLocation,
                 billingCurrency: parsedBillingResult,
                 createdAt: item.createdAt,
                 billingRate: billingUsdper,
                 BillingInfos : billingInfos
               }]
             }
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

   models.ClaimInfo.bulkCreate(results,{
         include: [{
           model: models.ClaimInfoVisits,
           include: [{
             model: models.BillingInfo,
           }],
         }],
   })
   res.json(results)

});

router.get('/legacy',async function(req, res, next) {
  var attributes = ['id','patientName','policyNumber',
     'cause','createdAt', 'reimbursementCurrency', 'email', 'contactPhoneNumber','contactHomeAddress', 'bankAccount',
     'accountHoldersName','bankName', 'bankAddress', 'swift', 'ibanCodeSortCode', 'status',
     'decisioner','decisionDate', 'note', 'hospitalName', 'hospitalLocation','doctorName',
     'billingCurrency', 'claimedTotalUSD','billingTotalbilling', 'hospitalDate','approvedUSD', 'approvedReimbursement',
     'rejectReason',
   ]

   for (var i = 1; i < 42; i++) {
    attributes.push(i.toString())
   }

  const response = await models.LegacyExcel.findAll({attributes: attributes});

   const getData = async () => {
     return await Promise.all(
       response.map(
         async item => {

           try {
             var policyType
             var typeList = ["TLS", "LI", "MM", "ST", "CO", "FC"];
             if (item.policyNumber === null) {
               console.log('item.policyNumber')
               console.log(item.id)
               policyType = null
             } else if (typeList.includes(item.policyNumber.split('/')[2])) {
                policyType = item.policyNumber.split('/')[2]
             } else if ( item.policyNumber === '-') {
               policyType = '-'
             } else if ( item.policyNumber.split('/')[0] === 'PIH') {
               policyType = 'PIH'
             } else {
               console.log('item.policyNumber')
               console.log(item.id)
               policyType = null
             }
             //
             //patientName
             var patientFirstName, patientLastName
             if (item.patientName === null) {
               patientFirstName =  null;
               patientLastName = null;
             } else {
               patientFirstName = humanname.parse(item.patientName).firstName;
               patientLastName = humanname.parse(item.patientName).lastName;
             }
             //
             //reimbursementCurrency


             var parsedReimbursementResult
             if (item.reimbursementCurrency=== null) {
               parsedReimbursementResult = null
             } else {
               var parseReimbursement =  item.reimbursementCurrency.split('(')
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
                       if (item.reimbursementCurrency === 'Myanmar Kyat') {
                         parsedReimbursementResult = 'MMK'
                       } else {
                         console.log('parsedReimbursementResult')
                         console.log(item.id)
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
                 console.log('parsedReimbursementResult')
                 console.log(item.id)
               }
             }


             //billingCurrency
             var parsedBillingResult
             if (item.billingCurrency=== null) {
               parsedBillingResult = null
             } else {
               var parseReimbursement =  item.billingCurrency.split('(')
               if (parseReimbursement.length===1) {
                 if (parseReimbursement[0] === '-') {
                   parsedBillingResult = null;
                 } else {
                   var exchangeRate = await models.ExchangeRate.findOne({where: {name:(parseReimbursement[0])}})
                   if (exchangeRate !== null) {
                     //console.log(exchangeRate.code)
                     parsedBillingResult =exchangeRate.code
                   } else {
                     var exchangeRate2 = await models.ExchangeRate.findOne({where: {code:parseReimbursement[0]}})
                     if (exchangeRate2 !== null) {
                       parsedBillingResult = exchangeRate2.code
                     } else {
                       if (item.billingCurrency === 'Myanmar Kyat') {
                         parsedBillingResult = 'MMK'
                       } else if (item.billingCurrency === 'Ukraine Hryvnia') {
                         parsedBillingResult = 'UAH'
                       }
                        else {
                         console.log('billingCurrency')
                         console.log(item.id)
                         parsedBillingResult = null
                       }

                     }

                   }
                 }

                 //console.log(exchangeRate)
               }
               else if (parseReimbursement.length===2) {
                 //console.log(parseReimbursement[1].split(')')[0])
                 parsedBillingResult = parseReimbursement[1].split(')')[0]
               } else {
                 console.log('parseReimbursement')
                 console.log(parseReimbursement)
                 parsedBillingResult = null
               }
             }

             //RCExchangeRate
             if (item.approvedUSD && item.approvedReimbursement) {
               item.RCExchangeRate = item.approvedReimbursement/item.approvedUSD

             }

             //
             //gop
             item.gop = item.bankName === 'GOP'?true:false


             //for billingInfo
             var billingInfos = []

             for (var i = 1; i < 42; i++) {
               if (item[i] !== null && item[i]>0) {
                 if (item[i] >  67295000) {
                   console.log('billingInfo')
                   console.log(item.id)
                 }
                 billingInfos.push({billingSubCat:i, value:item[i]})
               }

             }
             if (item.billingTotalbilling/item.claimedTotalUSD >  6729500) {
               console.log('billingUsdper infinit')
               console.log(item.id)
             }

             //billingUsdper
             var billingUsdper
             if (  item.billingTotalbilling=== null ||  item.claimedTotalUSD === null ) {
               console.log('billingUsdper')
               console.log(item.id)
               billingUsdper = null
             } else if (isNaN(item.billingTotalbilling/item.claimedTotalUSD)) {
               console.log('>>>>>>>>>>>>>>>>>>>')
               console.log(item.billingTotalbilling)
               console.log(item.claimedTotalUSD)
             } else if (item.billingTotalbilling/item.claimedTotalUSD> 0) {
               billingUsdper = item.billingTotalbilling/item.claimedTotalUSD
             } else {
               console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~')
               console.log(item.billingTotalbilling)
               console.log(item.claimedTotalUSD)
               billingUsdper = null
             }
             //
              var newItem = {
               id: item.id+'-'+item.policyNumber,
               createdBy:1,
               policyNumber:item.policyNumber,
               policyType:policyType,
               patientFirstName:patientFirstName,
               patientLastName:patientLastName,
               cause:item.cuase,
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
               decisioner: item.rejector,
               decisionDate: item.decisionDate,
               note: item.note,
               gop:item.gop,
               rejectReason: item.rejectReason,
               RCExchangeRate:isNaN(item.RCExchangeRate)?null:item.RCExchangeRate,
               //RCExchangeRate:null,
               ClaimInfoVisits: [{
                 claimInfoId: item.id+'-'+item.policyNumber,
                 visitNumber: 1,
                 dateOfAdmissionVisit: item.hospitalDate,
                 doctorName: item.doctorName,
                 hospitalDate: item.hospitalDate,
                 hospitalOrClinicCountry: item.hospitalLocation,
                 billingCurrency: parsedBillingResult,
                 createdAt: item.createdAt,
                 billingUsdper: billingUsdper,
                 BillingInfos : billingInfos
               }]
             }
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

   models.ClaimInfo.bulkCreate(results,{
         include: [{
           model: models.ClaimInfoVisits,
           include: [{
             model: models.BillingInfo,
           }],
         }],
   })
   res.json(results)

});

module.exports = router;
