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
  res.render('admin_content/timetable', { });
});

//Get Timetable By Class
router.get('/timetable_class',mid, function(req,res){
  Timetable.distinct("classroom" ,{year:currentYear},function(err,timetable){
    if (err) throw err;
    console.log(currentYear);
    console.log(timetable);
    res.render('admin_content/view_timetable_table',{'timetable':timetable});
  });
});

router.get('/timetable_class/view/:id',mid, function(req,res){
  Timetable.distinct('classroom',({classroom: req.params.id, year: currentYear}),function(err,timetable){
    if (err) throw err;
    console.log(currentYear);
    console.log(timetable );
    res.render('admin_content/view_timetable_class',{'timetable':timetable});
  });
});

router.get('/timetable_teacher',mid, function(req,res){
  Timetable.distinct("teacher" ,{year:currentYear},function(err,timetable){
    if (err) throw err;
    console.log(currentYear);
    console.log(timetable);
    res.render('admin_content/view_timetable_teacher',{'timetable':timetable});
  });
});

router.get('/timetable_subject',mid, function(req,res){
  Timetable.distinct("subject" ,{year:currentYear},function(err,timetable){
    if (err) throw err;
    console.log(currentYear);
    console.log(timetable);
    res.render('admin_content/view_timetable_subject',{'timetable':timetable});
  });
});


//Add timetable
router.get("/timetable_add",mid, function(req, res) {
  Subject.find({}, function(err, collection) 
  {
       if(err) 
       {
          console.log(err);
       } 
       else 
       {
          Classroom.find({}, function(err, collection2) 
          {
            if(err) 
            {
              console.log(err)
            }
            else 
            {
              Teacher.find({ roles: "teacher" }, function(err, collection3)
              {
                if (err)
                {
                  console.log(err);
                }
                else
                {
                console.log(collection3, collection2,collection);
                 res.render("admin_content/timetable_add", 
                 {collection: collection, collection2: collection2, collection3: collection3});
                }
              })
              
            }               
          }); 
       }
  });
});


router.post('/timetable_add',mid, function (req, res, next) {
  if (
    req.body.teacher &&
    req.body.timeslot,
    req.body.subject,
    req.body.classroom,
    req.body.year) {

    var timetableData = {
      teacher: req.body.teacher,
      timeslot: req.body.timeslot,
      subject: req.body.subject,
      classroom:  req.body.classroom,
      year: req.body.year
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


router.get('/timetable_class/edit/:id', function(req,res){
  Timetable.find({classroom:req.params.id},function(err,timetable){
    console.log(timetable);
      res.render('admin_content/view_timetable_class',{'timetable':timetable});
  });
});

module.exports = router;

