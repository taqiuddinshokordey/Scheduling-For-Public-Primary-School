var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Teacher = require('../models/teacher');
var mid  = require('../middleware/requiresLogin.js');
var flash = require('connect-flash');

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
            Teacher.find({teacher_id:req.session.userId}).exec(function(err, teacher)
            {
              console.log(user); 
              console.log(teacher);
              
              return res.render('settings',{teacher:teacher, user:user}, { message: req.flash('info')});
              
            });
            
          }
        }); 
  }); 

module.exports = router;