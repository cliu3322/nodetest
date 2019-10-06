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



router.post('/insertClaimInfo', awaitErorrHandlerFactory(async (req, res, next) => {
  const response = {};
  try {

    const policyCount = await models.ClaimInfo.count({policyNumber:req.body.policyNumber})

    req.body.id = req.body.policyNumber+"-"+(policyCount+1)
    //insert main table
    const input = await models.ClaimInfo.create(req.body);

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
  var visit = {}
  form.on('file', function (name, file){
    files.push(file)
  });
  //https://stackoverflow.com/questions/34264800/node-js-function-return-object-object-instead-of-a-string-value
  form.on('field', function(name, value) {
    visit[name]= value;
  });

  form.on('fileBegin', function(name, file) {

  });

  form.on('end',async function() {
    try {
      //insert visitdata
      var visitdata = JSON.parse(visit.visitdata)

      let visitRecord = await models.ClaimInfoVisits.create(visitdata)

      //upload files
      var visitFileList = []
      for (var i = 0; i < files.length; i++) {

        var extension = path.extname(files[i].name).toLowerCase();
        var newFileName = visitdata.claimInfoId.replace(/\//g,'_')+'-'+visitdata.visitNumber+'-'+i+extension
        fs.rename(files[i].path, form.uploadDir+'/'+newFileName, function(err) {
            if (err) next(err);
        });
          console.log({name:newFileName, url: form.uploadDir, visitId: visitRecord.dataValues.id, active:true})
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


router.post('/insertBillingInfo', awaitErorrHandlerFactory(async (req, res, next) => {
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
          {fileName:newFileName, fileAddress: form.uploadDir, visitId: fields.visitId}
        )

      }

      //upload currency info

      await models.ClaimInfoVisits.findByPk(fields.visitId).then((visit) => {

        return visit.update(JSON.parse(fields.currency));
      })

      //insert billingInfo
      var billingInfo = JSON.parse(fields.billingInfo)

      for (var i = 0; i < billingInfo.length; i++) {
        console.log(fields)
        billingInfo[i].visitId=fields.visitId
        await models.BillingInfo.create(billingInfo[i]);

      }

      res.sendStatus(200)

    }
    catch(e) {
      console.log(e)
      res.sendStatus(500)
    }

    // fs.rename(files[0].path, form.uploadDir+'/'+visit.claimID, function(err) {
    //     if (err) next(err);
    // });
  });

}));

router.post('/uploadBillingInfo', awaitErorrHandlerFactory(async (req, res, next) => {
  //https://github.com/node-formidable/node-formidable/issues/260
  console.log(req.body)
  res.send('respond with a resource');

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
    console.log('req.body.path', req.body.path)
    const result = await models.DocumentsFiles.findByPk(req.body.path).then((DocumentsFile) => {
      console.log(DocumentsFile)
      return DocumentsFile.update({notes:req.body.notes});
    })
    console.log(result.id)

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
   //var claims = await models.BillingInfo.findAll({ include: [ models.ClaimInfoVisits ] });

    // var claims = await models.BillingInfo.findAll({
    //   attributes: [ [sequelize.fn('sum', sequelize.col('value')), 'total']],
    //   include: [{
    //     model: models.ClaimInfoVisits,
    //     attributes:[],
    //     include: [{
    //       model: models.ClaimInfo
    //     }],
    //   }],
    //   group : ['ClaimInfoVisit->ClaimInfo.id'],
    //   raw: true
    // });



      // var claims = await models.ClaimInfo.findAll({
      //   attributes: ['id'],
      //   include: [{
      //     model:models.ClaimInfoVisits,
      //     attributes: [],
      //     include: [{
      //       model: models.BillingInfo,
      //       attributes: [ [sequelize.fn('sum', sequelize.col('value')), 'total']],
      //     }],
      //   }],
      //   group : ['claiminfo.id', 'ClaimInfoVisits->BillingInfos.id'],
      //   raw: true
      // });


      // var claims = await models.sequelize.query(`
      // SELECT [ClaimInfo].[id],[ClaimInfo].[createdBy],
      //        Sum([value])                         AS
      //        [ClaimInfoVisits.BillingInfos.total]
      // FROM   [claiminfos] AS [ClaimInfo]
      //        LEFT OUTER JOIN [claiminfovisits] AS [ClaimInfoVisits]
      //                     ON [ClaimInfo].[id] = [claiminfovisits].[claiminfoid]
      //        LEFT OUTER JOIN [billinginfos] AS [ClaimInfoVisits->BillingInfos]
      //                     ON [claiminfovisits].[id] =
      //                        [ClaimInfoVisits->BillingInfos].[visitid]
      // GROUP  BY [claiminfo].[id], [ClaimInfo].[createdBy
      // `, { type: sequelize.QueryTypes.SELECT})



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


      // var newClaims = claims.claims.map( claimInfo => {
      //   console.log(claimInfo)
      //   claimInfo.total = d3.sum(claimInfo.ClaimInfoVisits, vis => d3.sum(vis.BillingInfos, billing => billing.value))
      //   return claimInfo
      // });

      // var claims = await models.ClaimInfo.findAll({
      //   include: [{
      //     model:models.ClaimInfoVisits
      //   }]
      // });

       // var newArray= d3.group(claims, d => d.id)

       response = claims
  } catch(e) {
    console.log(e)
    response.error = e;
  }
  res.json(response);
}));


router.get('/claimByID', awaitErorrHandlerFactory(async (req, res, next) => {
 	 res.json('response');
	})
);



module.exports = router;
