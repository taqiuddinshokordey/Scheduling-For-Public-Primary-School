var express = require('express');
var router = express.Router();
var User = require('../models/user');
var mid  = require('../middleware/requiresLogin.js');

router.get('/admin_user',mid, function(req,res){
    User.find({},function(err,users){
      if (err) throw err;
      res.render('admin_content/admin_user',{'users':users});
    });
  });

module.exports = router;