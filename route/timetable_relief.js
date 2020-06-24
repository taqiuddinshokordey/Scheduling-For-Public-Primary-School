var express = require('express');
var router = express.Router();
var Timetable = require('../models/timetable_annual');
var Timetable_relief = require('../models/timetable_relief');
var Teacher = require('../models/user');
var Replacement= require('../models/teacher');
var mid  = require('../middleware/requiresLogin.js');
const mongoose = require("mongoose");


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


//Timetable Homepage
router.get('/timetable_relief',function(req,res){
  Teacher.findById(req.session.userId).exec(function (error, user){
    if (error){
      return next(error);
    }else
    {
      Teacher.find({flag:0, roles:"Teacher"}).exec(function (error, teacher){
        console.log(user);
        console.log(weekday);
        res.render('creator_content/relief', { teacher:teacher, user:user});
      });
     
    }
  });
});


router.get('/today_absentee/:id',function(req,res){
  Teacher.findById(req.session.userId).exec(function (error, user){ 
    if (error){
      return next(error);
    }else
    {
      Teacher.find({_id:req.params.id}).exec(function(err, teacher){
        if(err){
          return (err);
        }else
        {
          Timetable.find({teacher:req.params.id,day:weekday }).populate('classroom').populate('subject').populate('teacher').exec(function(err, timetable){
            if(err)
            {
              return next(err);
            }else
            {
                  console.log(timetable);
                  res.render('creator_content/replacement_detail', { timetable:timetable, teacher:teacher, user:user});
             
            }
          });
        }
      });  
    }
  });
}); 

router.get('/replace_class/:id',function(req,res){
  Teacher.findById(req.session.userId).exec(function (error, user){
    if (error){
      return next(error);
    }else
    {
      Timetable.find({_id:req.params.id }).populate('classroom').populate('subject').populate('teacher').exec(function(err, timetable){
        if(err)
        {
          return (err);
        }else
        {
              Replacement.aggregate([
                {
                  $lookup: {
                      from: "user",
                      localField: "teacher_id",
                      foreignField: "_id",
                      as: "join"
                  }
              }
            ]).exec(function(err,replacement)
              {
                console.log(timetable);
                console.log(replacement);
                res.render('creator_content/replacement_class', {replacement:replacement, timetable:timetable, user:user});
              });
        }
      });
    }
  });
});


router.post('/find_teacher', function (req, res, next) {
  if (
    req.body.teacher &&
    req.body.timeslot,
    req.body.subject,
    req.body.classroom,
    req.body.session,
    req.body.day) {

    var timetableData = {
      teacher: req.body.teacher,
      timeslot: req.body.timeslot,
      subject: req.body.subject,
      classroom:  req.body.classroom,
      day: req.body.day,
      session: req.body.session
    }

    //use schema.create to insert data into the db
    Timetable_relief.create(timetableData, function (err, user) {
      if (err) 
      {
        return next(err)
      } 
      else 
      {
        console.log(user);
        return res.redirect('/find_teacher');
      }
    });
    

    

  } else {

    var err = new Error('All fields have to be filled out');
    err.status = 400;
    return next(err);
    
  }

});





router.get('/find_teacher',function(req,res){
  Teacher.findById(req.session.userId).exec(function (error, user){
    if (error){
      return next(error);
    }else
    {
      Replacement.find({}).exec(function(err,replacement){

        console.log(replacement);
        res.render('creator_content/get_teacher', { user:user});
      });
     
    }
  });
});



module.exports = router;


/*
router.get('/today_absentee/:id', function(req, res) {
  Teacher.findById(req.session.userId).exec(function(error, user) {
    if (error) {
      return next(error);
    } else {
      
          Timetable.aggregate([
             
            { 
              $match : { 
                  "teacher" : req.params.id
              }
          }, 
            {
                $lookup: {
                    from: 'classroom',
                    localField: 'classroom',
                    foreignField: '_id',
                    as: "join_classroom"
                }
            }, 
            
            {
                $lookup: {
                    from: "Subject",
                    localField: "subject",
                    foreignField: "_id",
                    as: "join_subject"
                }
            }
        ]).then(function(timetable) {
          console.log("Successful query!");
          console.log(req.params.id);
          console.log(timetable);
          console.log(teacher);
          res.render('creator_content/replacement_detail', { timetable:timetable, user:user});
        }, function(err) {
          console.trace(err.message);
        });
       

    }
  });
}); */