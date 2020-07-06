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
      Teacher.find({flag:0, roles: {$nin:[ "Admin" ]}}).exec(function (error, teacher){
        Timetable_relief.find({day:weekday}).populate('replacement').populate('classroom').exec(function (error, replacement){
          console.log(replacement);
          console.log(weekday);
          res.render('creator_content/relief', { replacement:replacement, teacher:teacher, user:user});
        });
       
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
          Timetable.find({teacher:req.params.id,day:weekday }).populate('classroom').populate('teacher').exec(function(err, timetable){
            if(err)
            {
              return (err);
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
      Timetable.find({_id:req.params.id }).populate('classroom').populate('teacher').exec(function(err, timetable){
        if(err)
        {
          return (err);
        }else
        {
                Teacher.find({flag:1, roles: {$nin:[ "Admin" ]}}).exec(function (error, teacher)
                {
                  console.log(timetable);
                  console.log(teacher);
                  res.render('creator_content/get_teacher', { timetable:timetable, user:user, teacher:teacher});
                })
              
        }
      });
    }
  });
}); 


router.post('/find_teacher', function (req, res, next){
  if(req.body.teacher && req.body.timeslot,req.body.subject,req.body.classroom,req.body.session,req.body.day,req.body.replacement) 
    {
      var clashing1 ={
        teacher: req.body.replacement,
        timeslot: req.body.timeslot,
        classroom:  req.body.classroom,
        day: req.body.day,
      }

      Timetable.find(clashing1, function (err, clash1){
        if (clash1.length){
          req.flash('error', 'Teacher not available on this timeslot Please Select others available teacher');
          console.log("Clash in Normal Timetable");
          return res.redirect('/timetable_relief');

        }else
        {
          var clashing2={

            replacement: req.body.replacement,
            timeslot: req.body.timeslot,
            classroom:  req.body.classroom,
            day: req.body.day,
            

          }

          Timetable_relief.find(clashing2, function (err, clash2){
            if (clash2.length){
              req.flash('error', 'Teacher not available on this timeslot Please Select others available teacher');
              console.log("Clash in 2 Normal Timetable");
              return res.redirect('/timetable_relief');
            }else
            {

              var clashing3={
                timeslot: req.body.timeslot,
                classroom:  req.body.classroom,
                day: req.body.day,
              }

              Timetable_relief.find(clashing3, function (err, clash3){
                if(clash3.length){
                  req.flash('error', 'Teacher not available on this timeslot Please Select others available teacher');
                  console.log("Clash in 3 Normal Timetable");
                  return res.redirect('/timetable_relief');
                }else
                {
                  var clashing4 = {
                    timeslot: req.body.timeslot,
                    replacement: req.body.replacement,
                    day: req.body.day,
                  }
                  
                  Timetable_relief.find(clashing4, function (err, clash4){
                    if(clash4.length){
                      req.flash('error', 'Teacher not available on this timeslot Please Select others available teacher');
                      console.log("Clash in 4 Normal Timetable");
                      return res.redirect('/timetable_relief');
                    }else
                    {
                      
                          var clashing6 = {
                            timeslot: req.body.timeslot,
                            teacher: req.body.replacement,
                            day: req.body.day,
                          }

                          Timetable.find(clashing6, function (err, clash6){
                            if(clash6.length){
                              req.flash('error', 'Teacher not available on this timeslot Please Select others available teacher');
                              console.log("Clash in 6 Normal Timetable");
                              return res.redirect('/timetable_relief');
                            }
                            else
                            {
                              var timetableData = {
                                teacher: req.body.teacher,
                                timeslot: req.body.timeslot,
                                subject: req.body.subject,
                                classroom:  req.body.classroom,
                                day: req.body.day,
                                session: req.body.session,
                                replacement: req.body.replacement
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
                                  return res.redirect('/timetable_relief');
                                }
                              });
                              
                            }
                          });
                        }
                      

                    
                  });

                }
              });

              
            }
          });

        }
      });
    
    
    }
    else
    {
      var err = new Error('All fields have to be filled out');
      err.status = 400;
      return next(err);
    }
})

router.get('/timetable_remove/:id',mid, function (req,res){
  Teacher.findById(req.session.userId).exec(function (error, user){
    if (error){
      return next(error);
    }else
    {
      Timetable_relief.deleteOne({_id:req.params.id}).exec(function(err, timetable){
        if (err) throw err;
        console.log(timetable);
        res.redirect('/admin_user');
      });
    }
  });
})







/*

router.post('/find_teacher', function (req, res, next) {
  if (
    req.body.teacher &&
    req.body.timeslot,
    req.body.subject,
    req.body.classroom,
    req.body.session,
    req.body.day,
    req.body.replacement) {

    var timetableData = {
      teacher: req.body.teacher,
      timeslot: req.body.timeslot,
      subject: req.body.subject,
      classroom:  req.body.classroom,
      day: req.body.day,
      session: req.body.session,
      replacement: req.body.replacement
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

});  */



module.exports = router;


/*

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