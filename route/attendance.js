var express = require('express');
var router = express.Router();
var User = require('../models/user');
var mid  = require('../middleware/requiresLogin.js');

//get landing page
router.get('/attendance',mid,function(req, res) {
    res.render('admin_content/attendance', { });
  });


  
module.exports = router;