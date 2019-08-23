//https://arjunphp.com/restful-api-using-async-await-node-express-sequelize/
var jsonwebtoken = require ('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Config = require ('../config');
//var models  = require('../models');
var express = require('express');
var router  = express.Router();
var models  = require('../models');

const { secretKey, expiredAfter } = Config;


//middleware to hanlde errors
const awaitErorrHandlerFactory = middleware => {
  console.log('awaitErorrHandlerFactory')
  return async (req, res, next) => {
    try {
      await middleware(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

router.post('/checkServerVariable', awaitErorrHandlerFactory(async (req, res, next) => {
	const response = {};
	// You can use DB checking here
  response.variable = process.env;
	res.json(response);
}));

router.post('/login', awaitErorrHandlerFactory(async (req, res, next) => {
	const { username, password } = req.body;
	const response = {};
	// You can use DB checking here
	const user = await models.User.findOne({ where: {userName: username} });

  console.log('password', password)
  console.log('hash', user.dataValues.password)
  console.log(bcrypt.compareSync(password, user.dataValues.password))
	if (user !== null && user !== '' && bcrypt.compareSync(password, user.dataValues.password)) {
		response.token = jsonwebtoken.sign(
			{
				expiredAt: new Date().getTime() + expiredAfter,
				username,
				id: 1,
			},
			secretKey
		);
	} else {
		response.error = 'Not found';
	}
	res.json(response);
}));

router.post('/signup', awaitErorrHandlerFactory(async (req, res, next) => {
	const { username, password, email, firstname,lastname } = req.body;

	const response = {};
	// You can use DB checking here
	//doesUserEverExists

  const user = await models.User.findOne({ where: {userName: username} });
	if(user !== null) {
		response.error = 'User name not available! Please change another one.';
	} else {
    var hash = bcrypt.hashSync(password, 8);
    const userinput = await models.User.create({ userName: username, password: hash, email:email, firstName:firstname, lastName:lastname });
    response.token = jsonwebtoken.sign(
			{
				expiredAt: new Date().getTime() + expiredAfter,
				username: userinput.dataValues.id,
				id: 1,
			},
			secretKey
		);

	 }
 		res.json(response);
	})
);


router.post('/insertClaim', awaitErorrHandlerFactory(async (req, res, next) => {
	const { plan_name, member_policy_name, mode_of_treatment, date_of_hospitalisation_visit,
  cause_of_hospitalisation_visit, hospital_name_address, location, doctor_name,
  billing_currency, reimbursement_currency, email, phone, home_address, bank_account_number,
  account_holder_name, bank_name, bank_address, swift_address, iban_code } = req.body;

	const response = {};
	// You can use DB checking here
	//doesUserEverExists

	if(false) {
		response.error = 'Not found';
	} else {


    const input = await models.ClaimBasic.create({ plan_name, member_policy_name, mode_of_treatment, date_of_hospitalisation_visit,
    cause_of_hospitalisation_visit, hospital_name_address, location, doctor_name,
    billing_currency, reimbursement_currency, email, phone, home_address, bank_account_number,
    account_holder_name, bank_name, bank_address, swift_address, iban_code});
		response.claimID = input.dataValues.id;

	 }
 		res.json(response);
	})
);




router.get('/allClaim', awaitErorrHandlerFactory(async (req, res, next) => {

	const response = {};
	// You can use DB checking here
	//doesUserEverExists

	if(false) {
		response.error = 'Not found';
	} else {


    const claims = await models.ClaimBasic.findAll({attributes: ['id', 'plan_name']});
		response.claimID = claims
	 }

 	 res.json(response);
	})
);


router.get('/claimByID', awaitErorrHandlerFactory(async (req, res, next) => {
 	 res.json('response');
	})
);
module.exports = router;
