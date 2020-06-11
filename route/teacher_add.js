var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Subject = require('../models/subject');
var mid  = require('../middleware/requiresLogin.js');


//get add teacher module page
router.get('/teacher_add',mid, function(req, res, user) {
    User.findById(req.session.userId).exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        console.log(user);
        Subject.find({},function(err,subject){
          if (err) throw err;
          return res.render('admin_content/teacher_add', { 'subject':subject, user:user});
        });
       
        ;
      }
    });
    
  });

//add teacher detail in database
router.post('/teacher_add', function (req, res, next){
    if(
    req.body._subject 
    && req.body.experience,
    req.body.second_subject.
    req.body.level)
    {
        var teacherData = {
            subject: req.body.subject,
            experience: req.body.experience,
            second_subject: req.body.secondary_subject,
            level: req.body.level,
            userId:req.session.userId,
        }

        //use schema.create to insert data into the db

        Teacher.create(teacherData, function (err, user){
            if(err){
                return next(err)
            }else
            {
                console.log('Teacher details added')
                return res.redirect('/admin_user');
            }
        });

    }else
    {
        var err = new Error('All fields have to be filled out');
        err.status = 400;
        return next(err);
    }
  });

module.exports = router;