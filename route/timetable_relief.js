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
        Timetable_relief.find({day:weekday, flag:1}).populate('replacement').populate('classroom').exec(function (error, replacement){
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


router.post('/find_teacher', function (req, res, next) {
  if (req.body.teacher && 
    req.body.timeslot,
    req.body.subject,
    req.body.classroom,
    req.body.session,
    req.body.day,
    req.body.replacement) 
  {
    var clashing1 = {
      teacher: req.body.teacher,
      timeslot: req.body.timeslot,
      classroom:  req.body.classroom,
      day: req.body.day,
    }

    Timetable.find(clashing1, function (err, clash1){
      if (clash1.length)
      {
        console.log("Document Already Exist in 1");
        return res.redirect('/timetable');

      }else
      {
        var clashing2 = {
          timeslot: req.body.timeslot,
          classroom:  req.body.classroom,
          day: req.body.day,
        }

        Timetable.find(clashing2, function (err, clash2){
          if (clash2.length)
          {

             console.log("Document Already Exist in 2");
             return res.redirect('/timetable');

          }else
          {
            var clashing3 = {
              timeslot: req.body.timeslot,
              teacher: req.body.teacher,
              day: req.body.day,
            }
            
            Timetable.find(clashing3, function (err, clash3){
              if (clash3.length)
              {
                console.log("Document Already Exist in 3");
                return res.redirect('/timetable');
              }else
              {
                var clashing4 = {
                  replacement: req.body.replacement,
                  timeslot: req.body.timeslot,
                  classroom:  req.body.classroom,
                  day: req.body.day,
                }

                Timetable_relief(clashing4, function (err, clash4){
                  if (clash4.length)
                  {
                    console.log("Document Already Exist in 4");
                    return res.redirect('/timetable');
                  }else
                  {
                    var clashing5 = {
                      timeslot: req.body.timeslot,
                      classroom:  req.body.classroom,
                      day: req.body.day,
                    }

                    Timetable_relief(clashing5, function (err, clash5){
                      if(clash5.length)
                      {
                        console.log("Document Already Exist in 5");
                        return res.redirect('/timetable');
                      }
                      else
                      {
                        var clashing6 = {
                          timeslot: req.body.timeslot,
                          replacement: req.body.replacement,
                          day: req.body.day,
                        }
                        Timetable_relief(clashing6, function (err, clash6){
                          if (clash6.length){
                            console.log("Document Already Exist in 6");
                            return res.redirect('/timetable');
                          }else
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
                                return res.redirect('/find_teacher');
                              }
                            });

                          }
                        })
                      }
                    })
                  }
                })
              }
            });
          }
        });

      }
    });
  }else
  {
    
    var err = new Error('All fields have to be filled out');
    err.status = 400;
    return next(err);


  }

});



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

*/



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