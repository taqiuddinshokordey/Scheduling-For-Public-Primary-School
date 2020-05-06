var express = require('express');
var router = express.Router();
var User = require('../models/user');
var mid  = require('../middleware/requiresLogin.js');

router.get('/settings',mid, function(req, res) {
    if (! req.session.userId ) {
      var err = new Error("You are not authorized to view this page.");
      err.status = 403;
      return next(err);
    }
    User.findById(req.session.userId)
        .exec(function (error, user) {
          if (error) {
            return next(error);
          } else {
            console.log(user);
            return res.render('settings',{user:user});
            ;
          }
        }); 
  }); 

module.exports = router;