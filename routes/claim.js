var express = require('express');
var router = express.Router();
var models  = require('../models');
//here we have three choise: express-fileupload, formidable(more popular) and multer(older)
//https://malcoded.com/posts/react-file-upload/
//const fileUpload = require('express-fileupload')
//https://flaviocopes.com/express-forms-files/
const formidable = require('formidable')

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

router.post('/test', (req, res, next) => {
  //https://github.com/node-formidable/node-formidable/issues/260
  var form = new formidable.IncomingForm();
  form.parse(req);
  form.uploadDir = "./upload";
  form.on('file', function (name, file){
    console.log('Uploaded ' + file.name);
  });
  form.on('field', function(name, value) {
    console.log(name)
  });
})


router.post('/insertClaimInfo', awaitErorrHandlerFactory(async (req, res, next) => {
  const response = {};
  try {
    console.log('files',req.files)
    console.log('File',req.File)
    console.log('file',req.file)
    console.log('data',req.data)
    console.log('body',req.body)
    console.log('visitsdata',req.visitsdata)
    // //insert main table
    // const input = await models.ClaimInfo.create(req.body.data);
    // response.claimID = input.dataValues.id;
    //
    //
    // var claimInfoId = input.dataValues.id
    //
    // //instert visits
    // req.body.visitsdata.forEach(async function(visit) {
    //   const { id, hospitalOrClinicName, hospitalOrClinicCountryrl, hospitalOrclinicEmail,
    //   MedicalDiagnosis, dateOfAdmissionVisit, hospitalOrClinicCountry, doctorName} = visit;
    //   console.log(hospitalOrClinicName)
    //   const visitRecord = await models.ClaimInfoVisits.create({hospitalOrClinicName, hospitalOrClinicCountryrl, hospitalOrclinicEmail,
    //   MedicalDiagnosis, dateOfAdmissionVisit, hospitalOrClinicCountry, doctorName, claimInfoId})
    // });
    //
    // //insert files
    // console.log('body',req.files)
    // req.body.formData.forEach(async function(file) {
    //   console.log('file',)
    //   file.mv(`./a`, function(err) {
    //     if (err) {
    //       console.log(err)
    //     }
    //   })
    // })

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
