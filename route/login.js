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
        return res.redirect('/admin');
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

router.get('/admin', mid, function(req, res) {
  res.render('admin_dashboard', { })
});



// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
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


  
  
