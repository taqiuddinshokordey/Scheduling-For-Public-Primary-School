var express = require('express');
var router = express.Router();
var User = require('../models/user');
var CheckIn = require('../models/attendance');
var mid  = require('../middleware/requiresLogin.js');


  //get landing page
  router.get('/dashboard',mid, function(req,res){
    CheckIn.find({},function(err,users) {
      if (err) throw err;
      res.render('teacher_content/dashboard',{'users':users});
    });
  });

module.exports = router;