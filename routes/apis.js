//https://arjunphp.com/restful-api-using-async-await-node-express-sequelize/
var jsonwebtoken = require ('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Config = require ('../config');
//var models  = require('../models');
var express = require('express');
var router  = express.Router();
var models  = require('../models');


var report = require('./report')
var test = require('./test')
var claim = require('./claim');
var evaluate = require('./evaluate');
var emailRouter = require('./email');
var constant = require('./constant');
var convertor = require('./convertor');
var comments = require('./comments');
var ravendb = require('./ravendb');
var files = require('./files');
var payment = require('./payment')
var users = require('./users')

//var benefitCategories = require('./benefitCategories')


var {authenticate, authError} = require('../middleware');

const { secretKey, expiredAfter } = Config;

router.use('/secret', [authenticate, authError]);
router.get('/secret/test', (req, res) => {
  const {body,data} = req

	res.json({
		status: 200,
		message: 'succcesful',
    env: process.env
	});
});

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

router.post('/checkServerVariable', awaitErorrHandlerFactory(async (req, res, next) => {
	const response = {};
	// You can use DB checking here
  response.variable = process.env;
	res.json(response);
}));

router.post('/login', awaitErorrHandlerFactory(async (req, res, next) => {
  console.log('ip', req.ip)
	const { username, password } = req.body;
	const response = {};
	// You can use DB checking here
  try {
   
	  const user = await models.User.findOne({ where: {userName: username} });

  	if (user === null) {
  		response.error = 'Not found';
  	} else if (!bcrypt.compareSync(password, user.dataValues.password)) {
      response.error = 'password and username do not match';
    } else if (!user.dataValues.active) {
      response.error = 'The use has not been approved yet.';
    } else if (user !== null && user !== '' && bcrypt.compareSync(password, user.dataValues.password)) {
      await models.IP.create({ address: req.ip });
      response.token = jsonwebtoken.sign(
        {
          expiredAt: new Date().getTime() + expiredAfter,
          username,
          id: user.dataValues.id
        },
        secretKey
      );
    }
     else {
  		response.error = 'Some server error';
  	}
  } catch(e) {
    console.log(e)
    response.error = e;
  }
	res.json(response);
}));

router.post('/signup', awaitErorrHandlerFactory(async (req, res, next) => {
	const { username, password, email, firstname,lastname } = req.body;

	const response = {};
	// You can use DB checking here
	//doesUserEverExists
  try {
	  const user = await models.User.findOne({ where: {userName: username} });


    if(user !== null) {
    	response.error = 'User name not available! Please change another one.';
    } else {
      var hash = bcrypt.hashSync(password, 8);
        const userinput = await models.User.create({ userName: username, password: hash, email:email, firstName:firstname, lastName:lastname, active:false, role:1 });


        response.token = jsonwebtoken.sign(
        	{
        		expiredAt: new Date().getTime() + expiredAfter,
        		username: userinput.dataValues.userName,
        		id: userinput.dataValues.id,
        	},
        	secretKey
        );

     }
   } catch(e) {
     console.log(e)
     response.error = e;
   }
   res.json(response);
	})
);

router.use('/report',report)

router.use('/test',test)

router.use('/claim', claim);

router.use('/evaluate', [authenticate, authError], evaluate);

router.use('/constant', constant);

router.use('/email', emailRouter);

router.use('/convertor', [authenticate, authError], convertor)

router.use('/files', [authenticate, authError], files)

router.use('/ravendb', [authenticate, authError], ravendb)

router.use('/comments', [authenticate, authError], comments)

router.use('/payment', [authenticate, authError], payment);

router.use('/users', [authenticate, authError], users)


//router.use('/benefitCategories',benefitCategories)




module.exports = router;
