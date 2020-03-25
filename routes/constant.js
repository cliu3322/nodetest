var express = require('express');
var router = express.Router();
var models  = require('../models');
var d3 = require('d3-array');

var humanname  = require('humanname');

var is_date = function(input) {
  if ( Object.prototype.toString.call(input) === "[object Date]" ) 
    return true;
  return false;   
};

/* GET home page. */
router.get('/', async function(req, res, next) {
  const data = await models.vClaimInfo.findAll({});
  res.json(data)
});

router.get('/claiminfo', async function(req, res, next) {
  try {

    var attributes = ['id','createdBy','accountHoldersName',
    'bankAccountNumber','bankAddress', 'bankName', 'createdAt'
  ]
    const data = await models.ClaimInfos_v1.findAll({attributes: attributes});
    console.log(data)
    const getData = async () => {
      return await Promise.all(
        data.forEach(
          async item => {
            return item
            //return models.ClaimInfo.create(item)
          }
        )
      )
    }
    const results = await getData()
    console.log(results)
    // console.log(data.createdAt)
    // console.log(data[0].toJSON().createdAt)
    
    //const results = await models.ClaimInfo.create(data[0].toJSON())
    //const response = await models.ClaimInfo.bulkCreate(data)
    res.json(results)
  } catch (error) {
    console.log(error)
  }
  



 
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
          if((!item.policyNumber)||(!item.id)) {
            console.log(item.id)
          }
          try {
            var policyType
            var typeList = ["TLS", "LI", "MM", "ST", "CO", "FC"];
            if (typeList.includes(item.policyNumber.split('/')[2])) {
              policyType = item.policyNumber.split('/')[2]
            } else if ( item.policyNumber === '-') {
              policyType = '-'
              console.log('policyNumber -', item.id)
            } else if ( item.policyNumber.split('/')[0] === 'PIH') {
              policyType = 'PIH'
            } else {
              console.log(item.id)
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
            var RCExchangeRate
            var RCExchangeRateDate
            var parseReimbursement =  item.ReimbursementCurrency.split('(')
            if (parseReimbursement.length===1) {
              if (parseReimbursement[0] === '-') {
                console.log('reimburse missing',item.id)
                parsedReimbursementResult = null;
              } else {
                const exchangeRate = await models.ExchangeRate.findOne({where: {name:(parseReimbursement[0])}})
                if (exchangeRate !== null) {   
                  //declined
                  RCExchangeRate = exchangeRate.rate
                  RCExchangeRateDate = exchangeRate.data
                  parsedReimbursementResult =exchangeRate.code
                } else {
                  var exchangeRate2 = await models.ExchangeRate.findOne({where: {code:parseReimbursement[0]}})
                  if (exchangeRate2 !== null) {
                    RCExchangeRate = exchangeRate2.rate
                    RCExchangeRateDate = exchangeRate2.data
                    parsedReimbursementResult = exchangeRate2.code
                  } else {
                    if (item.ReimbursementCurrency === 'Myanmar Kyat') {
                      parsedReimbursementResult = 'MMK'
                    } else {
                      console.log('~~~~~~~~~ReimbursementCurrency')
                      console.log(item.id)
                    }

                  }

                }
              }
            }
            else if (parseReimbursement.length===2) {
              //console.log(parseReimbursement[1].split(')')[0])
              
              parsedReimbursementResult = parseReimbursement[1].split(')')[0]
              var exchangeRate3 = await models.ExchangeRate.findOne({where: {code:parsedReimbursementResult}})
              RCExchangeRate = exchangeRate3.rate
              RCExchangeRateDate = exchangeRate3.data
            } else {
              console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
              console.log(parseReimbursement)
            }

            //RCExchangeRate
            if (item.approvedUSD && item.approvedReimbursement) {
              item.RCExchangeRate = item.approvedReimbursement/item.approvedUSD
            }

            //
            //gop
            item.gop = item.bankName === 'GOP'?true:false

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


            if(isNaN(item.billingTotalUSD/item.claimedTotalUSD)) {
              if (!(item.billingTotalUSD===0&&item.claimedTotalUSD===0))
              console.log(item.id)
            }
            



            //for billingInfo
            var billingInfos = []

            for (var i = 1; i < 42; i++) {
              if (item[i] !== null && item[i]>0) {
                if (item[i] >  67295000) {
                  console.log('*****Too big')
                  console.log(i)
                  console.log(item.id)
                }
                billingInfos.push({billingSubCat:i, value:item[i]})
              }

            }
            if (item.billingTotalUSD/item.claimedTotalUSD >  6729500) {
              console.log('********** Rate not right')
              console.log(item.id)
            }

             var newItem = {
              id: (item.policyNumber+'-'+item.id),
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
              approvedAt: item.decisionDate,
              gop:item.gop,
              RCExchangeRate:RCExchangeRate,
              RCExchangeRateDate:RCExchangeRateDate,
              status:'cd',
              isPaid:1,
              isSendToAccountant:1,
              ClaimInfoVisits: [{
                claimInfoId: (item.policyNumber+'-'+item.id),
                visitNumber: 1,
                dateOfAdmissionVisit: item.hospitalDate,
                doctorName: item.doctorName,
                hospitalDate: item.hospitalDate,
                hospitalOrClinicCountry: item.hospitalLocation,
                billingCurrency: parsedBillingResult,
                createdAt: item.createdAt,
                billingRate: isNaN(item.billingTotalUSD/item.claimedTotalUSD)?0:item.billingTotalUSD/item.claimedTotalUSD,
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
  .then(created => {
    res.json(created)
  })
  .catch (e => {
    console.log('catched')
    console.log(e)
    throw e
  })
  

    //res.json('results');

});

router.get('/validation', async function(req, res, next) {
  var attributes = ['id','patientName','policyNumber',
     'cause','createdAt', 'ReimbursementCurrency', 'email', 'contactPhoneNumber','contactHomeAddress', 'bankAccount',
     'accountHoldersName','bankName', 'bankAddress', 'swift', 'ibanCodeSortCode', 'status',
     'decisioner','decisionDate', 'decisionReason', 'hospitalName', 'hospitalLocation','doctorName',
     'billingCurrency', 'claimedTotalUSD','billingTotalUSD', 'hospitalDate', 'approved_USD',
     'approved_reimbusement', 'Reject_USD'
   ]
  for (var i = 1; i < 42; i++) {
   attributes.push(i.toString())
  }
  const response = await models.Dirty.findAll({attributes: attributes});
  var count = 0
  const getData = async () => {
    return await Promise.all(
      response.map(
        async item => {
          try {

            let contactFirstName, contactLastName
            if (item.patientName === null) {
              contactFirstName =  null;
              contactLastName = null;
              console.log('patientname missing',item.id, item.patientName)
            } else {
              contactFirstName = humanname.parse(item.patientName.trim()).firstName;
              contactLastName = humanname.parse(item.patientName).lastName;
            }

            var policyType
            var typeList = ["TLS", "LI", "MM", "ST", "CO", "FC"];
            if((!item.policyNumber)||(!item.id)) {
              console.log('IDPolicyNumber missing',item.id, item.policyNumber)
            } else if (typeList.includes(item.policyNumber.split('/')[2])) {
              policyType = item.policyNumber.split('/')[2]
            } else if ( item.policyNumber === '-') {
              policyType = '-'
              console.log('policyNumber -',item.id ,item.policyNumber)
            } else if ( item.policyNumber.split('/')[0] === 'PIH') {
              policyType = 'PIH'
            } else {
              console.log('policytype else',item.id)
            }
            let partialApproved = ['C35',	'C48',	'C406',	'C497',	'C570',	'C662',	'C689',	'C724',	'C782',	'C790',	'C888',	'C966',	'C1015',	'C1151',	'C1155',	'C1323',	'C1351',	'C1432',	'C1642',	'C1730',	'C1767',	'C1811',	'C1813',	'C2106',	'C2155',	'C2193',	'C2246',	'C2266',	'C2306',	'C2316',	'C2342',	'C2343',	'C2359',	'C2395',	'C2463',	'C2646',	'C2674',	'C2777',	'C2786',	'C2875',	'C2993',	'C3123',	'C3162',	'B3',	'C3318',	'C3345',	'B35',	'C3529',	'B54',	'C3635',	'C3916',	'C3962',	'C4007',	'B223',	'C4720',	'C4729',	'C4838',	'C4888',	'B288',	'B292',	'B320',	'C4984',	'C5117',	'C5214',	'A102',	'B354',	'C5576',	'C5707',	'B407',	'C5807',	'C5815',	'C5933',	'C6247',	'C6278',	'C6335',	'D315',	'D327',	'B588',	'B598',	'A121',	'D536',	'C6386',	'C6410',	'C6495',	'D841',	'D842',	'C6625',	'D889',	'C6714',	'A179',	'C6775',	'C6900',	'D1000',	'D1001',	'F1033',	'B4909',	'T4873',	'T5003',	'S5139',
          'D5', 'D459', 'D533','D93','C521', 'C925', 'C1006']
            let yelloeCA =['C1124',	'B77',	'C4396',	'C5062',	'B382',	'C5666',	'C6116',	'B566',	'C6236',	'B606',	'B610',	'B618',	'C6404',	'D755',	'C6651',	'B646',	'F1027',	'F1047',	'T2794',	'T2800',	'E4808',	'B5274',	'U5040',	'A5231',	'A5329',]
            let redCA = ['B427',	'B441',	'C6108',	'C6155',	'B483',	'B493',	'B497',	'B500',	'B511',	'F4795',	'C9201',	'B4907',	'F4848',	'C9235',	'C9230',	'F4871',	'A4920',	'S4800',	'T4832',	'E4850',	'C9363',	'T4854',	'T4848',	'A5039',	'F4973',	'U4847',	'B652',	'C9515',	'D5012',	'B5075',	'D5080',	'C9624',	'G4948',	'U5049',	'B5352',	'B5387',	'B5336',	'D5227',	'A5336',	'T5116',	'C9782',	'U5120',	'T5135',	'S5150',]
            let ignore = []
            //let ignoreNoStatus = ['D779a', 'D1014',	'F1040',	'T5079',	'A5328',	'D5',	'U5087',	'U5088',	'B4850',	'T4791',	'D391',	'B212',	'B224',	'C2150',	'F4991',	'S4948',	'T5138',	'B5478A',	'G4859',	'D458',	'D459',	'B641',	'B293',	'D533',	'A4937',	'U4990',	'D93',	'C6569',	'C521',	'A2',	'A4',	'C6709',	'C925',	'C1006',	'C6880',	'D5103',	'D5104',	'B432',	'D183',]
            if(!(ignore.includes(item.id))){

              var status
              item.status = item.status?item.status.trim():null
              if(partialApproved.includes(item.id)){
                status = 'cp'
              } else if(yelloeCA.includes(item.id)){
                status = 'ca'
                item.approved_USD = item.claimedTotalUSD
              } else if(redCA.includes(item.id)){
                status = 'ca'
                item.claimedTotalUSD = item.approved_USD
              } else if(item.status === 'Rejected'){
                status = 'cd'
              } else if (item.status !== 'Rejected' && item.status !== 'Approved. To be Paid') {
                console.log('status wrong',item.id, item.status)
              } else if (Math.abs(item.claimedTotalUSD - item.approved_USD) === 0) {
                status = 'ca'
              } else if (Math.abs(item.claimedTotalUSD - item.approved_USD) < 0.1) {
                status = 'ca'
              } else if (item.Reject_USD > 5) {
                status = 'cp'
              } else if ((item.claimedTotalUSD - item.approved_USD) <0) {
                count++
                console.log('status lossmoney',item.id)
              } else {
                console.log('status tooclose',item.id)
              }


              if(!status){
                console.log('status missing', item.id)
              }
            

            


              //reimbursementCurrency
              var parsedReimbursementResult
              var RCExchangeRate
              var RCExchangeRateDate
              var RCExchangeRateTable
              var RCExchangeRateDateTable
              var parseReimbursement =  item.ReimbursementCurrency?item.ReimbursementCurrency.split('('):[]


              if (parseReimbursement.length===1) {
                if (parseReimbursement[0] === '-') {
                  console.log('reimburse missing',item.id)
                  parsedReimbursementResult = null;
                } else {
                  const exchangeRate = await models.ExchangeRate.findOne({where: {name:(parseReimbursement[0])}})
                  if (exchangeRate !== null) {   
                    parsedReimbursementResult =exchangeRate.code
                    RCExchangeRateTable = exchangeRate.rate
                    RCExchangeRateDateTable = exchangeRate.date
                  } else {
                    var exchangeRate2 = await models.ExchangeRate.findOne({where: {code:parseReimbursement[0]}})
                    if (exchangeRate2 !== null) {
                      parsedReimbursementResult = exchangeRate2.code
                      RCExchangeRateTable = exchangeRate2.rate
                      RCExchangeRateDateTable = exchangeRate2.date
                    } else {
                      if (item.ReimbursementCurrency === 'Myanmar Kyat') {
                        parsedReimbursementResult = 'MMK'
                      } else {
                        console.log('ReimbursementCurrency else', item.id, item.ReimbursementCurrency)
                      }

                    }

                  }
                }
              }
              else if (parseReimbursement.length===2) {
                parsedReimbursementResult = parseReimbursement[1].split(')')[0]
                const exchangeRate3 = await models.ExchangeRate.findOne({where: {code:parsedReimbursementResult}})
                if (exchangeRate3 !== null) {   
                  parsedReimbursementResult =exchangeRate3.code
                  RCExchangeRateTable = exchangeRate3.rate
                  RCExchangeRateDateTable = exchangeRate3.date
                } else {
                  console.log('no exchange Rate 3', parsedReimbursementResult)
                }
              } else {
                console.log('ReimbursementCurrency never catch up', item.id, parseReimbursement)
              }

              //billingCurrency
              var parsedBillingResult
              var BillingExchangeRate
              var BillingExchangeRateDate
              var parseReimbursement =  item.billingCurrency?item.billingCurrency.split('('):[]
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
                        console.log('billingCurrency else', item.id, item.billingCurrency)
                        parsedBillingResult = item.billingCurrency
                      }
                    }

                  }
                }

                //console.log(exchangeRate)
              }
              else if (parseReimbursement.length===2) {
                parsedBillingResult = parseReimbursement[1].split(')')[0]
              } else {
                console.log('billingCurrency never catch', item.id, item.billingCurrency)
              }

              BillingExchangeRate = item.billingTotalUSD/item.claimedTotalUSD
              BillingExchangeRateDate = item.createdAt
              if (isNaN(BillingExchangeRate)) {
                console.log('billingEXRate missing',item.id)
              }

              if(item.approved_reimbusement) {
                RCExchangeRate = item.approved_reimbusement / item.approved_USD
                RCExchangeRateDate = item.createdAt
              } else if (parsedBillingResult == parsedReimbursementResult) {
                RCExchangeRate = BillingExchangeRate
                RCExchangeRateDate = item.createdAt
              } else if (item.status === 'Rejected') {
                if(!RCExchangeRateTable){
                  console.log('no RCExchangeRateTable', item.i)
                }
                RCExchangeRate = RCExchangeRateTable
                RCExchangeRateDate = RCExchangeRateDateTable
              } else if (parsedReimbursementResult === 'USD') {
                RCExchangeRate = 1
                RCExchangeRateDate = item.createdAt
              }
              if(!RCExchangeRate) {
                console.log('RCEXRate missing',item.id, RCExchangeRate)
              }
                
              if(!RCExchangeRateDate) {
                console.log('RCEXRateDate missing',item.id, RCExchangeRateDate,)
              }




            
            if(!is_date(item.createdAt))
              console.log('no createdAt',item.id)

            //for billingInfo
            var billingInfos = []
            var total = 0
            for (var i = 1; i < 42; i++) {
              if (item[i] !== null && item[i]>0) {
                total += item[i]
                if (item[i] >  67295000) {
                  console.log('billingInfo big', item.id)
                }
                let approved
                if(status === 'cd') {
                  approved = 0
                } else if (status === 'ca') {
                  approved = item[i]
                } else if (status === 'cp') {
                  approved = (item[i]/item.claimedTotalUSD)*item.approved_USD

                  //console.log('status cp', item.id, status)
                } else {
                  console.log('billingInfo status', item.id)
                }
                billingInfos.push({billingSubCat:i, value:item[i], approved:approved})
              }
            }
            
            //ca validation
            if(status === 'ca') {
              if(!item.claimedTotalUSD) {
                console.log('claimedTotalUSD missing', item.id)
              } else if(Math.abs(total.toFixed(2) - item.claimedTotalUSD.toFixed(2))>0.1) {
                console.log('ca total != claimedTotalUSD', item.id, total.toFixed(2), item.claimedTotalUSD.toFixed(2), item.approved_USD.toFixed(2))
              }

              if(!item.approved_USD) {
                console.log('approved_USD missing', item.id)
              } else if(Math.abs(item.approved_USD.toFixed(2) - item.claimedTotalUSD.toFixed(2))>0.1) {
                console.log('ca approved_USD != claimedTotalUSD', item.id, total.toFixed(2), item.claimedTotalUSD.toFixed(2), item.approved_USD.toFixed(2))
              }
            }

            if(status === 'cp') {
              if(total === null || total === undefined){
                console.log('total null',item.id, total)
              } else if(item.claimedTotalUSD === null) {
                console.log('claimedTotalUS null',item.id, item.claimedTotalUSD)
              } else if(item.approved_USD === null) {
                console.log('approved_USD null',item.id, item.approved_USD, status)
              } else if(Math.abs(total.toFixed(2) - item.claimedTotalUSD.toFixed(2))>0.1) {
                console.log('total not match claim', total.toFixed(2), item.claimedTotalUSD.toFixed(2), item.id)
              }
            }
            if(parsedBillingResult=== parsedReimbursementResult && Math.abs(BillingExchangeRate - RCExchangeRate)>RCExchangeRate*0.1) {
              console.log('EXRate wrong', item.id, BillingExchangeRate,RCExchangeRate , parsedBillingResult)
            }
            if(status !== 'cd'){
              if(parsedBillingResult=== parsedReimbursementResult && Math.abs((item.billingTotalUSD/item.claimedTotalUSD) - (item.approvedReimbursement/item.approved_USD))>RCExchangeRate*0.01) {
                console.log('EXRate wrong', item.id, BillingExchangeRate,RCExchangeRate , parsedBillingResult)
              }
  
            }
            if(!(parsedReimbursementResult||parsedBillingResult)) {
              console.log(item.id)
            }



            const percentage = 0.5
            if(item.createdAt > new Date('2019-02-01 00:00:00.0000000 +00:00') ) {
              if(parsedReimbursementResult !== 'CHF') {
                let comparedRatedRC = (await models.ExchangeRate.findOne({where: {code:parsedReimbursementResult}})).rate
                if(Math.abs(RCExchangeRate -  comparedRatedRC) > RCExchangeRate*percentage || Math.abs(RCExchangeRate -  comparedRatedRC) > comparedRatedRC*percentage) {
                  console.log('RCExchangeRate wrong', item.id,RCExchangeRate, comparedRatedRC, parsedReimbursementResult)
                } else if(Math.log(RCExchangeRate)*Math.log(comparedRatedRC)<0) {
                  console.log('RCExchangeRate signWrong', item.id,RCExchangeRate, comparedRatedRC, parsedReimbursementResult)
                }
              }
              if(parsedBillingResult !== 'CHF') {
                let comparedRatedBilling = (await models.ExchangeRate.findOne({where: {code:parsedBillingResult}})).rate
                if(Math.abs(BillingExchangeRate -  comparedRatedBilling) > BillingExchangeRate*percentage || Math.abs(BillingExchangeRate -  comparedRatedBilling) > comparedRatedBilling*percentage) {
                  console.log('BillingExchangeRate wrong', item.id,BillingExchangeRate, comparedRatedBilling, parsedBillingResult)
                } else if(Math.log(BillingExchangeRate)*Math.log(comparedRatedBilling)<0) {
                  console.log('BillingExchangeRate signWrong', item.id,BillingExchangeRate, comparedRatedBilling, parsedBillingResult)
                }
              }
            }
            

          }

            var newItem = {
              id: (item.policyNumber+'-'+item.id).trim(),
              createdBy: 1, 
              accountHoldersName:item.accountHoldersName?item.accountHoldersName.trim():null,
              bankAccountNumber:item.bankAccount?item.bankAccount.trim():null,
              bankAddress:item.bankAddress?item.bankAddress.trim():null,
              bankName:item.bankName?item.bankName.trim():null,
              cause:item.cause?item.cause.trim():null,
              contactEmail:item.email?item.email.trim():null,
              contactFirstName:contactFirstName,
              contactLastName:contactLastName,
              contactHomeAddress:item.contactHomeAddress?item.contactHomeAddress.trim():null,
              contactPhoneNumberCountryCode:null,
              contactPhoneNumber:item.contactPhoneNumber?item.contactPhoneNumber.trim():null,
              gop:(item.bankName === 'GOP'|| item.id === 'D136' ||  item.id === 'D268' )?true:false,
              ibanCodeSortCode:item.ibanCodeSortCode?item.ibanCodeSortCode.trim():null,
              patientAge:null,
              patientDob:null,
              patientFirstName:contactFirstName,
              patientLastName:contactLastName,
              policyEmail:null,
              policyFirstName:null,
              policyGroupPolicy:null,
              policyLastName:null,
              policyType:policyType,
              cause:item.policyNumber?item.policyNumber.trim():null,
              policyVip:null,
              reimbusementCurrency:parsedReimbursementResult, 
              RCExchangeRate: RCExchangeRate,
              RCExchangeRateDate: RCExchangeRateDate,
              relationshipToPatient: null,
              swift:item.swift?item.swift.trim():null,
              status:status,
              createdAt:item.createdAt,
              ClaimInfoVisits: [{
                 claimInfoId: (item.policyNumber+'-'+item.id).trim(),
                 visitNumber: 1,
                 dateOfAdmissionVisit: item.hospitalDate,
                 doctorName: item.doctorName,
                 hospitalName: item.hospitalName,
                 hospitalOrClinicCountry: item.hospitalLocation,
                 billingCurrency: parsedBillingResult,
                 billingRate: BillingExchangeRate,
                 currencyDate:RCExchangeRateDate,
                 createdAt: item.createdAt,
                MedicalDiagnosis:item.cause?item.cause.trim():null,
                BillingInfos : billingInfos
              }]
            }
            return Promise.resolve(newItem)

          } catch(e) {
            console.log(e)
            return Promise.reject(e)
          }
        }
      )
    )
  }
  
  let results = await getData()
  //console.log(count)
  res.send({status:'ok'})
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
                   console.log(item.id)
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
              //  //RCExchangeRate:null,
              //  ClaimInfoVisits: [{
              //    claimInfoId: item.id+'-'+item.policyNumber,
              //    visitNumber: 1,
              //    dateOfAdmissionVisit: item.hospitalDate,
              //    doctorName: item.doctorName,
              //    hospitalDate: item.hospitalDate,
              //    hospitalOrClinicCountry: item.hospitalLocation,
              //    billingCurrency: parsedBillingResult,
              //    createdAt: item.createdAt,
              //    billingRate: billingUsdper,
              //    BillingInfos : billingInfos
              //  }]
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


router.get('/v1reject', async function(req, res, next) {

  const response = await models.vClaimInfo.findAll({});

  const getData = async () => {
    return await Promise.all(
      response.map(
        async item => {
          try {

            //policyType
            let policyType
            switch(item.policyType) {
              case 'Standard':
                policyType = "ST"
                break;
              case 'Thailand Long Stay':
                policyType = "TLS"
                break;
              case 'Fully Comprehensive':
                policyType = "FC"
                break;
              case 'Major Medical':
                policyType = "MM"
                break;
              case 'Life Insurance':
                policyType = "LI"
                break;
              case 'Comprehensive':
                policyType = "CO"
                break;
              default:
                policyType = null
            }

            //patientName
            var patientFirstName, patientLastName
            if (item.name === null) {
              patientFirstName =  null;
              patientLastName = null;
            } else {
              patientFirstName = humanname.parse(item.name).firstName;
              patientLastName = humanname.parse(item.name).lastName;
            }


            //reimbursementCurrency


            var parsedReimbursementResult
            if (item.reimbusementCurrency=== null) {
              parsedReimbursementResult = null
            } else {
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
                        console.log('parsedReimbursementResult')
                        console.log(item.ID)
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
                console.log(item.ID)
              }
            }            
            //gop
            item.gop = item.bankName === 'Y'?true:false

            //
            var newItem = {
              id: item.ID.trim(),
              createdBy:1,
              policyNumber:item.policyNumber?item.policyNumber.trim():null,
              policyType:policyType?policyType.trim():null,
              patientFirstName:patientFirstName?patientFirstName.trim():null,
              patientLastName:patientLastName?patientLastName.trim():null,
              cause:item.cuase?item.cuase.trim():null,
              createdAt:item.createdAt,
              reimbusementCurrency:parsedReimbursementResult?parsedReimbursementResult.trim():null,
              contactEmail:item.email?item.email.trim():null,
              contactPhoneNumber: item.contactPhoneNumber?item.contactPhoneNumber:null,
              contactHomeAddress:item.contactHomeAddress?item.contactHomeAddress.trim():null,
              bankAccountNumber: item.bankAccount?item.bankAccount.trim():null,
              accountHoldersName: item.accountHoldersName?item.accountHoldersName.trim():null,
              bankName: item.bankName?item.bankName.trim():null,
              bankAddress: item.bankAddress?item.bankAddress.trim():null,
              swift: item.swift?item.swift.trim():null,
              ibanCodeSortCode: item.ibanCodeSortCode?item.ibanCodeSortCode.trim():null,
              status: item.status?item.status.trim():null,
              decisioner: item.rejector?item.rejector.trim():null,
              decisionDate: item.decisionDate,
              decisionReason: item.decisionReason,
              gop:item.gop,
              RCExchangeRate:isNaN(item.RCExchangeRate)?null:item.RCExchangeRate,
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
  let results

    results = await getData()

   //

   res.json(results)

});


router.get('/v1reject', async function(req, res, next) {

  const response = await models.vClaimInfo.findAll({});

  const getData = async () => {
    return await Promise.all(
      response.map(
        async item => {
          try {

            //policyType
            let policyType
            switch(item.policyType) {
              case 'Standard':
                policyType = "ST"
                break;
              case 'Thailand Long Stay':
                policyType = "TLS"
                break;
              case 'Fully Comprehensive':
                policyType = "FC"
                break;
              case 'Major Medical':
                policyType = "MM"
                break;
              case 'Life Insurance':
                policyType = "LI"
                break;
              case 'Comprehensive':
                policyType = "CO"
                break;
              default:
                policyType = null
            }

            //patientName
            var patientFirstName, patientLastName
            if (item.name === null) {
              patientFirstName =  null;
              patientLastName = null;
            } else {
              patientFirstName = humanname.parse(item.name).firstName;
              patientLastName = humanname.parse(item.name).lastName;
            }


            //reimbursementCurrency


            var parsedReimbursementResult
            if (item.reimbusementCurrency=== null) {
              parsedReimbursementResult = null
            } else {
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
                        console.log('parsedReimbursementResult')
                        console.log(item.ID)
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
                console.log(item.ID)
              }
            }            
            //gop
            item.gop = item.bankName === 'Y'?true:false

            //
            var newItem = {
              id: item.ID.trim(),
              createdBy:1,
              policyNumber:item.policyNumber?item.policyNumber.trim():null,
              policyType:policyType?policyType.trim():null,
              patientFirstName:patientFirstName?patientFirstName.trim():null,
              patientLastName:patientLastName?patientLastName.trim():null,
              cause:item.cuase?item.cuase.trim():null,
              createdAt:item.createdAt,
              reimbusementCurrency:parsedReimbursementResult?parsedReimbursementResult.trim():null,
              contactEmail:item.email?item.email.trim():null,
              contactPhoneNumber: item.contactPhoneNumber?item.contactPhoneNumber:null,
              contactHomeAddress:item.contactHomeAddress?item.contactHomeAddress.trim():null,
              bankAccountNumber: item.bankAccount?item.bankAccount.trim():null,
              accountHoldersName: item.accountHoldersName?item.accountHoldersName.trim():null,
              bankName: item.bankName?item.bankName.trim():null,
              bankAddress: item.bankAddress?item.bankAddress.trim():null,
              swift: item.swift?item.swift.trim():null,
              ibanCodeSortCode: item.ibanCodeSortCode?item.ibanCodeSortCode.trim():null,
              status: item.status?item.status.trim():null,
              decisioner: item.rejector?item.rejector.trim():null,
              decisionDate: item.decisionDate,
              decisionReason: item.decisionReason,
              gop:item.gop,
              RCExchangeRate:isNaN(item.RCExchangeRate)?null:item.RCExchangeRate,
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
  let results

    results = await getData()

   //

   res.json(results)

});


module.exports = router;
