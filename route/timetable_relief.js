var express = require('express');
var router = express.Router();
var Timetable = require('../models/timetable_annual');
var Subject = require('../models/subject');
var Classroom = require('../models/classroom');
var Teacher = require('../models/user');
var mid  = require('../middleware/requiresLogin.js');

//Declare current Year and date
const todaysDate = new Date()
const currentYear = todaysDate.getFullYear()


//Timetable Homepage
router.get('/timetable_relief',function(req,res){
  Teacher.findById(req.session.userId).exec(function (error, user){
    if (error){
      return next(error);
    }else
    {
      Teacher.find({flag:0, roles:"Teacher"}).exec(function (error, teacher){
        console.log(user);
        res.render('creator_content/relief', { teacher:teacher, user:user});
      });
     
    }
  });
});

router.get('/replacement_add',function(req,res){
  Teacher.findById(req.session.userId).exec(function (error, user){
    if (error){
      return next(error);
    }else
    {
      console.log(user);
      res.render('creator_content/relief', { user:user});
    }
  });
});


/*
router.get('/today_absentee/view/:id',function(req,res){
  Teacher.findById(req.session.userId).exec(function (error, user){
    if (error){
      return next(error);
    }else
    {
      Teacher.find({_id:req.params.id }).exec(function(err, teacher){
        if(err)
        {
          return next(err);
        }else
        {
          Timetable.aggregate([
        
            {
              $lookup:{
                  from: "Classroom",       // other table name
                  localField: "classroom",   // name of users table field
                  foreignField: "_id", // name of userinfo table field
                  as: "classroom"         // alias for userinfo table
              }
    
              
              
            },
    
            {   $unwind:"$classroom" },     // $unwind used for getting data in object or for one record only
    
            {
              $lookup:{
                  from: "Subject",       // other table name
                  localField: "subject",   // name of users table field
                  foreignField: "_id", // name of userinfo table field
                  as: "subject"         // alias for userinfo table
              }  
            },
    
            {   $unwind:"$subject" },     // $unwind used for getting data in object or for one record only
    
            // define some conditions here 
            {
                $match:{
                $and:[{teacher:req.params.id}]
                 }
            },
    
            // define which fields are you want to fetch
             {   
                $project:{
    
                    subject_name : "$subject.subject_name",
                    classroom : "$classroom.classroom_name",
                } 
             }
          ]).exec(function(err, timetable) 
          {
            // The query output is such that `classroom.classroom_name`
            // value is unique for each document
            if (err) throw err;
            console.log(currentYear);
            console.log(timetable);
            res.render('creator_content/today_absentee_id',{timetable:timetable,  user:user, teacher:teacher});
          });
        }
      });
      
      
    }
  });
});

*/


router.get('/today_absentee/:id',function(req,res){
  Teacher.findById(req.session.userId).exec(function (error, user){
    if (error){
      return next(error);
    }else
    {
      Teacher.find({_id:req.params.id }).exec(function(err, teacher){
        if(err){
          return next(err);
        }else
        {
          Timetable.find({teacher:req.params.id }).populate('classroom').exec(function(err, timetable){
            if(err)
            {
              return next(err);
            }else
            {
              Timetable.find({teacher:req.params.id }).populate('subject').exec(function(err,subject){
                if (error){
                  return next(error);
                }else
                {
                  console.log(subject);
                  res.render('creator_content/today_absentee_id', { subject:subject, timetable:timetable, teacher:teacher, user:user});
                }
              });
            }
          });
        }
      });  
    }
  });
});

router.get('/add_replacement/:id',function(req,res){
  if(erro){
    return next(error);
  }else
  {
    Timetable.find({_id:req.params.id }).populate('teacher').exec(function(err, timetable){
      res.render('creator_content/add_replacement' );
    });
    
  }
});





module.exports = router;
