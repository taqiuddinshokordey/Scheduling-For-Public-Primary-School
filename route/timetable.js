var express = require('express');
var router = express.Router();
var Timetable = require('../models/timetable_annual');
var Subject = require('../models/subject');
var Classroom = require('../models/classroom');
var Teacher = require('../models/user');
var mid  = require('../middleware/requiresLogin.js');

//view Timetable
router.get('/timetable',mid, function(req, res) {
  res.render('admin_content/timetable', { });
});

/*
router.get('/timetable_add',mid, function(req,res){
  Subject.find({},function(err,result) {
    if (err) throw err;
    res.render('admin_content/timetable_add',{dropdownSubject: result});
    console.log(result);
  });

  Classroom.find({},function(err,result2){
    if (err) throw err;
    res.render('admin_content/timetable_add',{dropdownSubject2: result2});
    console.log(result);
  });
}
);*/

router.get("/timetable_add", function(req, res) {
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
              Teacher.find({}, function(err, collection3)
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


router.post('/timetable_add', function (req, res, next) {
  if (
    req.body.teacher &&
    req.body.timeslot,
    req.body.subject,
    req.body.classroom ) {

    var timetableData = {
      teacher: req.body.teacher,
      timeslot: req.body.timeslot,
      subject: req.body.subject,
      classroom:  req.body.classroom
    }

    //use schema.create to insert data into the db
    Timetable.create(timetableData, function (err, user) {
      if (err) {
        return next(err)
      } else 
      {
      if(user.roles=='teacher')
      {
        console.log('teacher Registered');
        return res.redirect('/admin_user');
      }
      console.log('User Registered');
      return res.redirect('/admin_user');
      }
    });

  } else {
    var err = new Error('All fields have to be filled out');
    err.status = 400;
    return next(err);
  }

});

module.exports = router;

