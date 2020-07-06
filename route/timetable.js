var express = require('express');
var router = express.Router();
var Timetable = require('../models/timetable_annual');
var Subject = require('../models/subject');
var Classroom = require('../models/classroom');
var Teacher = require('../models/user');
var Timetable_relief = require('../models/timetable_relief');
var mid  = require('../middleware/requiresLogin.js');


const ObjectID = require('mongodb').ObjectID

//Declare current Year and date
const todaysDate = new Date()
const currentYear = todaysDate.getFullYear()


//Timetable Homepage
router.get('/timetable',function(req,res){
  Teacher.findById(req.session.userId).exec(function (error, user){
    if (error){
      return next(error);
    }else
    {
      console.log(user);
      if(user.roles=='Admin')
        {
          res.render('admin_content/timetable', { user:user});

        }else if(user.roles=='Teacher')
        {
          console.log('teacher login');
          res.render('teacher_content/timetable', { user:user});
        }else
        {
          console.log('Time Table Creator login');
          res.render('creator_content/timetable', { user:user});
        }
    }
  });
});

//Display Timetable by teacher

router.get('/timetable_teacher',mid, function(req,res){
  Teacher.findById(req.session.userId).exec(function (error, user){
    if (error){
      return next(error);
    }else
    {
        Teacher.find({ roles: {$nin:[ "Admin" ]}}).exec(function(err, teacher) 
        {
        console.log(currentYear);
        console.log(teacher);
        res.render('admin_content/view_timetable_teacher',{teacher:teacher, user:user});
        });
        
      
    }
  });
});

//end of Timetable by Teacher

router.get('/timetable_class',mid, function(req,res){
  Teacher.findById(req.session.userId).exec(function (error, user){
    if (error){
      return next(error);
    }else
    {
        Classroom.find().exec(function(err, classroom) 
        {
        console.log(currentYear);
        console.log(classroom);
        res.render('admin_content/view_timetable_table',{classroom:classroom, user:user});
        });
        
      
    }
  });
});


router.get('/timetable_teacher/view/:id',mid, function(req,res){
  Teacher.findById(req.session.userId).exec(function (error, user) {
    if (error) {
      return next(error);
    } else {
      console.log(user);
      Timetable.find({teacher:req.params.id}).populate('teacher').populate('classroom').exec(function(err, timetable) 
      {
        // do stuff with post
        if (err) throw err;
        console.log(timetable);
        res.render('admin_content/view_timetable_subject',{timetable:timetable, user:user});
      });
    }
  });
  
});

router.get('/timetable_settings' ,mid, function (req,res){
  Teacher.findById(req.session.userId).exec(function (error, user){
    if (error){
      return next(error);
    }else
    {
      Timetable.find({}).exec(function(err, timetable){
        if (err) throw err;
        console.log(timetable);
        res.render('admin_content/timetable_settings',{timetable:timetable, user:user});
      });
    }
  });
})

router.get('/timetable_year',mid, function (req,res){
  Teacher.findById(req.session.userId).exec(function (error, user){
    if (error){
      return next(error);
    }else
    {
      Timetable.find({year:2020}).exec(function(err, timetable){
        if (err) throw err;
        console.log(timetable);
        res.render('admin_content/view_timetable_subject',{timetable:timetable, user:user});
      });
    }
  });
})

router.get('/timetable_edit/:id',mid, function (req,res){
  Teacher.findById(req.session.userId).exec(function (error, user){
    if (error){
      return next(error);
    }else
    {
      Timetable.find({_id:req.params.id}).exec(function(err, timetable){
        if (err) throw err;
        console.log(timetable);
        res.render('admin_content/timetable_settings',{timetable:timetable, user:user});
      });
    }
  });
})

router.get('/timetable_remove/:id',mid, function (req,res){
  Teacher.findById(req.session.userId).exec(function (error, user){
    if (error){
      return next(error);
    }else
    {
      Timetable.deleteOne({_id:req.params.id}).exec(function(err, timetable){
        if (err) throw err;
        console.log(timetable);
        res.render('admin_content/view_timetable_teacher',{teacher:teacher, user:user});
      });
    }
  });
})



//Get timetable add_page
router.get("/timetable_add",mid, function(req, res) {
  Teacher.findById(req.session.userId).exec(function (error, user){
    if(error){
      return next(error);
    }else
    {
      Subject.find({}, function(err, subject) 
      {
       if(err) 
       {
          console.log(err);
       } 
       else 
       {
          Classroom.find({}, function(err, classroom) 
          {
            if(err) 
            {
              console.log(err)
            }
            else 
            {
              Teacher.find({ roles: {$nin:[ "Admin" ]}}, function(err, teacher)
              {
                if (err)
                {
                  console.log(err);
                }
                else
                {
                  console.log(subject, classroom, teacher);
                 res.render("admin_content/timetable_add", {subject:subject, classroom:classroom, teacher:teacher ,user:user});
                }
              })
              
            }               
          }); 
       }
      });
    }
  });
  
});

router.post('/timetable_morning', function (req, res, next){
  if (req.body.teacher && req.body.timeslot,req.body.subject,req.body.classroom,req.body.session,req.body.day) 
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
        req.flash('error', 'Timetable Clashing please add with other slot');
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
            req.flash('error', 'Timetable Clashing please add with other slot');
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
                req.flash('error', 'Timetable Clashing please add with other slot');
                console.log("Document Already Exist in 3");
                return res.redirect('/timetable');
              }else
              {
                var timetableData = {
                  teacher: req.body.teacher,
                  timeslot: req.body.timeslot,
                  subject: req.body.subject,
                  classroom:  req.body.classroom,
                  year: currentYear,
                  day: req.body.day,
                  session: req.body.session
                }

                Timetable.create(timetableData, function (err, user){
                  if (err) 
                  {
                    return next(err)
                  } 
                  else 
                  {
                    req.flash('success', 'Successfully');
                    console.log(user);
                    return res.redirect('/timetable');
                  }
                });
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


router.post('/timetable_evening', function (req, res, next){
  if (req.body.teacher && req.body.timeslot,req.body.subject,req.body.classroom,req.body.session,req.body.day) 
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
        req.flash('error', 'Timetable Clashing please add with other slot');
        console.log("Document Already Exist in");
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
            req.flash('error', 'Timetable Clashing please add with other slot');
             console.log("Document Already Exist in");
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
                req.flash('error', 'Timetable Clashing please add with other slot');
                console.log("Document Already Exist in");
                return res.redirect('/timetable');
              }else
              {
                var timetableData = {
                  teacher: req.body.teacher,
                  timeslot: req.body.timeslot,
                  subject: req.body.subject,
                  classroom:  req.body.classroom,
                  year: currentYear,
                  day: req.body.day,
                  session: req.body.session
                }

                Timetable.create(timetableData, function (err, user){
                  if (err) 
                  {
                    return next(err)
                  } 
                  else 
                  {
                    req.flash('success', 'Timetable Successfully Added');
                    console.log(user);
                    return res.redirect('/timetable');
                  }
                });
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
  

//Update logic

/*

/*
router.get('/timetable_class/view/:id',mid, function(req,res){
  Teacher.findById(req.session.userId).exec(function (error, user){
    if (error){
      return next(error);
    }else
    {
      Timetable.find({year:currentYear, classroom:req.params.id}).populate('classroom').populate('subject').populate('user').exec(function(err, timetable) 
      {
        if (err) throw err;
        console.log(currentYear);
        console.log(timetable);
        res.render('admin_content/view_timetable_table',{timetable:timetable,  user:user});
      });
    }
  });
}); 
``
router.get('/timetable_teacher/view/:id',mid, function(req,res){
  Teacher.findById(req.session.userId).exec(function (error, user){
    if (error){
      return next(error);
    } else
    {
      // In place of .find() and .populate(), I'm using .aggregate()
      Timetable.aggregate([
        {
          // This is doing the same thing as the previous .find()
          $match: { year: currentYear, classroom:req.params.id}
        },
        // The stages($lookup and $set) below are doing what the previous
       // .populate() was doing
        {
          $lookup: {
            from: "Classroom",
            localField: "classroom",
            foreignField: "_id",
            as: "classroom"
          }
        },
        
        // Group the documents with their classroom.classroom_name value
        {
          $group: {
            _id: "$classroom.classroom_name",
            doc: { $first: "$$ROOT" }
          }
        },
        // A bit of cleanup 
        { $replaceRoot: { newRoot: "$doc" } }
        
      ]).exec(function(err, timetable) 
      {
        // The query output is such that `classroom.classroom_name`
        // value is unique for each document
        if (err) throw err;
        console.log(currentYear);
        console.log(timetable);
        res.render('admin_content/view_timetable_subject',{'timetable':timetable,  user:user});
      });
    }
  });
}); */


/*
//Get Timetable By Category
router.get('/timetable_class',mid, function(req,res){
  Teacher.findById(req.session.userId).exec(function (error, user){
    if (error){
      return next(error);
    }else
    {
      Timetable.distinct("classroom" ,{year:currentYear},function(err,timetable){
        if (err) throw err;
        console.log(currentYear);
        console.log(timetable);
        res.render('admin_content/view_timetable_table',{'timetable':timetable,  user:user});
      });
    }
  });
});



router.get('/timetable_teacher',mid, function(req,res){
  Teacher.findById(req.session.userId).exec(function (error, user){
    if(error){
      return next(error);
    }else
    {
      Timetable.distinct("teacher" ,{year:currentYear},function(err,timetable){
        if (err) throw err;
        console.log(currentYear);
        console.log(timetable);
        res.render('admin_content/view_timetable_teacher',{'timetable':timetable, user:user});
      });
    }
  });
});

router.get('/timetable_teacher/view/:id',mid, function(req,res){
  Teacher.findById(req.session.userId).exec(function (error, user){
    if (error){
      return next(error);
    }else
    {
      Timetable.distinct('teacher',({teacher: req.params.id, year: currentYear}),function(err,timetable){
        if (err) throw err;
        console.log(currentYear);
        console.log(timetable );
        res.render('admin_content/view_timetable_class',{'timetable':timetable, user:user});
      });
    }
  });
});

router.get('/timetable_subject',mid, function(req,res){
  Teacher.findById(req.session.userId).exec(function (error, user){
    if(error){
      return next(error);
    }else
    {
      Timetable.distinct("subject" ,{year:currentYear},function(err,timetable){
        if (err) throw err;
        console.log(currentYear);
        console.log(timetable);
        res.render('admin_content/view_timetable_subject',{'timetable':timetable, user:user});
      });
    }
  });
});

router.get('/timetable_year',mid, function(req,res){
  Teacher.findById(req.session.userId).exec(function (error, user){
    if(error){
      return next(error);
    }else
    {
      Timetable.distinct("year",function(err,timetable){
        if (err) throw err;
        console.log(currentYear);
        console.log(timetable);
        res.render('admin_content/view_timetable_table',{'timetable':timetable, user:user});
      });
    }
  });
});

router.get('/timetable_class/edit/:id', function(req,res){
  Timetable.find({classroom:req.params.id},function(err,timetable){
    console.log(timetable);
      res.render('admin_content/view_timetable_class',{'timetable':timetable});
  });
});
 */

/* router.get('/timetable_class/view/:id',mid, function(req,res){
  Teacher.findById(req.session.userId).exec(function (error, user){
    if (error){
      return next(error);
    }else
    {
      Timetable.find({classroom:req.params.id, year:currentYear }).populate('classroom').exec(function(err, timetable) 
      {
        Classroom.find({}).exec(function (error, classroom){
          if (err) throw err;
        
         
         res.render('admin_content/view_timetable_class',{ timetable:timetable, user:user, classroom:classroom});
        });
        
      });
    }
  });
}); */

module.exports = router;

