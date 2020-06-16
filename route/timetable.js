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
        Teacher.find().exec(function(err, teacher) 
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

router.get('/timetable_class/view/:id',mid, function(req,res){
  Teacher.findById(req.session.userId).exec(function (error, user){
    if (error){
      return next(error);
    }else
    {
      Timetable.find({classroom:req.params.id, year:currentYear }).populate('classroom').exec(function(err, timetable) 
      {
        Classroom.find({}).exec(function (error, classroom){
          if (err) throw err;
        
         for (let i in classroom) {  
          console.log(classroom[0])
        }
         res.render('admin_content/view_timetable_class',{ timetable:timetable, user:user, classroom:classroom});
        });
        
      });
    }
  });
});

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
              Teacher.find({ roles: "Teacher" }, function(err, teacher)
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


//Add timetable
router.post('/timetable_morning', function (req, res, next) {
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
      year: currentYear,
      day: req.body.day,
      session: req.body.session
    }

    //use schema.create to insert data into the db
    Timetable.create(timetableData, function (err, user) {
      if (err) 
      {
        return next(err)
      } 
      else 
      {
        console.log(user);
        return res.redirect('/timetable');
      }
    });
    

    

  } else {
    var err = new Error('All fields have to be filled out');
    err.status = 400;
    return next(err);
    
  }

});

router.post('/timetable_evening', function (req, res, next) {
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
      year: currentYear,
      day: req.body.day,
      session: req.body.session
    }

    //use schema.create to insert data into the db
    Timetable.create(timetableData, function (err, user) {
      if (err) 
      {
        return next(err)
      } 
      else 
      {
        console.log(user);
        return res.redirect('/timetable');
      }
    });

  } else {
    var err = new Error('All fields have to be filled out');
    err.status = 400;
    return next(err);
    
  }

});


//Update logic



/*/Get Timetable By Category
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

module.exports = router;

