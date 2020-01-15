var jsonwebtoken = require('jsonwebtoken');
var Config = require('./config');

const { secretKey } = Config;

const authenticate = (req, res, next) => {
	const token = req.headers.authorization || '';
	jsonwebtoken.verify(token, secretKey, (error, decoded) => {
		if (error) {
			console.log(error)
			res.send({ error: 'token varified failed' })
			next({ error: 'token varified failed' });
		} else {

			const { expiredAt } = decoded;
			if (expiredAt > new Date().getTime()) {
				next();
			} else {
				console.log('token expired')
				next({ error: 'token expired' });
				res.send({ error: 'token expired' })
			}
		}
	});
};

const authError = (err, req, res, next) => {
	console.log(err)
	res.json(err);
};
module.exports = { authenticate, authError };
