var express = require('express');
var router = express.Router();
var Timetable = require('../models/timetable_annual');
var mid  = require('../middleware/requiresLogin.js');

//view Timetable
router.get('/timetable',mid, function(req, res) {
  res.render('admin_content/timetable', { });
});

router.get('/timetable_add',mid, function(req, res) {
  res.render('admin_content/timetable_add', { });
});


router.post('/timetable_add', function (req, res, next) {
  if (
    req.body.username &&
    req.body.password,
    req.body.name,
    req.body.roles ) {

    var timetableData = {
      username: req.body.username,
      password: req.body.password,
      name: req.body.name,
      roles: req.body.roles
    }

    //use schema.create to insert data into the db
    User.create(timetabeData, function (err, user) {
      if (err) {
        return next(err)
      } else 
      {
      if(user.roles=='teacher')
      {
        console.log('teacher Registered');
        return res.redirect('/admin_user');
      }
      console.log('User Registered');
      return res.redirect('/admin_user');
      }
    });

  } else {
    var err = new Error('All fields have to be filled out');
    err.status = 400;
    return next(err);
  }

});

module.exports = router;

