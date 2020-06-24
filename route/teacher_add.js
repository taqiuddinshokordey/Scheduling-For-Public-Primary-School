var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Teacher = require('../models/teacher');
var Timetable = require('../models/timetable_annual');
var Timetable_relief = require('../models/timetable_relief');
var mid  = require('../middleware/requiresLogin.js');


//Declare current Year and date
const todaysDate = new Date()
const currentYear = todaysDate.getFullYear()
let weekday = ['Sunday',
               'Monday',
               'Tuesday',
               'Wednesday',
               'Thursday',
               'Friday',
               'Saturday'][new Date().getDay()];


//get add teacher module page
router.get('/register_teacher',mid, function(req,res){
  User.findById(req.session.userId).exec(function (error, user) {
    if (error) {
      return next(error);
    } else {
      console.log(user);
      Teacher.find({}).populate('teacher_id').exec(function(err, teacher) 
      {
        // do stuff with post
        if (err) throw err;
        console.log(teacher);
        res.render('admin_content/register_teacher',{'teacher':teacher, user:user});
      });
    }
  });
  
});

router.get('/daily_timetable',mid, function(req,res){
  User.findById(req.session.userId).exec(function (error, user) {
    if (error) {
      return next(error);
    } else {
      console.log(user);
      Timetable.find({teacher:req.session.userId, day:weekday}).populate('teacher').populate('subject').populate('classroom').exec(function(err, timetable) 
      {
        // do stuff with post
        if (err) throw err;
        console.log(timetable);
        res.render('teacher_content/daily_timetable',{timetable:timetable, user:user});
      });
    }
  });
  
});

router.get('/replacement_task',mid, function(req,res){
  User.findById(req.session.userId).exec(function (error, user) {
    if (error) {
      return next(error);
    } else {
      console.log(user);
      Timetable_relief.find({replacement:req.session.userId, day:weekday}).populate('replacement').exec(function(err, timetable) 
      {
        // do stuff with post
        if (err) throw err;
        console.log(timetable);
        res.render('teacher_content/replacement_task',{timetable:timetable, user:user});
      });
    }
  });
  
});

router.get('/timetable_by_class',mid, function(req,res){
  User.findById(req.session.userId).exec(function (error, user) {
    if (error) {
      return next(error);
    } else {
      console.log(user);
      Timetable.find({teacher:req.session.userId}).populate('teacher').populate('subject').populate('classroom').exec(function(err, timetable) 
      {
        // do stuff with post
        if (err) throw err;
        console.log(timetable);
        res.render('teacher_content/timetable_teacher',{timetable:timetable, user:user});
      });
    }
  });
  
});




module.exports = router;