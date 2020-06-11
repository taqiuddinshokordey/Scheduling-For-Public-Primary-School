var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Subject = require('../models/subject');
var mid  = require('../middleware/requiresLogin.js');


router.get('/admin_user',mid, function(req,res){
  User.findById(req.session.userId).exec(function (error, user) {
    if (error) {
      return next(error);
    } else {
      console.log(user);
      User.find({},function(err,users){
        if (err) throw err;
        res.render('admin_content/admin_user',{'users':users, user:user});
      });
    }
  });
  
});


//Register User
router.get('/register',mid, function(req, res, user) {
  User.findById(req.session.userId).exec(function (error, user) {
    if (error) {
      return next(error);
    } else {
      console.log(user);
      Subject.find({},function(err,subject)
      {
        if (err) throw err;
        return res.render('admin_content/register_user', { "subject":subject, user:user});
      });
      
      
    }
  });
  
});

router.get('/register_csv',mid, function(req, res, user) {
  User.findById(req.session.userId).exec(function (error, user) {
    if (error) {
      return next(error);
    } else {
      console.log(user);
      return res.render('admin_content/register_user_csv', { user:user});
      ;
    }
  });
  
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
        if(user.roles=='Admin')
        {
          console.log('Admin Registered');
          return res.redirect('/admin_user');
        }
        console.log('teacher Registered')
        return res.redirect('/teacher_add');
        }
      });
  
    } else {
      var err = new Error('All fields have to be filled out');
      err.status = 400;
      return next(err);
    }
  
  });

//Register Logic End



//user edit
router.get('/admin_user/edit/:id',function(req,res){
  User.findById(req.session.userId).exec(function (error, user) {
    if (error) {
      return next(error);
    } else {
      console.log(user);
      User.find({},function(err,users){
        if (err) throw err;
        User.findOne({_id:req.params.id},function(err,users){
          res.render('admin_content/edit_user',{'users':users, user:user});
      });
      });
      ;
    }
  });
});

router.post('/admin_user/edit/:id',function(req,res){
  // update Data
  var updateData={
    username: req.body.username,
    name: req.body.name,
    roles: req.body.roles
  };
  var message='Data has been not updated';
  User.updateOne({_id:req.params.id},updateData,function(err,numrows){
      if(!err){
        console.log('User Updated');
          res.redirect('/admin_user');
      }
  });
});

//end user edit

//user delete
router.get('/admin_user/delete/:id',function(req,res){
  User.deleteOne({_id:req.params.id},function(err){
    if(!err)
    {
        res.redirect('/admin_user');
    }
});
});

//end user delete


module.exports = router;

