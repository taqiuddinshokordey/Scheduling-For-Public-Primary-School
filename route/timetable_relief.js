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
      res.render('admin_content/timetable', { user:user});
    }
  });
});