var express = require('express');
var router = express.Router();
var Timetable = require('../models/timetable_annual');
var Subject = require('../models/subject');
var Classroom = require('../models/classroom');
var Teacher = require('../models/user');
var mid  = require('../middleware/requiresLogin.js');



//display slot left

router.get('/timetable',mid, function(req,res){
  Timetable.find({ year: "2020"},function(err,timetable){
    if (err) throw err;
    res.render('admin_content/timetable',{'timetable':timetable});
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

module.exports = router;

