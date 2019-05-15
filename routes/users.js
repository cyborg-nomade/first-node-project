var express = require('express')
var router = express.Router();

//login page - GET
router.get('/login', (req, res) => {
  res.send('LOGIN');
});

//register page -GET
router.get('/register', (req, res) => {
  res.send('REGISTER');
});

module.exports = router;