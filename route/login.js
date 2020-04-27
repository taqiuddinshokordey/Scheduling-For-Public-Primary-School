var express = require('express');
var router = express.Router();
var User = require('../models/user');
var mid  = require('../middleware/requiresLogin.js');

//Login Logic start



router.post('/login',  function (req, res, next) {
  if (req.body.username && req.body.password)
  {
    User.authenticate(req.body.username, req.body.password, function (error, user)
    {
      if (error || !user)
      {
        var err = new Error('Wrong username or password.');
        err.status = 401;
        return res.redirect('/login');
      }
      else
      {
        req.session.userId = user._id;
        if(user.roles=='admin')
        {
          return res.redirect(`/admin`);
        }else if(user.roles=='teacher')
        {
          console.log('teacher login');
          return res.redirect('/teacher');
        }else
        {
          console.log('Time Table Creator login');
          return res.redirect('/creator');
        }
        
      }
    });
  }else
  {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
});

router.get('/login',function(req,res){
  res.render('login', { });
});



//Login Logic ends

//Get page after login
router.get('/admin', function(req, res) {
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
          return res.render('admin_dashboard',{});
          ;
        }
      });
    
}); 






router.get('/teacher', mid, function(req, res) {
  
  res.render('teacher_dashboard', { })
});

router.get('/creator', mid, function(req, res) {
  res.render('timetable_creator', { })
});

// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    console.log('user logout');
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});



module.exports = router;


  
  
