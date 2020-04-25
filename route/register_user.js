var express = require('express');
var router = express.Router();
var User = require('../models/user');
var mid  = require('../middleware/requiresLogin.js');


//get landing page
router.get('/register',mid, function(req, res) {
  res.render('admin_content/register_user', { });
});

//add new user 
 
router.post('/register', function (req, res, next) {
    if (
      req.body.username &&
      req.body.password,
      req.body.name,
      req.body.roles ) {
  
      var userData = {
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
        roles: req.body.roles
      }
  
      //use schema.create to insert data into the db
      User.create(userData, function (err, user) {
        if (err) {
          return next(err)
        } else 
        {
        if(user.roles=='teacher')
        {
          console.log('teacher Registered');
          return res.redirect('/admin_user/:id');
        }
        console.log('User Registered');
        return res.redirect('/admin_user/:id');
        }
      });
  
    } else {
      var err = new Error('All fields have to be filled out');
      err.status = 400;
      return next(err);
    }
  
  });

//Register Logic End

//show user list

router.get('/admin_user',mid, function(req,res){
  User.find({},function(err,users){
    if (err) throw err;
    res.render('admin_content/admin_user',{'users':users});
  });
});

//user edit
router.get('/admin_user/edit/:id',function(req,res){
  User.findOne({staff_id:req.params.id},function(err,users){
      res.render('admin_content/edit_user',{'users':users});
  });
});

router.post('/admin_user/edit/id', function(req,res){
  var updateData={

    username: req.body.username,
    password: req.body.password,
    name: req.body.name,
    roles: req.body.roles
  }
  User.update({staff_id:req.params.id},updateData,function(err,numrows){
    if(!err)
    {
      console.log('User Update');
      res.redirect('/admin_user');
    }
});
})

//end user edit

//user delete
router.get('/admin_user/delete/:id',function(req,res){
  User.deleteOne({staff_id:req.params.id},function(err){
    if(!err){
        res.redirect('/admin_user');
    }
});
});

//end user delete


module.exports = router;

