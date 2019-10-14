var express = require('express');
var router = express.Router();
var models  = require('../models');
//here we have three choise: express-fileupload, formidable(more popular) and multer(older)
//https://malcoded.com/posts/react-file-upload/
//const fileUpload = require('express-fileupload')
//https://flaviocopes.com/express-forms-files/
const formidable = require('formidable')
const util = require('util');
//https://stackoverflow.com/questions/30128701/parse-form-value-with-formidable-to-filename
var fs = require('fs');
var path = require('path');
var d3 = require('d3-array');
const sequelize = require('sequelize');
//router.use(fileUpload());
//middleware to hanlde errors
const awaitErorrHandlerFactory = middleware => {

  return async (req, res, next) => {
    try {
      await middleware(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a test');
});



router.post('/upload', awaitErorrHandlerFactory(async (req, res, next) => {
  var form = new formidable.IncomingForm();
  form.uploadDir = "../upload/temp";
  form.keepExtensions = true;
  form.parse(req);
  form.on('error', err =>  {
      res.sendStatus(500)
  });

  form.on('file', (name, file) =>  {

  });

  form.on('file', (name, file) =>  {
    res.send({name:file.name, path:file.path });
  });


}));

router.get('/getClaimById', awaitErorrHandlerFactory(async (req, res, next) => {
  var response = {};

  try {
    var ClaimInfo = await models.ClaimInfo.findOne(
      {
        where:{id:req.query.claimID},
        attributes: ['id', 'policyFirstName','policyLastName','policyNumber','policyVip','policyType','policyEmail','policyGroupPolicy',
        'contactFirstName','contactLastName','contactEmail','contactHomeAddress','contactPhoneNumber','contactPhoneNumberCountryCode','relationshipToPatient',
        'accountHoldersName','bankName','bankAddress','reimbusementCurrency','bankAccountNumber','ibanCodeSortCode','swift',
        'gop','cause'],
        include: [{
          model:models.ClaimInfoVisits,
          //attributes: ['id', 'billingUsdper','billingUsdper','billingUsdper','billingUsdper','billingUsdper','billingUsdper',],
          include: [{model: models.ClaimInfoVisitsFiles}, {model: models.BillingInfoFiles}, {model: models.BillingInfo}],
        }],
      }
    );
    // model: models.ClaimInfoVisitsFiles,
    //  model: models.BillingInfos,
    // // model: models.BillingInfoFiles,
    // // attributes: [ [sequelize.fn('sum', sequelize.col('value')), 'total']],
    res.json(ClaimInfo);
    // var visitsData = await models.ClaimInfoVisits.findAll({
    //   where:{claimInfoId:req.query.claimID},
    //   include:{
    //     model:models.ClaimInfoVisitsFiles
    //   },
    // });
    //
    // response = {claimData, visitsData}
  } catch(e) {
    console.log(e)
    res.sendStatus(500).send(e)
  }

}));

router.post('/insertOrUpdateClaimInfo', awaitErorrHandlerFactory(async (req, res, next) => {
  const response = {};

  var claimInfo =  req.body

  if (!req.body.id){


    try {

      //get claimId
      const policyCount = await models.ClaimInfo.count({policyNumber:claimInfo.policyNumber})
      claimInfo.id = claimInfo.policyNumber+"-"+(policyCount+1)
      //rename ClaimInfoVisitsFiles
      claimInfo.ClaimInfoVisits = claimInfo.ClaimInfoVisits.map(visit => {
        visit.ClaimInfoVisitsFiles =  visit.ClaimInfoVisitsFiles.map(ClaimInfoVisitsFile => {
          ClaimInfoVisitsFile.name =  claimInfo.id +'-' + visit.visitNumber + path.extname(ClaimInfoVisitsFile.name).toLowerCase();
          // fs.copyFile(ClaimInfoVisitsFile.url, ClaimInfoVisitsFile.url.replace('temp','claiminfo'), (err) => {
          //   if (err) throw err;
          //   console.log('source.txt was copied to destination.txt');
          // });
          return ClaimInfoVisitsFile
        })
        return visit
      })

      models.ClaimInfo.create(claimInfo,{
            include: [{
              model: models.ClaimInfoVisits,
              include: [{
                model: models.ClaimInfoVisitsFiles,
              }],
            }],
      }).then(claimInfo => {
        res.json(claimInfo);
      }).catch( e => {
        console.log(e)
        res.sendStatus(500).send(e)
      })
    } catch(e) {
      console.log(e)
      res.sendStatus(500).send(e)
    }
  }

}));

router.post('/updateReimbusementCurrency', awaitErorrHandlerFactory(async (req, res, next) => {
  const response = {};

  var claimInfo =  req.body
  //console.log(claimInfo)
  if (claimInfo.id){

    try {
      var filter = {
        where: {
          id: claimInfo.id
        },
        include: [{
          model: models.ClaimInfoVisits,
          include: [{
            model: models.ClaimInfoVisitsFiles,
          }],
        }]
      };
      //
      // models.sequelize.transaction(t => {

        // chain all your queries here. make sure you return them.

        models.ClaimInfo.findByPk(claimInfo.id).then(claimInfo => {
          models.ExchangeRate.findByPk(claimInfo.reimbusementCurrency).then(exchangeRate => {
            claimInfo.update({
              RCExchangeRate: exchangeRate.perUSD,
              RCExchangeRateDate:exchangeRate.updatedAt
            }).then(result => {
              console.log(result)
              res.send(result)
            })
          })
        })
      //
      // }).then(result => {
      //   console.log('result',result)
      // }).catch(err => {
      //   // Transaction has been rolled back
      //   // err is whatever rejected the promise chain returned to the transaction callback
      // });
      // models.ClaimInfo.findOne(filter).then(function (claimInfo) {
      //   if (claimInfo) {
      //     return claimInfo.ClaimInfoVisits.findAll(updateProfile).then(function (result) {
      //       return result;
      //     });
      //   } else {
      //     throw new Error("no such product type id exist to update");
      //   }
      // });
      //
      // models.ClaimInfo.findOne(claimInfo,{
      //       include: [{
      //         model: models.ClaimInfoVisits,
      //         include: [{
      //           model: models.ClaimInfoVisitsFiles,
      //         }],
      //       }],
      // }).then(claimInfo => {
      //   res.json(claimInfo);
      // }).catch( e => {
      //   console.log(e)
      //   res.sendStatus(500).send(e)
      // })
    } catch(e) {
      console.log(e)
      res.sendStatus(500).send(e)
    }
  } else {
    res.sendStatus(500).send('need a claimID!')
  }

}));

router.post('/uploadBillingInfo', awaitErorrHandlerFactory( (req, res, next) => {
//     value:req.body.value
  console.log(req.body)
  console.log('adsfadfsd')
  models.BillingInfo.findOne({
    where:{
      visitId:req.body.visitId,
      billingCat:req.body.billingCat,
      billingSubCat:req.body.billingSubCat
    }
  }).then(billing => {
    if (billing) {
      return billing.update({
        value:req.body.value
      })
    } else {
      return models.BillingInfo.create(req.body)
    }
  }).then(result => {
    res.send(result)
  }).catch (e => {
    console.log(e)
    res.sendStatus(500).send(e)
  })


}));

router.post('/updateBillingCurrency', awaitErorrHandlerFactory( (req, res, next) => {

  console.log(req.body)
  models.ClaimInfoVisits.findOne({
    where:{
      id:req.body.id,
    }
  }).then(visit => {
    if (visit) {
      return visit.update({
        billingCurrency:req.body.billingCurrency,
        currencyDate:req.body.currencyDate,
        billingUsdper:req.body.billingUsdper
      })
    } else {
      return null
    }
  }).then(result => {
    res.send(result)
  }).catch (e => {
    console.log(e)
    res.sendStatus(500).send(e)
  })


}));


router.post('/insertClaimInfoVisits', (req, res, next) => {
  //https://github.com/node-formidable/node-formidable/issues/260
  var form = new formidable.IncomingForm();
  form.uploadDir = "../upload/claiminfo";
  form.keepExtensions = true;
  form.multiples = true;
  form.parse(req);

  var files = []
  var filesData = []
  var visit = {}
  form.on('file', function (name, file){
    files.push(file)
  });
  //https://stackoverflow.com/questions/34264800/node-js-function-return-object-object-instead-of-a-string-value
  form.on('field', function(name, value) {

    switch (name) {
      case 'visitdata':
        visit[name]= value;
        break;
      case 'files':
        filesData.push(value)
        break;
      default:

    }
  });

  form.on('fileBegin', function(name, file) {

  });

  form.on('end',async function() {
    try {

      //insert visitdata
      var visitdata = JSON.parse(visit.visitdata)
      var visitRecord
      var visitFileList = []

      if (visitdata.id === null ||visitdata.id === undefined ) {
        visitRecord = await models.ClaimInfoVisits.create(visitdata)

      } else {
        visitRecord = await models.ClaimInfoVisits.findOne({where:{id:visitdata.id}}).then(ClaimInfoVisit => {
          delete visitdata['id'];
          return ClaimInfoVisit.update(visitdata)
        });

        models.ClaimInfoVisitsFiles.findAll({where:{visitId:visitdata.id}}).then(ClaimInfoVisitsFiles => {
          ClaimInfoVisitsFiles.destroy()
        });

        for (var i = 0; i < files.length; i++) {
          filesData[i].uid
          models.ClaimInfoVisitsFiles.findOne({ where: { uid: filesData[i].uid }, paranoid: false }).then(ClaimInfoVisitsFiles => {
            ClaimInfoVisitsFiles.restore()
          });
        }
      }

      //upload files

      for (var i = 0; i < files.length; i++) {

        var extension = path.extname(files[i].name).toLowerCase();
        var newFileName = visitdata.claimInfoId.replace(/\//g,'_')+'-'+visitdata.visitNumber+'-'+i+extension
        fs.rename(files[i].path, form.uploadDir+'/'+newFileName, function(err) {
            if (err) next(err);
        });

        const fileRecord = await models.ClaimInfoVisitsFiles.create({name:newFileName, url: "/upload/claiminfo/" + newFileName, visitId: visitRecord.dataValues.id, active:true}, {raw: true})

        visitFileList.push(fileRecord.dataValues)
      }
      visitRecord.dataValues.visitFileList =  visitFileList



      res.send(visitRecord);

    }
    catch(e) {
      console.log(e)
      res.sendStatus(500)
    }



    // fs.rename(files[0].path, form.uploadDir+'/'+visit.claimID, function(err) {
    //     if (err) next(err);
    // });
  });

})


router.post('/insertBillingInfoVisits', awaitErorrHandlerFactory(async (req, res, next) => {
  //https://github.com/node-formidable/node-formidable/issues/260
  var form = new formidable.IncomingForm();
  form.uploadDir = "../upload/billinginfo";
  form.keepExtensions = true;
  form.multiples = true;
  form.parse(req);

  var files = []
  var fields = {}
  form.on('file', function (name, file){
    files.push(file)
  });
  //https://stackoverflow.com/questions/34264800/node-js-function-return-object-object-instead-of-a-string-value
  form.on('field', function(name, value) {
    fields[name]= value;
  });

  form.on('fileBegin', function(name, file) {

  });

  form.on('end',async function() {
    try {


      //upload files
      for (var i = 0; i < files.length; i++) {
        var extension = path.extname(files[i].name).toLowerCase();
        var newFileName = fields.visitId.replace(/\//g,'_')+'-'+i+extension
        fs.rename(files[i].path, form.uploadDir+'/'+newFileName, function(err) {
            if (err) next(err);
        });

        const fileRecord = await models.BillingInfoFiles.create(
          {name:newFileName, url: "/upload/billinginfo/" + newFileName, visitId: fields.visitId}
        )

      }

      //upload currency info

      var visit = await models.ClaimInfoVisits.findByPk(fields.visitId).then((visit) => {

        return visit.update(JSON.parse(fields.currency));
      })


      res.send(visit)

    }
    catch(e) {
      console.log(e)
      res.sendStatus(500)
    }

  });

}));

router.post('/RCExchangeRate', awaitErorrHandlerFactory(async (req, res, next) => {
  //https://github.com/node-formidable/node-formidable/issues/260
  console.log('~~~~~~~~~~~~~~~~~~~')
  try {
    var claimInfoResult = await models.ClaimInfo.findByPk(req.body.claimID).then((claimInfo) => {
      return models.ExchangeRate.findByPk(claimInfo.reimbusementCurrency).then(exchangeRate => {
        return exchangeRate? claimInfo.update({RCExchangeRate:exchangeRate.USDper, RCExchangeRateDate:exchangeRate.date, status:'pending'}):null;
      })
    })

    res.send(claimInfoResult)
  }
  catch(e) {
    console.log(e)
    res.sendStatus(500)
  }

}));


router.post('/uploadBillingInfoOtherName', awaitErorrHandlerFactory(async (req, res, next) => {
  //https://github.com/node-formidable/node-formidable/issues/260
  try {

    res.send('insertBillingInfos');

  }
  catch(e) {
    console.log(e)
    res.sendStatus(500)
  }

}));

router.post('/getVisitsById', awaitErorrHandlerFactory(async (req, res, next) => {
  //https://github.com/node-formidable/node-formidable/issues/260


  const visits = await models.ClaimInfoVisits.findAll({
    where:{claimInfoId:req.body.claimID},
    include:{
      model:models.BillingInfo
    },
  })

  res.send(visits);

}));

router.get('/getBillingInfos', awaitErorrHandlerFactory(async (req, res, next) => {

  var response = {};
  console.log('get')
  console.log(req.body)
  console.log(req.query)
  console.log(req.params)
  console.log(req.data)
  res.json(response);
}));


router.post('/getBillingInfos', awaitErorrHandlerFactory(async (req, res, next) => {

  var response = {};
  console.log('post')
  console.log(req.body)
  console.log(req.query)
  console.log(req.params)
  console.log(req.data)
  res.json(response);
}));

router.post('/uploaddocument', awaitErorrHandlerFactory(async (req, res, next) => {
  var form = new formidable.IncomingForm();
  form.uploadDir = "../upload/documents";
  form.keepExtensions = true;
  form.multiples = true;
  form.parse(req);

  var files = []
  var data = {}
  form.on('file', function (name, file){
    files.push(file)
  });
  //https://stackoverflow.com/questions/34264800/node-js-function-return-object-object-instead-of-a-string-value
  form.on('field', function(name, value) {
    data[name]= value;
  });

  form.on('fileBegin', function(name, file) {

  });

  form.on('end',async function() {
    try {

      if(files.length > 1)
        throw new Error('file length is longer than 1');

      const fileRecord = await models.DocumentsFiles.create({fileName:files[0].name, path: files[0].path, visitId: data.visitId, active:true})
      res.send(fileRecord);
    } catch(e) {
      console.log(e)
      res.sendStatus(500)
    }

    // fs.rename(files[0].path, form.uploadDir+'/'+visit.claimID, function(err) {
    //     if (err) next(err);
    // });
  });

}));

router.post('/insertdocumentsnotes', awaitErorrHandlerFactory(async (req, res, next) => {
  const response = {};
  try {

    const result = await models.DocumentsFiles.findByPk(req.body.path).then((DocumentsFile) => {

      return DocumentsFile.update({notes:req.body.notes});
    })


  } catch(e) {
    console.log(e)
    response.error = e;
    res.sendStatus(500)
  }

  res.json(response);
}));




router.get('/allClaim', awaitErorrHandlerFactory(async (req, res, next) => {

  var response = {};
  // You can use DB checking here
  //doesUserEverExists
  try {


      var claims = await models.ClaimInfo.findAll({
        attributes: ['id', 'policyNumber', 'patientFirstName', 'patientLastName', 'policyVip', 'gop', 'createdAt'],
        include: [{
          model:models.ClaimInfoVisits,
          attributes: ['id', 'billingUsdper'],
          include: [{
            attributes: ['value'],
            model: models.BillingInfo,
            // attributes: [ [sequelize.fn('sum', sequelize.col('value')), 'total']],
          }],
        }],
        raw: false
      });


      response = claims
  } catch(e) {
    console.log(e)
    response.error = e;
  }
  res.json(response);
}));



router.get('/test', awaitErorrHandlerFactory(async (req, res, next) => {
  var response = {};
  try {
    var visitsData = await models.ClaimInfoVisits.findAll({
      where:{claimInfoId:'RIH/YYYY/XX/11111111-18'},
      include:{
        model:models.ClaimInfoVisitsFiles
      },
    });


    response = {visitsData}
  } catch(e) {
    console.log(e)
    response.error = e;
  }
  res.json(response);
}));



module.exports = router;
