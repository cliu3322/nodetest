//https://blogs.msdn.microsoft.com/reactjsnodejsazure/2017/08/01/reactjs-nodejs-express-azure-web-app/   combine client with server
//https://medium.com/@chrisjr06/creating-mern-stack-app-and-hosting-in-microsoft-azure-using-create-react-app-w-continuous-4acef0c87e71 as above
//https://burkeknowswords.com/introducing-express-react-starter-b6d299206a3a
//https://github.com/PerimeterX/node-http2-server-push/blob/master/express/spdy.js
//HTTP2 tobedone
//https://flaviocopes.com/express-send-response/
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apis = require('./routes/apis');
var createError = require('http-errors');
var express = require('express');
var compression = require('compression')
const {getFileHttp1 } = require('./shared');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var schedule = require('node-schedule');


var cors = require('cors')
var {authenticate, authError} = require('./middleware');
var {countryList} = require('./currencyRate');
var app = express();
var fs = require('fs');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(compression())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())


app.use('/users', usersRouter);
app.use('/api', apis);

//app.use('/upload', upload);
app.use('/upload', express.static(path.join(__dirname, '../upload')))

//app.use(express.static(path.join(__dirname, 'public')));
//app.use('/', indexRouter)


app.use(express.static(path.join(__dirname, 'build')));



app.get('/*', function(req, res) {
  console.debug('* is triggered')
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});





//console.log('server env',process.env)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//countryList();
//https://crontab.guru/#0_0_*_*_*
var j = schedule.scheduleJob('0 0 * * *', function(){
  countryList()
});

if (!fs.existsSync('../upload')){
    fs.mkdirSync('../upload');
}

if (!fs.existsSync('../upload/paymentReport')){
  fs.mkdirSync('../upload/paymentReport');
}

if (!fs.existsSync('../upload/temp')){
    fs.mkdirSync('../upload/temp');
}

if (!fs.existsSync('../upload/claiminfo')){
    fs.mkdirSync('../upload/claiminfo');
}

if (!fs.existsSync('../upload/billinginfo')){
    fs.mkdirSync('../upload/billinginfo');
}

if (!fs.existsSync('../upload/documents')){
    fs.mkdirSync('../upload/documents');
}


if (!fs.existsSync('../upload/paymentSlipt')){
  fs.mkdirSync('../upload/paymentSlipt');
}


//require('./script.js');

module.exports = app;
