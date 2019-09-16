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


router.post('/insertClaim', awaitErorrHandlerFactory(async (req, res, next) => {
  const { plan_name, member_policy_name, mode_of_treatment, date_of_hospitalisation_visit,
  cause_of_hospitalisation_visit, hospital_name_address, location, doctor_name,
  billing_currency, reimbursement_currency, email, phone, home_address, bank_account_number,
  account_holder_name, bank_name, bank_address, swift_address, iban_code } = req.body;

  const response = {};
  // You can use DB checking here
  //doesUserEverExists



  try {
    const policyCount = await models.ClaimBasic.count({})
    console.log('policyCount',policyCount)


    const input = await models.ClaimBasic.create({ plan_name, member_policy_name, mode_of_treatment, date_of_hospitalisation_visit,
    cause_of_hospitalisation_visit, hospital_name_address, location, doctor_name,
    billing_currency, reimbursement_currency, email, phone, home_address, bank_account_number,
    account_holder_name, bank_name, bank_address, swift_address, iban_code});

    response.claimID = input.dataValues.id;
  } catch(e) {
    console.log(e)
    response.error = e;
  }
  res.json(response);
}));

router.post('/insertClaimInfoVisits', (req, res, next) => {
  //https://github.com/node-formidable/node-formidable/issues/260
  var form = new formidable.IncomingForm();
  form.uploadDir = "../upload";
  form.keepExtensions = true;
  form.multiples = true;
  form.parse(req);

  var files = []
  var visit = {}
  form.on('file', function (name, file){
    //console.log(file.name)
    files.push(file)
  });
  //https://stackoverflow.com/questions/34264800/node-js-function-return-object-object-instead-of-a-string-value
  form.on('field', function(name, value) {
    console.log(value)
    visit[name]= value;
  });
  form.on('fileBegin', function(name, file) {

  });

  form.on('end',async function() {
    try {
      //insert visitdata
      var visitdata = JSON.parse(visit.visitdata)
      visitdata.claimInfoId= visit.claimID


      const visitRecord = await models.ClaimInfoVisits.create(visitdata)

      //upload files
      for (var i = 0; i < files.length; i++) {

        var extension = path.extname(files[i].name).toLowerCase();
        var newFileName = visit.claimID.replace(/\//g,'_')+'-'+visitdata.visitId+'-'+i+extension
        fs.rename(files[i].path, form.uploadDir+'/'+newFileName, function(err) {
            if (err) next(err);
        });

        const visitRecord = await models.ClaimInfoFiles.create({fileName:newFileName, fileAddress: form.uploadDir, claimInfoId: visit.claimID})
      }

    }
    catch(e) {
      console.log(e)
      response.error = e;
    }

    // fs.rename(files[0].path, form.uploadDir+'/'+visit.claimID, function(err) {
    //     if (err) next(err);
    // });
  });

})


router.post('/insertClaimInfo', awaitErorrHandlerFactory(async (req, res, next) => {
  const response = {};
  try {
    console.log('policyNumber', req.body.policyNumber)
    const policyCount = await models.ClaimInfo.count({policyNumber:req.body.policyNumber})
    console.log('policyCount',policyCount)
    req.body.id = req.body.policyNumber+"-"+(policyCount+1)
    //insert main table
    const input = await models.ClaimInfo.create(req.body);
    response.claimID = input.dataValues.id;

  } catch(e) {
    console.log(e)
    response.error = e;
  }
  res.json(response);
}));



router.get('/allClaim', awaitErorrHandlerFactory(async (req, res, next) => {

  const response = {};
  // You can use DB checking here
  //doesUserEverExists
  try {
    var claims = await models.ClaimBasic.findAll({attributes: ['id', 'plan_name']});

    response.claims = claims
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
