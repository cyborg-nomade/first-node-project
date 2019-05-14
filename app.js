var express = require('express');
var path = require('path');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var flash = require('connect-flash');

var routes = require('./routes/index');
var user = require('./routes/user');

var app = express();

//view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

//express session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));