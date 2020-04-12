var express = require('express');
var router = express.Router();
var User = require('../models/user');

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

module.exports = router;
