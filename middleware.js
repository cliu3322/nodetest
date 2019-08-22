var jsonwebtoken = require('jsonwebtoken');
var Config = require('./config');

const { secretKey } = Config;

const authenticate = (req, res, next) => {
	console.log('middleware')
	const token = req.headers.authorization || '';
	jsonwebtoken.verify(token, secretKey, (error, decoded) => {
		if (error) {
			next({ error: 'token varified failed' });
		} else {
			const { expiredAt } = decoded;
			if (expiredAt > new Date().getTime()) {
				next();
			} else {
				next({ error: 'token expired' });
			}
		}
	});
};

const authError = (err, req, res, next) => {
	res.json(err);
};
module.exports = { authenticate, authError };
