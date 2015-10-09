var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var favicon = require('serve-favicon');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var lusca = require('lusca');


var _ = require('lodash');
var MongoStore = require('connect-mongo')(session);
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');


var homeController = require('./controllers/home');
var linksController = require('./controllers/links');
var Links = require('./models/Links');


var secrets = require('./config/secrets');
var passportConf = require('./config/passport');


var app = express();


mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(favicon(path.join(__dirname, 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'Theg7',
  resave: true,
  saveUninitialized: true,
  // cookie: { secure: true },
  store: new MongoStore({
    url: 'mongodb://localhost:27017/kbook',
    autoReconnect: true
  })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca({
  csrf: true,
  xframe: 'SAMEORIGIN',
  xssProtection: true
}));


app.get('/', homeController.index);
app.get('/crawl', linksController.getCrawlData);

app.listen(3000,function(){
	console.log("Server is running at 3000");
});


