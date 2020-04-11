var express = require('express');
var router = express.Router();
var User = require('../models/user');
var login_permission  =   require('../middleware/login_permission.js');

//Login Logic start


router.post('/login', function (req, res, next) {
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

router.get('/admin', function(req, res) {
  res.render('admin_dashboard', { });
});


//Register Logic start

router.get('/register', function(req, res) {
    res.render('register', { });
});
 

router.post('/register', function (req, res, next) {
    if (
      req.body.username &&
      req.body.password,
      req.body.designation ) {
  
      var userData = {
        username: req.body.username,
        password: req.body.password,
        designation: req.body.designation
      }
  
      //use schema.create to insert data into the db
      User.create(userData, function (err, user) {
        if (err) {
          return next(err)
        } else {
          return res.redirect('/login');
        }
      });
  
    } else {
      var err = new Error('All fields have to be filled out');
      err.status = 400;
      return next(err);
    }
  
  });

//Register Logic End

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

  
  
