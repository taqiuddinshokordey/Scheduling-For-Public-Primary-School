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

  //get absentee page
  router.get('/absentee',mid, function(req,res){
    User.find({flag : 0},function(err,users) {
      if (err) throw err;
      res.render('admin_content/absentee',{'users':users});
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
              //return res.redirect('back');
              
            }
          });

          //Update flag
          var updateFlag={     
            flag:1
          }
          User.updateOne({_id:req.session.userId},updateFlag,function(err,numrows){
            if(!err){
              console.log('User Updated');
                res.redirect('back');
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
          var updateFlag={     
            flag:0
          }
          User.updateOne({_id:req.session.userId},updateFlag,function(err,numrows){
            if(!err){
              console.log('User Updated');
                //res.redirect('back');
            }
          });
            res.redirect('back');
        }
    });
  });

//Update absentee reason
//EDIT DATABASE 
router.get('/absentee/editReason/:id',function(req,res){
  User.findOne({_id:req.params.id},function(err,users){
      res.render('admin_content/edit_user',{'users':users});
  });
});

router.post('/admin_user/edit/:id',function(req,res){
  // update Data
  var updateData={
    username: req.body.username,
    name: req.body.name,
    roles: req.body.roles
  };
  var message='Data has been not updated';
  User.updateOne({_id:req.params.id},updateData,function(err,numrows){
      if(!err){
        console.log('User Updated');
          res.redirect('/admin_user');
      }
  });
});
  
  
module.exports = router;