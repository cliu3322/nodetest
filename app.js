//https://blogs.msdn.microsoft.com/reactjsnodejsazure/2017/08/01/reactjs-nodejs-express-azure-web-app/   combine client with server
//https://medium.com/@chrisjr06/creating-mern-stack-app-and-hosting-in-microsoft-azure-using-create-react-app-w-continuous-4acef0c87e71 as above
//https://burkeknowswords.com/introducing-express-react-starter-b6d299206a3a
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apis = require('./routes/apis');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var cors = require('cors')
var {authenticate, authError} = require('./middleware');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())


app.use('/users', usersRouter);
app.use('/api', apis);



//app.use(express.static(path.join(__dirname, 'public')));
//app.use('/', indexRouter)


app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function(req, res) {
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

module.exports = app;
