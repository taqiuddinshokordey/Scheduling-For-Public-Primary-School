var express = require('express');
var router = express.Router();
var Classroom = require('../models/classroom');
var User= require('../models/user');
var mid  = require('../middleware/requiresLogin.js');


//view classroom list

router.get('/classroom',mid, function(req,res){
  User.findById(req.session.userId).exec(function (error, user){
    Classroom.find({},function(err,classroom){
      if (err) throw err;
      res.render('admin_content/classroom',{'classroom':classroom, user:user});
    });
  });
});

router.get('/classroom_add',mid, function(req, res) {
  User.findById(req.session.userId).exec(function (error, user){
    res.render('admin_content/classroom_add', { user:user});
  });
  
});

//Add New Classroom

router.post('/classroom_add', function (req, res, next) {
    if (
      req.body.classroom_name &&
      req.body.classroom_blok,
      req.body.classroom_floor
        
      ) {
  
      var userData = {
        classroom_name: req.body.classroom_name,
        classroom_blok: req.body.classroom_blok,
        classroom_floor: req.body.classroom_floor
      
      }
  
      //use schema.create to insert data into the db
      Classroom.findOne(userData, function(err, example){
        if(err) console.log(err);
        if(example){
          console.log("This has already been saved v2",userData);
          
          return res.redirect('/classroom');
        }else
        {
          Classroom.create(userData, function (err, user) {
            if (err) {
              console.log("This has already been saved v1",userData);
              return res.redirect('/classroom');
            } else {
              console.log('Add New Classroom');
              return res.redirect('/classroom');
            }
          });
        }
      });
    } else {
      var err = new Error('All fields have to be filled out');
      err.status = 400;
      return next(err);
    }
  
  });

//classroom edit

router.get('/classroom/edit/:id',mid, function(req,res){
  User.findById(req.session.userId).exec(function (error, user){
    Classroom.findOne({_id:req.params.id},function(err,classroom){
      res.render('admin_content/edit_classroom',{'classroom':classroom, user:user});
  });
  });
});

router.post('/classroom/edit/:id', function(req,res){
  var updateData={

    classroom_name: req.body.classroom_name,
    classroom_blok: req.body.classroom_blok,
    classroom_floor: req.body.classroom_floor
  }
  Classroom.updateOne({_id:req.params.id},updateData,function(err,numrows){
    if(!err){
        res.redirect('/classroom');
    }
});
})

//classroom delete

router.get('/classroom/delete/:id',function(req,res){
  User.findById(req.session.userId).exec(function (error, user){
    Classroom.deleteOne({_id:req.params.id},function(err){
      if(!err){
          res.redirect('/classroom');
      }
  });
  });
  
});


module.exports = router;

