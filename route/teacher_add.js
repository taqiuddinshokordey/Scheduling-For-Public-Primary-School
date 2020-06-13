var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Teacher = require('../models/teacher');
var mid  = require('../middleware/requiresLogin.js');


//get add teacher module page
router.get('/register_teacher',mid, function(req,res){
  User.findById(req.session.userId).exec(function (error, user) {
    if (error) {
      return next(error);
    } else {
      console.log(user);
      Teacher.find({}).populate('teacher_id').exec(function(err, teacher) 
      {
        // do stuff with post
        if (err) throw err;
        console.log(teacher);
        res.render('admin_content/register_teacher',{'teacher':teacher, user:user});
      });
    }
  });
  
});




module.exports = router;