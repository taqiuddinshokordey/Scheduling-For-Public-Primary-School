var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/admin_user', function(req, res) {
    res.render('admin_content/admin_user', { });
});

router.get('/register', function(req, res) {
  res.render('admin_content/register_user', { });
});
 

router.post('/register', function (req, res, next) {
    if (
      req.body.username &&
      req.body.password,
      req.body.roles ) {
  
      var userData = {
        username: req.body.username,
        password: req.body.password,
        roles: req.body.roles
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

module.exports = router;
