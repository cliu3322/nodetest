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



router.post('/insertOrUpdateClaimInfo', awaitErorrHandlerFactory(async (req, res, next) => {
  const response = {};
  try {
    var input
    if(req.body.claimID === null) {

      const policyCount = await models.ClaimInfo.count({policyNumber:req.body.claimData.policyNumber})

      req.body.claimData.id = req.body.claimData.policyNumber+"-"+(policyCount+1)
      //insert main table
      input= await models.ClaimInfo.create(req.body.claimData);
    } else {

      input = await models.ClaimInfo.findOne({where:{id:req.body.claimID}}).then(ClaimInfo => {

        return ClaimInfo.update(req.body.claimData)
      });
    }


    response.claimID = input.dataValues.id;

  } catch(e) {
    console.log(e)
    response.error = e;
    res.sendStatus(500)
  }

  res.json(response);
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

router.post('/uploadBillingInfo', awaitErorrHandlerFactory(async (req, res, next) => {
  //https://github.com/node-formidable/node-formidable/issues/260
  try {
    console.log(req.body.billinginfos)
    var deletedBillingInfos = await models.BillingInfo.findAll({
      include: [{
        model:models.ClaimInfoVisits,
        attributes: ['id'],
        include: [{
          attributes: ['id'],
          model: models.ClaimInfo,
          where: {id: req.body.claimID}
        }],
      }],
    }).then(BillingInfos => {
      console.log(BillingInfos)
    })

    var insertBillingInfos = await models.BillingInfo.bulkCreate(req.body.billinginfos)

    res.send(insertBillingInfos);
    // User.bulkCreate([
    //   { username: 'barfooz', isAdmin: true },
    //   { username: 'foo', isAdmin: true },
    //   { username: 'bar', isAdmin: false }
    // ]).then(() => { // Notice: There are no arguments here, as of right now you'll have to...
    //   return User.findAll();
    // }).then(users => {
    //   console.log(users) // ... in order to get the array of user objects
    // })

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
        include: [{
          model:models.ClaimInfoVisits,
          attributes: ['id'],
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


router.get('/getClaimById', awaitErorrHandlerFactory(async (req, res, next) => {
  var response = {};

  try {
    var claimData = await models.ClaimInfo.findOne({where:{id:req.query.claimID}});

    var visitsData = await models.ClaimInfoVisits.findAll({
      where:{claimInfoId:req.query.claimID},
      include:{
        model:models.ClaimInfoVisitsFiles
      },
    });

    response = {claimData, visitsData}
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
