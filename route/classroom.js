var express = require('express');
var router = express.Router();
var Classroom = require('../models/classroom');
var mid  = require('../middleware/requiresLogin.js');


//view classroom list

router.get('/classroom',mid, function(req,res){
    Classroom.find({},function(err,classroom){
      if (err) throw err;
      res.render('admin_content/classroom',{'classroom':classroom});
    });
});

router.get('/classroom_add',mid, function(req, res) {
  res.render('admin_content/classroom_add', { });
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
      Classroom.create(userData, function (err, user) {
        if (err) {
          return next(err)
        } else {
          console.log('Add New Classroom');
          return res.redirect('/classroom');
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
  Classroom.findOne({classroom_id:req.params.id},function(err,users){
      res.render('admin_content/edit_classroom',{'users':users});
  });
});

router.post('/admin_user/edit/:id', function(req,res){
  var updateData={

      title:req.body.title,
      description:req.body.description
  }
  Classroom.update({classroom_id:req.params.id},updateData,function(err,numrows){
    if(!err){
        res.redirect('/classroom'+req.params.id);
    }
});
})

//classroom delete

router.get('/classroom/delete/:id',function(req,res){
  Classroom.deleteOne({classroom_id:req.params.id},function(err){
    if(!err){
        res.redirect('/classroom');
    }
});
});


module.exports = router;

