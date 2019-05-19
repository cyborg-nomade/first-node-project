var express = require('express')
var router = express.Router();
var {
  check,
  validationResult
} = require('express-validator/check');
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
router.post('/register', [
  check('inputName').not().isEmpty().withMessage('Name field is required'),
  check('inputEmail').not().isEmpty().withMessage('Email field is required'),
  check('inputEmail').isEmail().withMessage('Please use a valid email address'),
  check('inputUsername').not().isEmpty().withMessage('Username field is required'),
  check('inputPassword').not().isEmpty().withMessage('Password field is required'),
  check('inputPasswordConf').not().isEmpty().withMessage('Password Confirmation field is required'),
  check('inputPasswordConf', 'Passwords do not match').custom((value, {
    req
  }) => (value === req.body.inputPassword))
], (req, res) => {
  try {
    validationResult(req).throw();

    //info from the form
    var newUser = {
      name: req.body.inputName,
      email: req.body.inputEmail,
      username: req.body.inputUsername,
      password: req.body.inputPassword
    };

    //encrypt password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        newUser.password = hash;

        //add to database
        db.users.insert(newUser, (err, doc) => {
          try {
            console.log('User added...');

            //succes message
            req.flash('succes', 'You are registered and can now log in');

            //redirect
            res.location('/');
            res.redirect('/');
          } catch (err) {
            res.send(err);
          }
        });
      });
    });
  } catch (error) {
    console.log('Form has errors');
    console.log(error.array());
    res.render('register', {
      error: error.array(),
      name: req.body.inputName,
      email: req.body.inputEmail,
      username: req.body.inputUsername,
      password: req.body.inputPassword,
      passwordConf: req.body.inputPasswordConf
    });
  }
});

//serialize + deserialize user
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  db.users.findOne({
    _id: mongojs.ObjectId(id)
  }, (err, user) => {
    done(err, user);
  });
});

//local strategy
passport.use(new localStrategy((inputUsername, inputPassword, done) => {
  db.users.findOne({
    username: inputUsername
  }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, {
        message: 'Incorrect username'
      });
    }

    bcrypt.compare(inputPassword, user.password, (err, isMatch) => {
      if (err) {
        return done(err);
      }
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, {
          message: 'Incorrect password'
        });
      }
    });
  });
}));

//login - POST
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: 'Invalid Username Or Password'
  }), (req, res) => {
    console.log('Auth Successfull');
    res.redirect('/');
  });


module.exports = router;