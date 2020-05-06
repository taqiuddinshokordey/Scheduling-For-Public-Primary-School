var express = require('express');
var router = express.Router();
var User = require('../models/user');
var CheckIn = require('../models/attendance');
var mid  = require('../middleware/requiresLogin.js');


  //get landing page
  router.get('/attendance',mid, function(req,res){
    CheckIn.find({},function(err,users) {
      if (err) throw err;
      res.render('admin_content/attendance',{'users':users});
    });
  });

  router.get('/attendanceTcer',mid, function(req,res){
    CheckIn.find({},function(err,users) {
      if (err) throw err;
      res.render('teacher_content/dashboard',{'users':users});
    });
  });
  

  //Check In data
  router.post('/attendance', function (req, res, next) {
    User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          //console.log(user.name);
          var date = new Date();
          var userData = {
            userId:req.session.userId,
            name: user.name,
            dateEntry: date.toLocaleDateString(),
            entry: date.toTimeString().replace("GMT+0800 (Malaysia Time)", " "),
            exit: {time: "-", reason:"-"}
          }
  
          //use schema.create to insert data into the db
          CheckIn.create(userData, function (err, user) {
            if (err) {
              return next(err)
            } else 
            {        
              //console.log('You\'ve Checked In ');
              return res.redirect('back');
            }
          });
              ;
            }
          });
  });

  //Check out
  router.get('/attendanceCheckOut',function(req,res){
    CheckIn.findOne({userId:req.session.userId,dateEntry:date.toLocaleDateString()},function(err,users){
        res.render('admin_content/attendance',{'users':users});
    });
  });
  
  router.post('/attendanceCheckOut',function(req,res){
    // update Data
    var date = new Date();
    var updateData={     
      exit: {time: date.toTimeString().replace("GMT+0800 (Malaysia Time)", " "), reason:"-"}
    };
    var message='Data has been not updated';
    CheckIn.updateOne({userId:req.session.userId,dateEntry:date.toLocaleDateString()},updateData,function(err,numrows){
        if(!err){
          console.log('User Updated');
            res.redirect('back');
        }
    });
  });
  
  
module.exports = router;