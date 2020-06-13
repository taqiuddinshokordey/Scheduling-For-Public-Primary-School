var express = require('express');
var router = express.Router();
var Subject = require('../models/subject');
var User = require('../models/user');
var mid  = require('../middleware/requiresLogin.js');

//view subject list

router.get('/subject',mid, function(req,res){
  User.findById(req.session.userId).exec(function (error, user){
    Subject.find({},function(err,subject){
      if (err) throw err;
      res.render('admin_content/subject',{'subject':subject, user:user});
    });
  });
});

router.get('/subject_add',mid, function(req, res) {
  User.findById(req.session.userId).exec(function (error, user){
    res.render('admin_content/subject_add', {user:user });
  });
  
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

//subject edit

router.get('/subject/edit/:id', function(req,res){
  User.findById(req.session.userId).exec(function (error, user)
  {
    Subject.findOne({_id:req.params.id},function(err,subject){
      res.render('admin_content/edit_subject',{'subject':subject, user:user});
  });
  });
  
});

router.post('/subject/edit/:id',function(req,res){
  var updateData={

    subject_name: req.body.subject_name,
    subject_darjah: req.body.subject_darjah
  }
  Subject.updateOne({_id:req.params.id},updateData,function(err,numrows){
    if(!err){
        res.redirect('/subject');
    }
});
})

//classroom delete

router.get('/subject/delete/:id',function(req,res){
  User.findById(req.session.userId).exec(function (error, user){
    Subject.deleteOne({_id:req.params.id},function(err){
      if(!err){
          res.redirect('/subject');
      }
  });
  });
  
});


module.exports = router;