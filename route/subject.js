var express = require('express');
var router = express.Router();
var Subject = require('../models/subject');
var mid  = require('../middleware/requiresLogin.js');

//view subject list

router.get('/subject',mid, function(req,res){
    Subject.find({},function(err,subject){
      if (err) throw err;
      res.render('admin_content/subject',{'subject':subject});
    });
});

router.get('/subject_add',mid, function(req, res) {
  res.render('admin_content/subject_add', { });
});


//Add New Subject

router.post('/subject_add', function (req, res, next) {
    if (
      req.body.subject_name &&
      req.body.subject_darjah
      
        
      ) {
  
      var userData = {
        subject_name: req.body.subject_name,
        subject_darjah: req.body.subject_darjah
        
      
      }
  
      //use schema.create to insert data into the db
      Subject.create(userData, function (err, user) {
        if (err) {
          return next(err)
        } else {
          console.log('Add New Subject');
          return res.redirect('/subject');
        }
      });
  
    } else {
      var err = new Error('All fields have to be filled out');
      err.status = 400;
      return next(err);
    }
  
  });


module.exports = router;