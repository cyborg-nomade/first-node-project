var express = require('express')
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('passportapp', ['users']);
var bcrypt = require('bcryptjs');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

//login page - GET
router.get('/login', (req, res) => {
  res.render('login');
});

//register page -GET
router.get('/register', (req, res) => {
  res.render('register');
});

//register page -POST
router.post('/register', (req, res) => {
  //get form values
  var name = req.body.inputName;
  var email = req.body.inputEmail;
  var username = req.body.inputUsername;
  var password = req.body.inputPassword;
  var passwordConf = req.body.inputPasswordConf;

  //validation
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Please use a valid email address').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('passwordConf', 'Password Confirmation field is required').notEmpty();
  req.checkBody('passwordConf', 'Passwords do not match').equals(req.body.password);

  //check for errors
  var errors = req.validationErrors();

  if (errors) {
    console.log('Form has errors');
    res.render('register', {
      errors: errors,
      name: name,
      email: email,
      username: username,
      password: password,
      passwordConf: passwordConf
    });
  } else {
    console.log('Success');
  }
});

module.exports = router;