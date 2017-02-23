var express = require('express');
var router = express.Router();

// Define the home page route
router.get('/', function(req, res) {
  res.render('login-view');
});


module.exports = router;
