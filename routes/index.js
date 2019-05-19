var express = require('express')
var router = express.Router();

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('index');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/users/login');
}

module.exports = router;