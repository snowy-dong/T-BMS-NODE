var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var proxy = require('http-proxy-middleware');
var url = require("url");

var index = require('./routes/index');
var auth = require('./routes/auth');
var users = require('./routes/users');
var permiss = require('./routes/permiss');
var role = require('./routes/role');
var upload = require('./routes/upload')
var download = require('./routes/download')
var tokenManager = require('./public/javascripts/token_manager')
var cpUpload= require('./public/javascripts/multerUtil')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use('^/api', proxy({ target: 'http://localhost:3000', changeOrigin: true, pathRewrite: {"^/api": ""} }));
// 拦截器
app.all('/*', function (req, res, next) {
  // console.log(req.url);
  // console.log(req.headers);
if (req.url == '/login') {
    next();
} else {
  var query = url.parse(req.url, true).query;
  if(query && query.Authorization){
    req.headers.authorization = query.Authorization
  }
  req.headers &&  tokenManager.verifyToken(req, res, next)
}
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/login',auth)
app.use('/users', users);
app.use('/permiss', permiss);
app.use('/role', role);
app.use('/upload',cpUpload, upload)
app.use('/download',download)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  // err.status = 404;
  err.status = 200;
  err.code=code || "S404"
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 200);
  res.send({
    code: err.code || 'S409',
    data: err.message || '程序异常'
  });
});

module.exports = app;
