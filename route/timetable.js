var express = require('express');
var router = express.Router();
var Timetable = require('../models/timetable_annual');
var mid  = require('../middleware/requiresLogin.js');

//view Timetable

router.get('/timetable',mid, function(req,res){
    Timetable.find({},function(err,timetable){
      if (err) throw err;
      res.render('admin_content/timetable',{'timetable':timetable});
    });
});

