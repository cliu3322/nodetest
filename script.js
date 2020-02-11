
var models  = require('./models');
var humanname  = require('humanname');

(async () => {
    console.log('hellllllo')
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
                console.log(item.id)
                console.log('policyNumber -', item.policyNumber)
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
                console.log(item.id, 'no reimbursement~~~~~~~~~~')
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
        console.log(created)
    })
    .catch (e => {
    console.log('catched')
    console.log(e)
    throw e
    })

})()